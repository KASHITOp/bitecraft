// Supabase Edge Function: chat (Chef Chat - "Fridge Raid")
// Grounded recipe recommendations using gemini-2.0-flash

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PantryItemPayload {
  ingredient_id: number;
  name?: string;
  quantity_grams?: number;
  expiry_date?: string;
  days_until_expiry?: number;
}

interface ChatRequest {
  message: string;
  pantryIds?: number[];
  pantry_items?: PantryItemPayload[];
  history?: { role: "user" | "model"; text: string }[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      message,
      pantryIds = [],
      pantry_items = [],
      history = [],
    } = (await req.json()) as ChatRequest;

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Collect effective pantry ingredient IDs from both pantryIds and pantry_items
    const extractedIds = (pantry_items || [])
      .map((item) => item.ingredient_id)
      .filter((id) => typeof id === "number");
    const effectivePantryIds = Array.from(new Set([...pantryIds, ...extractedIds]));

    // 1. Retrieve Candidate Recipes from Postgres
    let candidateRecipes: any[] = [];
    if (effectivePantryIds.length > 0) {
      // First attempt match_pantry_recipes (prioritizes ingredient coverage)
      const { data: rpcRecipes, error: rpcError } = await supabase.rpc("match_pantry_recipes", {
        ingredient_ids: effectivePantryIds,
      });

      if (!rpcError && rpcRecipes && rpcRecipes.length > 0) {
        candidateRecipes = rpcRecipes.slice(0, 15);
      } else {
        // Fallback to match_pantry
        const { data: legacyRpcData } = await supabase.rpc("match_pantry", {
          pantry_ids: effectivePantryIds,
          min_coverage: 0.1,
        });
        if (legacyRpcData && legacyRpcData.length > 0) {
          candidateRecipes = legacyRpcData.slice(0, 15);
        }
      }
    }

    if (candidateRecipes.length < 5) {
      // Keyword search in search_vector or title
      const terms = message.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").filter((w) => w.length > 2);
      const searchTerm = terms.slice(0, 3).join(" | ");

      let query = supabase.from("recipes").select("id, title, budget_tier, minutes, cost_per_serving, macros, image_url, emoji");
      if (searchTerm) {
        query = query.textSearch("search_vector", searchTerm);
      }
      const { data: searchData } = await query.limit(15);
      if (searchData && searchData.length > 0) {
        const existingIds = new Set(candidateRecipes.map((r) => r.id));
        for (const item of searchData) {
          if (!existingIds.has(item.id)) {
            candidateRecipes.push(item);
          }
        }
      }
    }

    // Fallback if still low
    if (candidateRecipes.length === 0) {
      const { data: fallbackData } = await supabase
        .from("recipes")
        .select("id, title, budget_tier, minutes, cost_per_serving, macros, image_url, emoji")
        .order("cost_per_serving", { ascending: true })
        .limit(6);
      candidateRecipes = fallbackData ?? [];
    }

    // Format current pantry items with expiry proximity for Gemini
    let pantryInventorySummary = "No pantry items listed.";
    if (pantry_items && pantry_items.length > 0) {
      pantryInventorySummary = pantry_items
        .map((item) => {
          const nameStr = item.name ?? `Ingredient #${item.ingredient_id}`;
          const qtyStr = item.quantity_grams ? ` (${item.quantity_grams}g)` : "";
          let expStr = "";
          if (item.days_until_expiry !== undefined && item.days_until_expiry !== null) {
            if (item.days_until_expiry < 0) {
              expStr = " [EXPIRED]";
            } else if (item.days_until_expiry === 0) {
              expStr = " [EXPIRES TODAY - CRITICAL!]";
            } else if (item.days_until_expiry <= 2) {
              expStr = ` [EXPIRING SOON: ${item.days_until_expiry} day(s) left - URGENT!]`;
            } else {
              expStr = ` [Expires in ${item.days_until_expiry} days]`;
            }
          } else if (item.expiry_date) {
            expStr = ` [Expiry: ${item.expiry_date}]`;
          }
          return `- ${nameStr}${qtyStr}${expStr}`;
        })
        .join("\n");
    }

    // 2. Call Gemini if GEMINI_API_KEY is configured
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      // Return structured response without AI key (local fallback path)
      return new Response(
        JSON.stringify({
          source: "local-fallback",
          reply: `Hey! I raided your pantry and catalog. Here are ${candidateRecipes.length} top options matching your ingredients:`,
          recipes: candidateRecipes.slice(0, 4),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Gemini 2.0 Flash
    const systemPrompt = `You are BiteCraft Chef AI, an encouraging, smart senior-student culinary guide for students living in hostels or solo flats.
You MUST ONLY recommend recipes from the candidate catalog provided below. NEVER invent recipes or IDs.
When suggesting recipes, you MUST prioritize recipes that use up the ingredients in the user's pantry, especially those expiring soon. If the user asks 'What should I cook?', suggest a recipe that clears their expiring items.

User Pantry Inventory & Expiring Stock:
${pantryInventorySummary}

Candidate Catalog:
${candidateRecipes.map((r) => `[ID ${r.id}] "${r.title}" (₹${r.cost_per_serving}, ${r.minutes}m, ${r.macros?.protein ?? 0}g protein)`).join("\n")}

Instructions:
1. Warm, concise, practical hostel advice (light Hinglish flavor like "Bhai/Dost, super easy one-pot meal" is welcome).
2. Reference the exact recipe IDs using the token [RECIPE_ID: <id>] so the app can render interactive cards.
3. Keep response under 100 words.`;

    const contents = [
      ...history.slice(-6).map((h) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
      { role: "user", parts: [{ text: `${systemPrompt}\n\nStudent message: "${message}"` }] },
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7500); // 7.5s timeout

    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      const geminiData = await geminiRes.json();
      const generatedText =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "Here are some great options from your pantry!";

      // Extract referenced IDs
      const referencedIdMatches = generatedText.matchAll(/\[RECIPE_ID:\s*(\d+)\]/g);
      const matchedIds = new Set<number>();
      for (const m of referencedIdMatches) {
        matchedIds.add(parseInt(m[1], 10));
      }

      let selectedRecipes = candidateRecipes.filter((r) => matchedIds.has(r.id));
      if (selectedRecipes.length === 0) {
        selectedRecipes = candidateRecipes.slice(0, 3);
      }

      return new Response(
        JSON.stringify({
          source: "gemini",
          reply: generatedText.replace(/\[RECIPE_ID:\s*(\d+)\]/g, "").trim(),
          recipes: selectedRecipes,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (_geminiError) {
      // Graceful timeout or network failure fallback
      return new Response(
        JSON.stringify({
          source: "local-fallback",
          reply: `Network chef was a bit slow, but I found these great grounded matches for you:`,
          recipes: candidateRecipes.slice(0, 4),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
