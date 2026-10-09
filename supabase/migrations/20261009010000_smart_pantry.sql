-- BiteCraft Supabase Migration: Smart Pantry
-- Feature: user_pantry table + match_pantry_recipes RPC

-- 1. Create user_pantry table
CREATE TABLE IF NOT EXISTS public.user_pantry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL,
    ingredient_id BIGINT NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
    quantity_grams DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    purchase_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expiry_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indexes for fast retrieval by device and expiry queries
CREATE INDEX IF NOT EXISTS idx_user_pantry_device_id ON public.user_pantry(device_id);
CREATE INDEX IF NOT EXISTS idx_user_pantry_ingredient_id ON public.user_pantry(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_user_pantry_expiry_date ON public.user_pantry(expiry_date);
CREATE INDEX IF NOT EXISTS idx_user_pantry_device_expiry ON public.user_pantry(device_id, expiry_date);

-- 3. Row Level Security (RLS)
ALTER TABLE public.user_pantry ENABLE ROW LEVEL SECURITY;

-- Allow anonymous / device-based read and write access for zero-login users
CREATE POLICY "Public and anon user_pantry read" ON public.user_pantry
    FOR SELECT USING (true);

CREATE POLICY "Public and anon user_pantry insert" ON public.user_pantry
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public and anon user_pantry update" ON public.user_pantry
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Public and anon user_pantry delete" ON public.user_pantry
    FOR DELETE USING (true);

-- 4. PostgreSQL RPC: match_pantry_recipes
-- Takes an array of ingredient_ids and returns recipes ordered by highest ingredient coverage
CREATE OR REPLACE FUNCTION public.match_pantry_recipes(
    ingredient_ids BIGINT[]
)
RETURNS TABLE (
    id BIGINT,
    title TEXT,
    cuisine TEXT,
    budget_tier TEXT,
    goals TEXT[],
    minutes INT,
    equipment_tags TEXT[],
    servings INT,
    macros JSONB,
    cost_per_serving NUMERIC,
    cost_full_pack NUMERIC,
    image_url TEXT,
    emoji TEXT,
    gradient_seed INT,
    total_ingredients INT,
    matched_ingredients INT,
    missing_ingredients INT,
    coverage FLOAT
) AS $$
BEGIN
    RETURN QUERY
    WITH recipe_coverage AS (
        SELECT 
            r.id AS r_id,
            COUNT(ri.ingredient_id)::INT AS total_count,
            COUNT(ri.ingredient_id) FILTER (WHERE ri.ingredient_id = ANY(ingredient_ids))::INT AS match_count
        FROM public.recipes r
        JOIN public.recipe_ingredients ri ON ri.recipe_id = r.id
        GROUP BY r.id
    )
    SELECT 
        r.id,
        r.title,
        r.cuisine,
        r.budget_tier,
        r.goals,
        r.minutes,
        r.equipment_tags,
        r.servings,
        r.macros,
        r.cost_per_serving,
        r.cost_full_pack,
        r.image_url,
        r.emoji,
        r.gradient_seed,
        rc.total_count AS total_ingredients,
        rc.match_count AS matched_ingredients,
        (rc.total_count - rc.match_count) AS missing_ingredients,
        CASE WHEN rc.total_count > 0 THEN (rc.match_count::FLOAT / rc.total_count::FLOAT) ELSE 0.0 END AS coverage
    FROM recipe_coverage rc
    JOIN public.recipes r ON r.id = rc.r_id
    WHERE rc.match_count > 0
    ORDER BY 
        coverage DESC,
        missing_ingredients ASC,
        r.cost_per_serving ASC;
END;
$$ LANGUAGE plpgsql STABLE;
