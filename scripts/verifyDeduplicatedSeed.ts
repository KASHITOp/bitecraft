import * as fs from 'fs';
import * as path from 'path';

const recipesPath = path.join(process.cwd(), 'bitecraft', 'assets', 'seeds', 'recipes_seed.json');
const ingredientsPath = path.join(process.cwd(), 'bitecraft', 'assets', 'seeds', 'ingredients_seed.json');

const recipes = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
const ingredients = JSON.parse(fs.readFileSync(ingredientsPath, 'utf8'));

console.log('====================================================');
console.log('       BITECRAFT RECIPE SEED VERIFICATION           ');
console.log('====================================================');

// 1. Total recipes
const totalRecipes = recipes.length;
console.log(`1. Total Recipes: ${totalRecipes}`);

// 2. Unique titles (must equal total)
const titlesSet = new Set<string>();
const duplicateTitles: string[] = [];

for (const r of recipes) {
  if (titlesSet.has(r.title)) {
    duplicateTitles.push(r.title);
  }
  titlesSet.add(r.title);
}

const uniqueTitles = titlesSet.size;
console.log(`2. Unique Titles: ${uniqueTitles} (Must equal total: ${uniqueTitles === totalRecipes ? 'PASSED ✅' : 'FAILED ❌'})`);
if (duplicateTitles.length > 0) {
  console.error('   Duplicates found:', duplicateTitles);
}

// Check for filler adjectives
const fillerAdjectives = ['Hero', 'Smart', 'Fiery', 'Loaded', 'Golden', 'Creamy', 'Rustic', 'Spicy', 'Crispy', 'Power', 'Zesty', 'Savory', 'Smoky', 'Quick', 'Hostel', 'Homestyle'];
const titlesWithFiller = recipes.filter((r: any) => {
  // Check if title starts with a filler adjective followed by dish name (e.g., "Hero ", "Smart ", etc.)
  // Note: "Homestyle Curry" is a base dish name itself, not a filler adjective attached to another dish.
  const firstWord = r.title.split(' ')[0];
  if (firstWord === 'Homestyle' && r.title.startsWith('Homestyle Curry')) {
    return false;
  }
  return ['Hero', 'Smart', 'Fiery', 'Loaded', 'Golden', 'Creamy', 'Rustic', 'Spicy', 'Crispy', 'Power', 'Zesty', 'Savory', 'Smoky', 'Quick', 'Hostel'].includes(firstWord);
});
console.log(`   Titles with filler adjectives: ${titlesWithFiller.length} (Must be 0: ${titlesWithFiller.length === 0 ? 'PASSED ✅' : 'FAILED ❌'})`);

// 3. Distinct step sets (must be at least 22)
// Serialize steps of each recipe
const stepSets = new Set<string>();
for (const r of recipes) {
  // Serialize step texts
  const stepTextSignature = r.steps.map((s: any) => s.text).join(' | ');
  stepSets.add(stepTextSignature);
}
const distinctStepSets = stepSets.size;
console.log(`3. Distinct Step Sets: ${distinctStepSets} (Must be at least 22: ${distinctStepSets >= 22 ? 'PASSED ✅' : 'FAILED ❌'})`);

// 4. Any recipe whose cuisine doesn't match its dish (must be zero)
const EXPECTED_DISH_CUISINE: Record<string, string> = {
  'Kanda Poha': 'Indian',
  'Moong Dal Khichdi': 'Indian',
  'Egg Bhurji': 'Indian',
  'Soya Keema Bhurji': 'Indian',
  'Masala Oats': 'Indian',
  'Homestyle Curry': 'Indian',
  'Paneer Tikka Bowl': 'Indian',
  'Biryani Bowl': 'Indian',
  'Pasta Aglio e Olio': 'Italian',
  'Tomato Basil Penne': 'Italian',
  'Truffle Fettuccine': 'Italian',
  'Ramen Quick Pot': 'Pan-Asian',
  'Teriyaki Stir Fry': 'Pan-Asian',
  'Gourmet Sushi Bowl': 'Pan-Asian',
  'Bean & Corn Quesadilla': 'Mexican',
  'Chipotle Protein Bowl': 'Mexican',
  'Artisan Fajita Skillet': 'Mexican',
  'Peanut Butter Oats': 'Continental',
  'Greek Yogurt Parfait': 'Continental',
  'Avocado Sourdough Toast': 'Continental',
  'Acai Superfood Bowl': 'Continental',
  'Hummus Pita Wrap': 'Middle Eastern',
};

