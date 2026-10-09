export type CuisineType = 
  | 'Indian' 
  | 'Italian' 
  | 'Pan-Asian' 
  | 'Mexican' 
  | 'Continental' 
  | 'Middle Eastern';

export type MealType = 'breakfast' | 'brunch' | 'lunch' | 'snack' | 'dinner';

export type BudgetTier = 'broke-student' | 'balanced' | 'hifi-gourmet';

export type FitnessGoal = 'weight-gain' | 'weight-loss' | 'high-protein' | 'exam-quick';

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
  protein: number; // in grams
  carbs: number;   // in grams
  fats: number;    // in grams
  fiber: number;   // in grams
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cuisine: CuisineType;
  mealType: MealType;
  budgetTier: BudgetTier;
  estimatedCostPerServing: number; // in INR ₹
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: Difficulty;
  isVegetarian: boolean;
  equipment: string[];
  fitnessGoals: FitnessGoal[];
  nutrition: NutritionInfo;
  ingredients: Ingredient[];
  steps: CookingStep[];
  studentHacks: string[];
  imageUrl: string;
  tags: string[];
}

export interface DayPlanRequest {
  budgetTier?: BudgetTier;
  targetDailyBudget?: number;
  fitnessGoal: FitnessGoal;
  isVegetarianOnly?: boolean;
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
