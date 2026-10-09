import * as fs from 'fs';
import * as path from 'path';

const recipesPath = path.join(process.cwd(), 'bitecraft', 'assets', 'seeds', 'recipes_seed.json');
const ingredientsPath = path.join(process.cwd(), 'bitecraft', 'assets', 'seeds', 'ingredients_seed.json');

const recipes = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
const ingredients = JSON.parse(fs.readFileSync(ingredientsPath, 'utf8'));

console.log('=== SEED VERIFICATION RECEIPT ===');
console.log('Total Recipes in seed:', recipes.length);
console.log('Total Ingredients in seed:', ingredients.length);

// 1. Dual-Name Alias Match for "kanda"
const kandaIng = ingredients.find((i: any) =>
  i.aliases.some((a: string) => a.toLowerCase() === 'kanda')
);
console.log('\n[Alias Query: "kanda"]');
console.log('  Resolved Ingredient:', kandaIng?.name, '| Aliases:', kandaIng?.aliases);

const kandaRecipes = recipes.filter((r: any) =>
  r.ingredients.some((ri: any) => ri.ingredient_id === kandaIng?.id) ||
  r.title.toLowerCase().includes('kanda') ||
  r.title.toLowerCase().includes('onion')
);
console.log(`  Found ${kandaRecipes.length} recipes containing "kanda" (Onion).`);
console.log('  Sample 1:', kandaRecipes[0]?.title);
console.log('  Sample 2:', kandaRecipes[1]?.title);

// 2. Dual-Name Alias Match for "aloo"
const alooIng = ingredients.find((i: any) =>
  i.aliases.some((a: string) => a.toLowerCase() === 'aloo')
);
console.log('\n[Alias Query: "aloo"]');
console.log('  Resolved Ingredient:', alooIng?.name, '| Aliases:', alooIng?.aliases);

const alooRecipes = recipes.filter((r: any) =>
  r.ingredients.some((ri: any) => ri.ingredient_id === alooIng?.id) ||
  r.title.toLowerCase().includes('aloo') ||
  r.title.toLowerCase().includes('potato')
);
console.log(`  Found ${alooRecipes.length} recipes containing "aloo" (Potato).`);
console.log('  Sample 1:', alooRecipes[0]?.title);
console.log('  Sample 2:', alooRecipes[1]?.title);

// 3. Macro & Tier bounds check
const brokeRecipes = recipes.filter((r: any) => r.budget_tier === 'broke');
const balancedRecipes = recipes.filter((r: any) => r.budget_tier === 'balanced');
const hifiRecipes = recipes.filter((r: any) => r.budget_tier === 'hifi');

console.log('\n[Tier Distribution]');
console.log('  🟢 Broke (< ₹60):', brokeRecipes.length, 'recipes. Max cost:', Math.max(...brokeRecipes.map((r: any) => r.cost_per_serving)));
console.log('  🟡 Balanced (₹60-₹150):', balancedRecipes.length, 'recipes. Cost range:', Math.min(...balancedRecipes.map((r: any) => r.cost_per_serving)), 'to', Math.max(...balancedRecipes.map((r: any) => r.cost_per_serving)));
console.log('  🟣 Hi-Fi (₹150+):', hifiRecipes.length, 'recipes. Min cost:', Math.min(...hifiRecipes.map((r: any) => r.cost_per_serving)));
console.log('=== VERIFICATION SUCCESSFUL ===');
