import { Ingredient, Recipe } from '../types.js';

export interface StoreComparisonResult {
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

export class QuickCommerceService {
  /**
   * Compares store prices for a given recipe's ingredients.
   */
  public static compareForRecipe(recipe: Recipe): StoreComparisonResult {
    let zeptoPacks = 0;
    let blinkitPacks = 0;
    let instamartPacks = 0;

    let totalPortion = 0;

    const itemDetails = recipe.ingredients.map((ing) => {
      zeptoPacks += ing.quickCommerce.zeptoPrice;
      blinkitPacks += ing.quickCommerce.blinkitPrice;
      instamartPacks += ing.quickCommerce.instamartPrice;
      totalPortion += ing.portionCost;

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

    const zeptoDeliveryFee = zeptoPacks > 199 ? 0 : 15;
    const blinkitDeliveryFee = blinkitPacks > 199 ? 0 : 15;
    const instamartDeliveryFee = instamartPacks > 199 ? 0 : 20;

    const zeptoGrand = zeptoPacks + zeptoDeliveryFee;
    const blinkitGrand = blinkitPacks + blinkitDeliveryFee;
    const instamartGrand = instamartPacks + instamartDeliveryFee;

    const grandTotals = [
      { store: 'Zepto' as const, total: zeptoGrand },
      { store: 'Blinkit' as const, total: blinkitGrand },
      { store: 'Swiggy Instamart' as const, total: instamartGrand }
    ];

    grandTotals.sort((a, b) => a.total - b.total);
    const cheapestStore = grandTotals[0].store;
    const maxSavings = grandTotals[grandTotals.length - 1].total - grandTotals[0].total;

    return {
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      stores: {
        zepto: {
          name: 'Zepto',
          deliveryMinutes: 10,
          totalPackCost: zeptoPacks,
          totalPortionCost: Math.round(totalPortion * 1.02),
          deliveryFee: zeptoDeliveryFee,
          grandTotal: zeptoGrand,
          tagline: '⚡ 10 Mins Fastest Delivery',
          isCheapest: cheapestStore === 'Zepto'
        },
        blinkit: {
          name: 'Blinkit',
          deliveryMinutes: 12,
          totalPackCost: blinkitPacks,
          totalPortionCost: Math.round(totalPortion * 0.98),
          deliveryFee: blinkitDeliveryFee,
          grandTotal: blinkitGrand,
          tagline: '🛒 Best Value Everyday Packs',
          isCheapest: cheapestStore === 'Blinkit'
        },
        instamart: {
          name: 'Swiggy Instamart',
          deliveryMinutes: 15,
          totalPackCost: instamartPacks,
          totalPortionCost: Math.round(totalPortion * 1.05),
          deliveryFee: instamartDeliveryFee,
          grandTotal: instamartGrand,
          tagline: '🌟 Wide Gourmet & Exotic Selection',
          isCheapest: cheapestStore === 'Swiggy Instamart'
        }
      },
      bestValueStore: cheapestStore,
      maxSavingsAmount: maxSavings,
      ingredients: itemDetails
    };
  }

  /**
   * Compares arbitrary list of ingredients.
   */
  public static compareIngredients(ingredients: Ingredient[]): StoreComparisonResult {
    const dummyRecipe: Recipe = {
      id: 'custom-cart',
      title: 'Custom Grocery Cart',
      subtitle: 'Items to cook with',
      description: '',
      cuisine: 'Indian',
      mealType: 'lunch',
      budgetTier: 'balanced',
      estimatedCostPerServing: 0,
      prepTimeMinutes: 0,
      cookTimeMinutes: 0,
      difficulty: 'Easy',
      isVegetarian: true,
      equipment: [],
      fitnessGoals: ['high-protein'],
      nutrition: { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 },
      ingredients,
      steps: [],
      studentHacks: [],
      imageUrl: '',
      tags: []
    };

    return this.compareForRecipe(dummyRecipe);
  }
}