const mismatchedCuisines: { id: number; title: string; assignedCuisine: string; expectedCuisine: string }[] = [];

for (const r of recipes) {
  let matchedBaseDish: string | null = null;
  for (const dishName of Object.keys(EXPECTED_DISH_CUISINE)) {
    if (r.title.startsWith(dishName)) {
      matchedBaseDish = dishName;
      break;
    }
  }

  if (!matchedBaseDish) {
    mismatchedCuisines.push({
      id: r.id,
      title: r.title,
      assignedCuisine: r.cuisine,
      expectedCuisine: 'Unknown dish',
    });
  } else {
    const expected = EXPECTED_DISH_CUISINE[matchedBaseDish];
    if (r.cuisine !== expected) {
      mismatchedCuisines.push({
        id: r.id,
        title: r.title,
        assignedCuisine: r.cuisine,
        expectedCuisine: expected,
      });
    }
  }
}

console.log(`4. Cuisine Mismatches: ${mismatchedCuisines.length} (Must be 0: ${mismatchedCuisines.length === 0 ? 'PASSED ✅' : 'FAILED ❌'})`);
if (mismatchedCuisines.length > 0) {
  console.error('   Mismatches:', mismatchedCuisines);
}

// 5. Check "Where this goes wrong" tips
const recipesWithTips = recipes.filter((r: any) =>
  r.steps.some((s: any) => s.tip && s.tip.toLowerCase().includes('where this goes wrong'))
);
console.log(`5. Recipes with "Where this goes wrong" tips: ${recipesWithTips.length} / ${totalRecipes} (${recipesWithTips.length === totalRecipes ? 'ALL PRESENT ✅' : 'INCOMPLETE ❌'})`);

// 6. Check Tier Distribution & Realistic Cost per Serving
const broke = recipes.filter((r: any) => r.budget_tier === 'broke');
const balanced = recipes.filter((r: any) => r.budget_tier === 'balanced');
const hifi = recipes.filter((r: any) => r.budget_tier === 'hifi');

console.log('\n--- TIER & COST BREAKDOWN (Bangalore 2026 Prices) ---');
console.log(`  🟢 Broke (< ₹60): ${broke.length} recipes (₹${Math.min(...broke.map((r: any) => r.cost_per_serving))} - ₹${Math.max(...broke.map((r: any) => r.cost_per_serving))})`);
console.log(`  🟡 Balanced (₹60-₹150): ${balanced.length} recipes (₹${Math.min(...balanced.map((r: any) => r.cost_per_serving))} - ₹${Math.max(...balanced.map((r: any) => r.cost_per_serving))})`);
console.log(`  🟣 Hi-Fi (> ₹150): ${hifi.length} recipes (₹${Math.min(...hifi.map((r: any) => r.cost_per_serving))} - ₹${Math.max(...hifi.map((r: any) => r.cost_per_serving))})`);

// 7. Verify all ingredient IDs exist in ingredients_seed.json
const validIngIds = new Set(ingredients.map((i: any) => i.id));
let invalidIngCount = 0;
for (const r of recipes) {
  for (const ing of r.ingredients) {
    if (!validIngIds.has(ing.ingredient_id)) {
      invalidIngCount++;
    }
  }
}
console.log(`\nIngredient ID Validity: ${invalidIngCount === 0 ? 'ALL VALID (1-50) ✅' : `${invalidIngCount} INVALID IDS ❌`}`);

console.log('====================================================\n');
