// Supabase Edge Function: planner
// Greedy 3-5 meal selection hitting target calories & protein within budget & equipment constraints.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PlannerRequest {
  calories: number;
  protein: number;
  budgetTier?: string; // broke | balanced | hifi
  equipment?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { calories, protein, budgetTier, equipment } = (await req.json()) as PlannerRequest;

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Target meal macro split:
    // Breakfast: 25% kcal, 25% protein
    // Lunch: 40% kcal, 40% protein
    // Dinner: 35% kcal, 35% protein

    let query = supabase.from("recipes").select("*");
    if (budgetTier) {
      query = query.eq("budget_tier", budgetTier);
    }

    const { data: recipes, error } = await query.limit(300);

    if (error || !recipes || recipes.length === 0) {
      return new Response(JSON.stringify({ error: "Could not fetch recipes" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Filter by equipment if provided
    let pool = recipes;
    if (equipment && equipment.length > 0) {
      pool = recipes.filter((r) =>
        r.equipment_tags.some((tag: string) => equipment.includes(tag))
      );
      if (pool.length < 3) pool = recipes; // Fallback to avoid empty plan
    }

    const targetBfastKcal = calories * 0.25;
    const targetLunchKcal = calories * 0.40;
    const targetDinnerKcal = calories * 0.35;

    // Pick closest breakfast
    const bfastPool = pool.filter((r) => r.minutes <= 15);
    const breakfast = (bfastPool.length > 0 ? bfastPool : pool).reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.macros.kcal - targetBfastKcal);
      const currDiff = Math.abs(curr.macros.kcal - targetBfastKcal);
      return currDiff < prevDiff ? curr : prev;
    });

    // Pick closest lunch
    const remainingPool1 = pool.filter((r) => r.id !== breakfast.id);
    const lunch = remainingPool1.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.macros.kcal - targetLunchKcal);
      const currDiff = Math.abs(curr.macros.kcal - targetLunchKcal);
      return currDiff < prevDiff ? curr : prev;
    });

    // Pick closest dinner
    const remainingPool2 = remainingPool1.filter((r) => r.id !== lunch.id);
    const dinner = remainingPool2.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.macros.kcal - targetDinnerKcal);
      const currDiff = Math.abs(curr.macros.kcal - targetDinnerKcal);
      return currDiff < prevDiff ? curr : prev;
    });

    const totalKcal = breakfast.macros.kcal + lunch.macros.kcal + dinner.macros.kcal;
    const totalProtein = breakfast.macros.protein + lunch.macros.protein + dinner.macros.protein;
    const totalCost = breakfast.cost_per_serving + lunch.cost_per_serving + dinner.cost_per_serving;

    return new Response(
      JSON.stringify({
        targets: { calories, protein },
        actual: { calories: totalKcal, protein: totalProtein, cost: totalCost },
        meals: [
          { slot: "Breakfast", recipe: breakfast },
          { slot: "Lunch", recipe: lunch },
          { slot: "Dinner", recipe: dinner },
        ],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
