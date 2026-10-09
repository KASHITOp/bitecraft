-- BiteCraft Supabase Schema & Extensions
-- Android Package: com.bitecraft.app

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tables

-- Ingredients table with dual-names (name + aliases)
CREATE TABLE IF NOT EXISTS public.ingredients (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    aliases TEXT[] NOT NULL DEFAULT '{}',
    category TEXT NOT NULL,
    pack_size TEXT NOT NULL,
    avg_pack_price NUMERIC(10,2) NOT NULL DEFAULT 0.00
);

-- Recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    budget_tier TEXT NOT NULL CHECK (budget_tier IN ('broke', 'balanced', 'hifi')),
    goals TEXT[] NOT NULL DEFAULT '{}',
    minutes INT NOT NULL DEFAULT 15,
    equipment_tags TEXT[] NOT NULL DEFAULT '{}',
    servings INT NOT NULL DEFAULT 1,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    macros JSONB NOT NULL DEFAULT '{"kcal": 0, "protein": 0, "carbs": 0, "fats": 0, "fiber": 0}'::jsonb,
    cost_per_serving NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    cost_full_pack NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    image_url TEXT,
    emoji TEXT NOT NULL DEFAULT '🍲',
    gradient_seed INT NOT NULL DEFAULT 1,
    search_vector TSVECTOR,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recipe Ingredients junction table
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
    id BIGSERIAL PRIMARY KEY,
    recipe_id BIGINT NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    ingredient_id BIGINT NOT NULL REFERENCES public.ingredients(id) ON DELETE RESTRICT,
    qty NUMERIC(10,2) NOT NULL DEFAULT 1.0,
    unit TEXT NOT NULL DEFAULT 'unit'
);

-- Store Prices table (Zepto, Blinkit, Instamart)
CREATE TABLE IF NOT EXISTS public.store_prices (
    id BIGSERIAL PRIMARY KEY,
    ingredient_id BIGINT NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
    store TEXT NOT NULL CHECK (store IN ('ZEPTO', 'BLINKIT', 'INSTAMART')),
    price NUMERIC(10,2) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (ingredient_id, store)
);

-- Favorites table (scoped to anonymous / authenticated auth.uid())
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID NOT NULL,
    recipe_id BIGINT NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, recipe_id)
);

-- Profiles table (stores user macro targets and saved pantry)
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id UUID PRIMARY KEY,
    targets JSONB NOT NULL DEFAULT '{"calories": 2200, "protein": 120, "budget": "balanced"}'::jsonb,
    pantry BIGINT[] NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Indexes & Full-Text Search
CREATE INDEX IF NOT EXISTS idx_recipes_budget_tier ON public.recipes(budget_tier);
CREATE INDEX IF NOT EXISTS idx_recipes_minutes ON public.recipes(minutes);
CREATE INDEX IF NOT EXISTS idx_recipes_cost ON public.recipes(cost_per_serving);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON public.recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_ingredient ON public.recipe_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_store_prices_ingredient ON public.store_prices(ingredient_id);

-- Trigram index for fuzzy typo search on title
CREATE INDEX IF NOT EXISTS idx_recipes_title_trgm ON public.recipes USING GIN (title gin_trgm_ops);

-- Full text search GIN index
CREATE INDEX IF NOT EXISTS idx_recipes_search_vector ON public.recipes USING GIN (search_vector);

-- 4. Automatic search_vector generation trigger
CREATE OR REPLACE FUNCTION public.update_recipe_search_vector()
RETURNS TRIGGER AS $$
DECLARE
    ing_names TEXT;
    ing_aliases TEXT;
BEGIN
    SELECT 
        COALESCE(string_agg(i.name, ' '), ''),
        COALESCE(string_agg(array_to_string(i.aliases, ' '), ' '), '')
    INTO ing_names, ing_aliases
    FROM public.recipe_ingredients ri
    JOIN public.ingredients i ON i.id = ri.ingredient_id
    WHERE ri.recipe_id = NEW.id;

    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.cuisine, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(ing_names, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(ing_aliases, '')), 'A');
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_recipe_search_vector ON public.recipes;
CREATE TRIGGER trg_recipe_search_vector
BEFORE INSERT OR UPDATE ON public.recipes
FOR EACH ROW EXECUTE FUNCTION public.update_recipe_search_vector();

-- 5. Postgres RPC match_pantry
CREATE OR REPLACE FUNCTION public.match_pantry(
    pantry_ids BIGINT[],
    min_coverage FLOAT DEFAULT 0.0,
    target_tier TEXT DEFAULT NULL,
    target_goal TEXT DEFAULT NULL,
    max_minutes INT DEFAULT NULL
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
            COUNT(ri.ingredient_id) FILTER (WHERE ri.ingredient_id = ANY(pantry_ids))::INT AS match_count
        FROM public.recipes r
        JOIN public.recipe_ingredients ri ON ri.recipe_id = r.id
        WHERE (target_tier IS NULL OR r.budget_tier = target_tier)
          AND (target_goal IS NULL OR target_goal = ANY(r.goals))
          AND (max_minutes IS NULL OR r.minutes <= max_minutes)
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
    WHERE (CASE WHEN rc.total_count > 0 THEN (rc.match_count::FLOAT / rc.total_count::FLOAT) ELSE 0.0 END) >= min_coverage
    ORDER BY 
        coverage DESC,
        missing_ingredients ASC,
        r.cost_per_serving ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- 6. Row Level Security (RLS)
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public recipes read" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Public ingredients read" ON public.ingredients FOR SELECT USING (true);
CREATE POLICY "Public recipe_ingredients read" ON public.recipe_ingredients FOR SELECT USING (true);
CREATE POLICY "Public store_prices read" ON public.store_prices FOR SELECT USING (true);

-- User scoped policies for favorites
CREATE POLICY "Users can manage own favorites" ON public.favorites
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- User scoped policies for profiles
CREATE POLICY "Users can manage own profile" ON public.profiles
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 7. Public storage bucket for recipe images
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipe-images', 'recipe-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public recipe images access" ON storage.objects
FOR SELECT USING (bucket_id = 'recipe-images');
