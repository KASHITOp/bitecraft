import { RECIPES_DATA } from '../data/recipes.js';
import { BudgetTier, DayPlanRequest, DayPlanResponse, FitnessGoal, MealType, Recipe } from '../types.js';

export class PlannerService {
  public static generateDayPlan(req: DayPlanRequest): DayPlanResponse {
    const tier: BudgetTier = req.budgetTier || 'balanced';
    const goal: FitnessGoal = req.fitnessGoal || 'high-protein';
    const isVegOnly = !!req.isVegetarianOnly;

    // Filter available pool
    const pool = RECIPES_DATA.filter((r) => {
      if (isVegOnly && !r.isVegetarian) return false;
      return true;
    });

    const getBestRecipeForSlot = (
      preferredType: MealType,
      fallbackType?: MealType
    ): Recipe => {
      // 1. Exact match: slot + tier + goal
      let candidates = pool.filter(
        (r) =>
          r.mealType === preferredType &&
          r.budgetTier === tier &&
          r.fitnessGoals.includes(goal)
      );

      // 2. Slot + tier
      if (candidates.length === 0) {
        candidates = pool.filter(
          (r) => r.mealType === preferredType && r.budgetTier === tier
        );
      }

      // 3. Fallback type + tier
      if (candidates.length === 0 && fallbackType) {
        candidates = pool.filter(
          (r) => r.mealType === fallbackType && r.budgetTier === tier
        );
      }

      // 4. Any recipe of this mealType
      if (candidates.length === 0) {
        candidates = pool.filter((r) => r.mealType === preferredType);
      }

      // 5. Ultimate fallback: any recipe in pool
      if (candidates.length === 0) {
        return pool[0];
      }

      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    const breakfast = getBestRecipeForSlot('breakfast', 'brunch');
    const brunch = getBestRecipeForSlot('brunch', 'breakfast');
    const lunch = getBestRecipeForSlot('lunch', 'dinner');
    const snack = getBestRecipeForSlot('snack', 'breakfast');
    const dinner = getBestRecipeForSlot('dinner', 'lunch');

    const selectedMeals: {
      mealSlot: 'Breakfast' | 'Brunch' | 'Lunch' | 'Snack' | 'Dinner';
      recipe: Recipe;
    }[] = [
      { mealSlot: 'Breakfast', recipe: breakfast },
      { mealSlot: 'Brunch', recipe: brunch },
      { mealSlot: 'Lunch', recipe: lunch },
      { mealSlot: 'Snack', recipe: snack },
      { mealSlot: 'Dinner', recipe: dinner }
    ];

    // Compute totals
    let totalCost = 0;
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;
    let fiber = 0;

    let zeptoTotal = 0;
    let blinkitTotal = 0;
    let instamartTotal = 0;

    selectedMeals.forEach(({ recipe }) => {
      totalCost += recipe.estimatedCostPerServing;
      calories += recipe.nutrition.calories;
      protein += recipe.nutrition.protein;
      carbs += recipe.nutrition.carbs;
      fats += recipe.nutrition.fats;
      fiber += recipe.nutrition.fiber;

      recipe.ingredients.forEach((ing) => {
        zeptoTotal += ing.quickCommerce.zeptoPrice;
        blinkitTotal += ing.quickCommerce.blinkitPrice;
        instamartTotal += ing.quickCommerce.instamartPrice;
      });
    });

    const stores = [
      { name: 'Zepto' as const, total: zeptoTotal },
      { name: 'Blinkit' as const, total: blinkitTotal },
      { name: 'Instamart' as const, total: instamartTotal }
    ];
    stores.sort((a, b) => a.total - b.total);

    return {
      fitnessGoal: goal,
      budgetTier: tier,
      totalDailyCost: totalCost,
      totalNutrition: {
        calories,
        protein,
        carbs,
        fats,
        fiber
      },
      quickCommerceTotals: {
        zepto: zeptoTotal,
        blinkit: blinkitTotal,
        instamart: instamartTotal,
        bestStore: stores[0].name,
        maxSavings: stores[stores.length - 1].total - stores[0].total
      },
      meals: selectedMeals
    };
  }
}
