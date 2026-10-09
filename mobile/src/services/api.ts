import { Recipe, StoreComparison, DayPlanResponse, BudgetTier, FitnessGoal } from '../types';
import { Platform } from 'react-native';
import rawRecipes from '../data/recipes_1000.json';

const BASE_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';
const API_URL = `${BASE_HOST}/api`;

export const FALLBACK_RECIPES: Recipe[] = rawRecipes as unknown as Recipe[];

export const RecipeApiService = {
  async getRecipes(params?: {
    budgetTier?: BudgetTier;
    fitnessGoal?: FitnessGoal;
    cuisine?: string;
    search?: string;
    limit?: number;
  }): Promise<Recipe[]> {
    try {
      const queryParts: string[] = [];
      if (params?.budgetTier && params.budgetTier !== 'all') {
        queryParts.push(`budgetTier=${params.budgetTier}`);
      }
      if (params?.fitnessGoal && params.fitnessGoal !== 'all') {
        queryParts.push(`fitnessGoal=${params.fitnessGoal}`);
      }
      if (params?.cuisine && params.cuisine !== 'All') {
        queryParts.push(`cuisine=${encodeURIComponent(params.cuisine)}`);
      }
      if (params?.search) {
        queryParts.push(`search=${encodeURIComponent(params.search)}`);
      }
      if (params?.limit) {
        queryParts.push(`limit=${params.limit}`);
      }

      const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${API_URL}/recipes${queryString}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return data.recipes;
      }
    } catch {
      // fallback
    }

    // High performance client filter across all 1000+ recipes
    let results = [...FALLBACK_RECIPES];
    if (params?.budgetTier && params.budgetTier !== 'all') {
      results = results.filter((r) => r.budgetTier === params.budgetTier);
    }
    if (params?.fitnessGoal && params.fitnessGoal !== 'all') {
      results = results.filter((r) => r.fitnessGoals.includes(params.fitnessGoal as any));
    }
    if (params?.cuisine && params.cuisine !== 'All') {
      results = results.filter((r) => r.cuisine.toLowerCase() === params.cuisine?.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.subtitle.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.ingredients.some((i) => i.name.toLowerCase().includes(q))
      );
    }

    if (params?.limit) {
      return results.slice(0, params.limit);
    }

    return results;
  },

  async getRecipeById(id: string): Promise<Recipe | null> {
    try {
      const res = await fetch(`${API_URL}/recipes/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return FALLBACK_RECIPES.find((r) => r.id === id) || null;
  },

  async comparePrices(recipeId: string): Promise<StoreComparison | null> {
    try {
      const res = await fetch(`${API_URL}/prices/compare/${recipeId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const recipe = FALLBACK_RECIPES.find((r) => r.id === recipeId) || FALLBACK_RECIPES[0];
    if (!recipe) return null;

    let zepto = 0;
    let blinkit = 0;
    let instamart = 0;
    let portion = 0;

    const items = recipe.ingredients.map((ing) => {
      zepto += ing.quickCommerce.zeptoPrice;
      blinkit += ing.quickCommerce.blinkitPrice;
      instamart += ing.quickCommerce.instamartPrice;
      portion += ing.portionCost;
      return {
        name: ing.name,
        portionAmount: ing.portionAmount,
        portionCost: ing.portionCost,
        fullPackUnit: ing.fullPackUnit,
        zepto: ing.quickCommerce.zeptoPrice,
        blinkit: ing.quickCommerce.blinkitPrice,
        instamart: ing.quickCommerce.instamartPrice
      };
    });

    const zeptoGrand = zepto + (zepto > 199 ? 0 : 15);
    const blinkitGrand = blinkit + (blinkit > 199 ? 0 : 15);
    const instamartGrand = instamart + (instamart > 199 ? 0 : 20);

    return {
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      stores: {
        zepto: {
          name: 'Zepto',
          deliveryMinutes: 10,
          totalPackCost: zepto,
          totalPortionCost: Math.round(portion * 1.02),
          deliveryFee: zepto > 199 ? 0 : 15,
          grandTotal: zeptoGrand,
          tagline: '⚡ 10 Mins Fastest Delivery',
          isCheapest: false
        },
        blinkit: {
          name: 'Blinkit',
          deliveryMinutes: 12,
          totalPackCost: blinkit,
          totalPortionCost: Math.round(portion * 0.98),
          deliveryFee: blinkit > 199 ? 0 : 15,
          grandTotal: blinkitGrand,
          tagline: '🛒 Best Value Everyday Packs',
          isCheapest: true
        },
        instamart: {
          name: 'Swiggy Instamart',
          deliveryMinutes: 15,
          totalPackCost: instamart,
          totalPortionCost: Math.round(portion * 1.05),
          deliveryFee: instamart > 199 ? 0 : 20,
          grandTotal: instamartGrand,
          tagline: '🌟 Wide Gourmet & Exotic Selection',
          isCheapest: false
        }
      },
      bestValueStore: 'Blinkit',
      maxSavingsAmount: Math.abs(instamartGrand - blinkitGrand),
      ingredients: items
    };
  },

  async generateDayPlan(budgetTier: BudgetTier, fitnessGoal: FitnessGoal): Promise<DayPlanResponse> {
    try {
      const res = await fetch(`${API_URL}/planner/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budgetTier, fitnessGoal })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const pool = FALLBACK_RECIPES;
    const tier = budgetTier === 'all' ? 'balanced' : budgetTier;
    const goal = fitnessGoal === 'all' ? 'high-protein' : fitnessGoal;

    const b = pool.find((r) => r.mealType === 'breakfast' && r.budgetTier === tier) || pool[0];
    const br = pool.find((r) => r.mealType === 'brunch' && r.budgetTier === tier) || pool[1];
    const l = pool.find((r) => r.mealType === 'lunch' && r.budgetTier === tier) || pool[2];
    const s = pool.find((r) => r.mealType === 'snack' || r.mealType === 'breakfast') || pool[3];
    const d = pool.find((r) => r.mealType === 'dinner' && r.budgetTier === tier) || pool[4] || pool[0];

    const meals = [
      { mealSlot: 'Breakfast' as const, recipe: b },
      { mealSlot: 'Brunch' as const, recipe: br },
      { mealSlot: 'Lunch' as const, recipe: l },
      { mealSlot: 'Snack' as const, recipe: s },
      { mealSlot: 'Dinner' as const, recipe: d }
    ];

    let totalCost = 0;
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;
    let fiber = 0;

    meals.forEach((m) => {
      totalCost += m.recipe.estimatedCostPerServing;
      calories += m.recipe.nutrition.calories;
      protein += m.recipe.nutrition.protein;
      carbs += m.recipe.nutrition.carbs;
      fats += m.recipe.nutrition.fats;
      fiber += m.recipe.nutrition.fiber;
    });

    return {
      fitnessGoal: goal,
      budgetTier: tier,
      totalDailyCost: totalCost,
      totalNutrition: { calories, protein, carbs, fats, fiber },
      quickCommerceTotals: {
        zepto: totalCost * 3.4,
        blinkit: Math.round(totalCost * 3.1),
        instamart: Math.round(totalCost * 3.6),
        bestStore: 'Blinkit',
        maxSavings: Math.round(totalCost * 0.5)
      },
      meals
    };
  }
};
