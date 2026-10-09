export type CuisineType = 
  | 'All'
  | 'Indian' 
  | 'Italian' 
  | 'Pan-Asian' 
  | 'Mexican' 
  | 'Continental' 
  | 'Middle Eastern';

export type MealType = 'all' | 'breakfast' | 'brunch' | 'lunch' | 'snack' | 'dinner';

export type BudgetTier = 'all' | 'broke-student' | 'balanced' | 'hifi-gourmet';

export type FitnessGoal = 'all' | 'weight-gain' | 'weight-loss' | 'high-protein' | 'exam-quick';

export type Difficulty = 'Super Easy' | 'Easy' | 'Medium';

export interface IngredientQuickCommerce {
  zeptoPrice: number;
  blinkitPrice: number;
  instamartPrice: number;
  inStock: boolean;
}

export interface Ingredient {
  id: string;
  name: string;
  portionAmount: string;
  portionCost: number; // in INR ₹
  fullPackUnit: string;
  fullPackCost: number; // in INR ₹
  quickCommerce: IngredientQuickCommerce;
}

export interface CookingStep {
  stepNumber: number;
  instruction: string;
  timerSeconds?: number;
  beginnerTip?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cuisine: 'Indian' | 'Italian' | 'Pan-Asian' | 'Mexican' | 'Continental' | 'Middle Eastern';
  mealType: 'breakfast' | 'brunch' | 'lunch' | 'snack' | 'dinner';
  budgetTier: 'broke-student' | 'balanced' | 'hifi-gourmet';
  estimatedCostPerServing: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: Difficulty;
  isVegetarian: boolean;
  equipment: string[];
  fitnessGoals: ('weight-gain' | 'weight-loss' | 'high-protein' | 'exam-quick')[];
  nutrition: NutritionInfo;
  ingredients: Ingredient[];
  steps: CookingStep[];
  studentHacks: string[];
  imageUrl: string;
  tags: string[];
}

export interface StoreComparison {
  recipeId?: string;
  recipeTitle?: string;
  stores: {
    zepto: {
      name: 'Zepto';
      deliveryMinutes: number;
      totalPackCost: number;
      totalPortionCost: number;
      deliveryFee: number;
      grandTotal: number;
      tagline: string;
      isCheapest: boolean;
    };
    blinkit: {
      name: 'Blinkit';
      deliveryMinutes: number;
      totalPackCost: number;
      totalPortionCost: number;
      deliveryFee: number;
      grandTotal: number;
      tagline: string;
      isCheapest: boolean;
    };
    instamart: {
      name: 'Swiggy Instamart';
      deliveryMinutes: number;
      totalPackCost: number;
      totalPortionCost: number;
      deliveryFee: number;
      grandTotal: number;
      tagline: string;
      isCheapest: boolean;
    };
  };
  bestValueStore: 'Zepto' | 'Blinkit' | 'Swiggy Instamart';
  maxSavingsAmount: number;
  ingredients: {
    name: string;
    portionAmount: string;
    portionCost: number;
    fullPackUnit: string;
    zepto: number;
    blinkit: number;
    instamart: number;
  }[];
}

export interface DayPlanResponse {
  fitnessGoal: FitnessGoal;
  budgetTier: BudgetTier;
  totalDailyCost: number;
  totalNutrition: NutritionInfo;
  quickCommerceTotals: {
    zepto: number;
    blinkit: number;
    instamart: number;
    bestStore: 'Zepto' | 'Blinkit' | 'Instamart';
    maxSavings: number;
  };
  meals: {
    mealSlot: 'Breakfast' | 'Brunch' | 'Lunch' | 'Snack' | 'Dinner';
    recipe: Recipe;
  }[];
}
