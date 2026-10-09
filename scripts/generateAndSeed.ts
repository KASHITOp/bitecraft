import * as fs from 'fs';
import * as path from 'path';

// Deterministic PRNG (Mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(1337);

function randomInt(min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Number((rng() * (max - min) + min).toFixed(2));
}

function sample<T>(array: T[]): T {
  return array[Math.floor(rng() * array.length)];
}

function sampleMultiple<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - rng());
  return shuffled.slice(0, count);
}

// 40 food-category public image pool (Unsplash Food & MealDB verified high-res food URLs)
const CATEGORY_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80', // Salad bowl
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80', // Veggie grain
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80', // Healthy green
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', // Pizza/flatbread
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80', // Mexican tacos
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', // Grilled bbq
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80', // Pancakes/breakfast
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', // Noodles/ramen
  'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80', // Biryani/rice
  'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80', // Asian noodles
  'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80', // Pasta tomato
  'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=600&q=80', // Pasta creamy
  'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80', // Acai bowl
  'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', // Avocado toast
  'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', // Burger wrap
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80', // Gourmet dinner
  'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80', // Oats porridge
  'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=600&q=80', // Colorful veggie
  'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', // Grilled sandwich
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80', // Restaurant food
  'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80', // Gourmet snack
  'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80', // Artisan pizza
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', // BBQ ribs/steak
  'https://images.unsplash.com/photo-1559058789-672da06263d8?auto=format&fit=crop&w=600&q=80', // Dim sum
  'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80', // Indian curry
  'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80', // Butter chicken
  'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=600&q=80', // Paneer tikka
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', // Seafood noodles
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', // Samosa chaat
  'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', // Sushi roll
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', // Biryani pot
  'https://images.unsplash.com/photo-1576402187878-974f70c890a5?auto=format&fit=crop&w=600&q=80', // Soup bowl
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80', // Meal prep bowl
  'https://images.unsplash.com/photo-1514944298352-f6700c3b0369?auto=format&fit=crop&w=600&q=80', // Stir fry wok
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', // Baked pizza
  'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80', // Healthy wrap
  'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80', // Egg scramble
  'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80', // Meatballs bowl
  'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80', // Fried chicken
  'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80', // Rice & lentils
];

// Dual-Named Ingredients
interface IngredientSeed {
  id: number;
  name: string;
  aliases: string[];
  category: string;
  packSize: string;
  avgPackPrice: number;
}

const RAW_INGREDIENTS: Omit<IngredientSeed, 'id'>[] = [
  { name: 'Onion', aliases: ['Kanda', 'Pyaz', 'Piyaz'], category: 'Produce', packSize: '1 kg', avgPackPrice: 38 },
  { name: 'Potato', aliases: ['Aloo', 'Batata', 'Alu'], category: 'Produce', packSize: '1 kg', avgPackPrice: 32 },
  { name: 'Tomato', aliases: ['Tamatar', 'Tameta'], category: 'Produce', packSize: '500 g', avgPackPrice: 28 },
  { name: 'Coriander', aliases: ['Kothimbir', 'Dhaniya', 'Cilantro'], category: 'Produce', packSize: '100 g', avgPackPrice: 15 },
  { name: 'Poha', aliases: ['Aval', 'Chivda', 'Flattened Rice', 'Atukulu'], category: 'Grains', packSize: '500 g', avgPackPrice: 42 },
  { name: 'Egg', aliases: ['Anda', 'Eggs', 'Muttai'], category: 'Dairy & Eggs', packSize: '6 pack', avgPackPrice: 52 },
  { name: 'Paneer', aliases: ['Cottage Cheese', 'Chenna'], category: 'Dairy & Eggs', packSize: '200 g', avgPackPrice: 85 },
  { name: 'Curd', aliases: ['Dahi', 'Yogurt', 'Thayir'], category: 'Dairy & Eggs', packSize: '400 g', avgPackPrice: 35 },
  { name: 'Bread', aliases: ['Pav', 'White Bread', 'Brown Bread', 'Roti'], category: 'Bakery', packSize: '400 g', avgPackPrice: 40 },
  { name: 'Rice', aliases: ['Chawal', 'Basmati Rice', 'Bhat'], category: 'Grains', packSize: '1 kg', avgPackPrice: 65 },
  { name: 'Moong Dal', aliases: ['Yellow Lentil', 'Peeli Dal', 'Mung'], category: 'Pulses', packSize: '500 g', avgPackPrice: 70 },
  { name: 'Toor Dal', aliases: ['Arhar Dal', 'Yellow Pigeon Peas'], category: 'Pulses', packSize: '500 g', avgPackPrice: 85 },
  { name: 'Rolled Oats', aliases: ['Oatmeal', 'Oats', 'Masala Oats'], category: 'Grains', packSize: '500 g', avgPackPrice: 90 },
  { name: 'Chicken Breast', aliases: ['Boneless Chicken', 'Murgh'], category: 'Meat', packSize: '500 g', avgPackPrice: 170 },
  { name: 'Peanut Butter', aliases: ['PB', 'Mungfali Butter'], category: 'Spreads', packSize: '350 g', avgPackPrice: 140 },
  { name: 'Butter', aliases: ['Makhan', 'Amul Butter'], category: 'Dairy & Eggs', packSize: '100 g', avgPackPrice: 56 },
  { name: 'Green Chilli', aliases: ['Hari Mirch', 'Mirchi'], category: 'Produce', packSize: '100 g', avgPackPrice: 12 },
  { name: 'Ginger', aliases: ['Adrak', 'Inji'], category: 'Produce', packSize: '100 g', avgPackPrice: 20 },
  { name: 'Garlic', aliases: ['Lahsun', 'Lasun', 'Poondu'], category: 'Produce', packSize: '100 g', avgPackPrice: 25 },
  { name: 'Soya Chunks', aliases: ['Mealmaker', 'Nutrela', 'Soya Keema'], category: 'Proteins', packSize: '200 g', avgPackPrice: 45 },
  { name: 'Peanuts', aliases: ['Moongphali', 'Groundnut', 'Shengdana'], category: 'Nuts', packSize: '200 g', avgPackPrice: 40 },
  { name: 'Mustard Seeds', aliases: ['Rai', 'Sarson'], category: 'Spices', packSize: '100 g', avgPackPrice: 22 },
  { name: 'Cumin Seeds', aliases: ['Jeera', 'Jira'], category: 'Spices', packSize: '100 g', avgPackPrice: 38 },
  { name: 'Turmeric Powder', aliases: ['Haldi', 'Manjal'], category: 'Spices', packSize: '100 g', avgPackPrice: 28 },
  { name: 'Red Chilli Powder', aliases: ['Lal Mirch', 'Kashmiri Mirch'], category: 'Spices', packSize: '100 g', avgPackPrice: 34 },
  { name: 'Garam Masala', aliases: ['Curry Powder', 'Spice Blend'], category: 'Spices', packSize: '100 g', avgPackPrice: 45 },
  { name: 'Cooking Oil', aliases: ['Tel', 'Refined Oil', 'Mustard Oil'], category: 'Oils', packSize: '1 L', avgPackPrice: 130 },
  { name: 'Ghee', aliases: ['Desi Ghee', 'Clarified Butter', 'Neyyi'], category: 'Dairy & Eggs', packSize: '200 ml', avgPackPrice: 155 },
  { name: 'Milk', aliases: ['Doodh', 'Paal'], category: 'Dairy & Eggs', packSize: '500 ml', avgPackPrice: 33 },
  { name: 'Cheese Slice', aliases: ['Processed Cheese', 'Cheddar Slice'], category: 'Dairy & Eggs', packSize: '10 slices', avgPackPrice: 110 },
  { name: 'Fettuccine Pasta', aliases: ['Pasta', 'Spaghetti', 'Noodles'], category: 'Grains', packSize: '500 g', avgPackPrice: 120 },
  { name: 'Mushroom', aliases: ['Button Mushroom', 'Kukurmutta'], category: 'Produce', packSize: '200 g', avgPackPrice: 65 },
  { name: 'Truffle Oil', aliases: ['Truffle Essence', 'Artisan Oil'], category: 'Gourmet', packSize: '100 ml', avgPackPrice: 450 },
  { name: 'Dragon Fruit', aliases: ['Pitaya', 'Kamalam'], category: 'Fruits', packSize: '1 piece', avgPackPrice: 95 },
  { name: 'Acai Puree', aliases: ['Acai Berry', 'Berry Blend'], category: 'Gourmet', packSize: '200 g', avgPackPrice: 290 },
  { name: 'Avocado', aliases: ['Butter Fruit', 'Makhan Phal'], category: 'Produce', packSize: '1 piece', avgPackPrice: 85 },
  { name: 'Sourdough Bread', aliases: ['Artisan Bread', 'Sourdough Loaf'], category: 'Bakery', packSize: '400 g', avgPackPrice: 135 },
  { name: 'Quinoa', aliases: ['Supergrain', 'Inca Wheat'], category: 'Grains', packSize: '500 g', avgPackPrice: 195 },
  { name: 'Salmon Fillet', aliases: ['Raw Salmon', 'Atlantic Salmon'], category: 'Meat', packSize: '250 g', avgPackPrice: 380 },
  { name: 'Soy Sauce', aliases: ['Dark Soya Sauce', 'Shoyu'], category: 'Sauces', packSize: '200 ml', avgPackPrice: 60 },
  { name: 'Tofu', aliases: ['Bean Curd', 'Soya Paneer'], category: 'Proteins', packSize: '200 g', avgPackPrice: 65 },
  { name: 'Black Beans', aliases: ['Frijoles', 'Rajma Chota'], category: 'Pulses', packSize: '500 g', avgPackPrice: 95 },
  { name: 'Sweet Corn', aliases: ['Makai', 'Corn Kernels'], category: 'Produce', packSize: '250 g', avgPackPrice: 40 },
  { name: 'Greek Yogurt', aliases: ['Hung Curd', 'Protein Dahi'], category: 'Dairy & Eggs', packSize: '400 g', avgPackPrice: 90 },
  { name: 'Granola', aliases: ['Muesli', 'Breakfast Clusters'], category: 'Grains', packSize: '400 g', avgPackPrice: 185 },
  { name: 'Banana', aliases: ['Kela', 'Vazhaipazham'], category: 'Fruits', packSize: '6 pack', avgPackPrice: 45 },
  { name: 'Maggi Noodles', aliases: ['Instant Noodles', '2-Min Noodles'], category: 'Grains', packSize: '4 pack', avgPackPrice: 56 },
  { name: 'Spinach', aliases: ['Palak', 'Keerai'], category: 'Produce', packSize: '250 g', avgPackPrice: 25 },
  { name: 'Capsicum', aliases: ['Shimla Mirch', 'Bell Pepper'], category: 'Produce', packSize: '250 g', avgPackPrice: 32 },
  { name: 'Lemon', aliases: ['Nimbu', 'Lime'], category: 'Produce', packSize: '4 pack', avgPackPrice: 20 },
];

const INGREDIENTS: IngredientSeed[] = RAW_INGREDIENTS.map((item, index) => ({
  id: index + 1,
  ...item,
}));

// Curated Hero Recipes (Top 150)
interface RecipeSeed {
  id: number;
  title: string;
  cuisine: string;
  budget_tier: 'broke' | 'balanced' | 'hifi';
  goals: string[];
  minutes: number;
  equipment_tags: string[];
  servings: number;
  steps: { text: string; timer_seconds?: number; tip?: string }[];
  macros: { kcal: number; protein: number; carbs: number; fats: number; fiber: number };
  cost_per_serving: number;
  cost_full_pack: number;
  image_url: string;
  emoji: string;
  gradient_seed: number;
  ingredients: { ingredient_id: number; qty: number; unit: string }[];
}

const HERO_RECIPES_DATA: Omit<RecipeSeed, 'id'>[] = [
  {
    title: '10-Minute Kanda Poha with Peanuts',
    cuisine: 'Indian',
    budget_tier: 'broke',
    goals: ['15-min', 'fat-loss'],
    minutes: 10,
    equipment_tags: ['1-pan', 'hostel-friendly'],
    servings: 1,
    steps: [
      { text: 'Rinse poha in a colander under running water for 30s and drain well.', timer_seconds: 30, tip: 'Do not soak or poha becomes mushy!' },
      { text: 'Heat oil in a pan, fry peanuts until crunchy, then add mustard seeds and green chilli.', timer_seconds: 90 },
      { text: 'Sauté chopped onion (kanda) until translucent and soft.', timer_seconds: 120 },
      { text: 'Add turmeric, salt, drained poha, and toss gently on low heat.', timer_seconds: 180 },
      { text: 'Finish with fresh coriander and a squeeze of lemon juice.', tip: 'Add a boiled egg on the side for 6g extra protein.' },
    ],
    macros: { kcal: 290, protein: 7.2, carbs: 48.0, fats: 8.5, fiber: 3.4 },
    cost_per_serving: 24.0,
    cost_full_pack: 110.0,
    image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
    emoji: '🍚',
    gradient_seed: 101,
    ingredients: [
      { ingredient_id: 5, qty: 100, unit: 'g' }, // Poha
      { ingredient_id: 1, qty: 1, unit: 'piece' }, // Onion
      { ingredient_id: 21, qty: 25, unit: 'g' }, // Peanuts
      { ingredient_id: 22, qty: 5, unit: 'g' }, // Mustard
      { ingredient_id: 24, qty: 3, unit: 'g' }, // Turmeric
      { ingredient_id: 4, qty: 10, unit: 'g' }, // Coriander
      { ingredient_id: 50, qty: 0.5, unit: 'piece' }, // Lemon
    ],
  },
  {
    title: 'One-Pot Moong Dal Khichdi',
    cuisine: 'Indian',
    budget_tier: 'broke',
    goals: ['fat-loss', '15-min'],
    minutes: 15,
    equipment_tags: ['1-pan', 'kettle-only', 'hostel-friendly'],
    servings: 1,
    steps: [
      { text: 'Rinse rice and moong dal together thoroughly.', timer_seconds: 60 },
      { text: 'In your kettle or pan, heat ghee with cumin seeds (jeera) and ginger.', timer_seconds: 90 },
      { text: 'Add rinsed dal-rice mix with 3 cups water, turmeric, and salt.', timer_seconds: 600, tip: 'Add an extra half cup of water for comforting soul-food consistency.' },
      { text: 'Cook until soft and creamy. Serve hot with a spoonful of dahi.', tip: 'High satiety survival staple under ₹35.' },
    ],
    macros: { kcal: 340, protein: 17.5, carbs: 54.0, fats: 6.0, fiber: 5.5 },
    cost_per_serving: 32.0,
    cost_full_pack: 140.0,
    image_url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    emoji: '🍲',
    gradient_seed: 102,
    ingredients: [
      { ingredient_id: 10, qty: 60, unit: 'g' }, // Rice
      { ingredient_id: 11, qty: 60, unit: 'g' }, // Moong Dal
      { ingredient_id: 28, qty: 10, unit: 'g' }, // Ghee
      { ingredient_id: 23, qty: 5, unit: 'g' }, // Cumin
      { ingredient_id: 24, qty: 3, unit: 'g' }, // Turmeric
      { ingredient_id: 18, qty: 5, unit: 'g' }, // Ginger
    ],
  },
  {
    title: 'Masala Oats with Boiled Eggs',
    cuisine: 'Indian',
    budget_tier: 'broke',
    goals: ['high-protein', '15-min'],
    minutes: 12,
    equipment_tags: ['1-pan', 'kettle-only'],
    servings: 1,
    steps: [
      { text: 'Boil 2 eggs in your kettle or small pot for 8 minutes.', timer_seconds: 480 },
      { text: 'In a pan, sauté onion, tomato, and green chilli with a pinch of garam masala.', timer_seconds: 120 },
      { text: 'Add rolled oats and 1.5 cups water. Cook for 3 minutes until thick.', timer_seconds: 180 },
      { text: 'Peel eggs, slice in half, place on top with cracked black pepper.', tip: '26g protein power breakfast for under ₹40.' },
    ],
    macros: { kcal: 380, protein: 26.0, carbs: 38.0, fats: 14.0, fiber: 6.0 },
    cost_per_serving: 36.0,
    cost_full_pack: 145.0,
    image_url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
    emoji: '🍳',
    gradient_seed: 103,
    ingredients: [
      { ingredient_id: 13, qty: 50, unit: 'g' }, // Rolled Oats
      { ingredient_id: 6, qty: 2, unit: 'piece' }, // Egg
      { ingredient_id: 1, qty: 0.5, unit: 'piece' }, // Onion
      { ingredient_id: 3, qty: 0.5, unit: 'piece' }, // Tomato
      { ingredient_id: 26, qty: 3, unit: 'g' }, // Garam Masala
    ],
  },
  {
    title: 'Paneer Tikka Quinoa Bowl',
    cuisine: 'Indian',
    budget_tier: 'balanced',
    goals: ['high-protein', 'muscle-gain'],
    minutes: 20,
    equipment_tags: ['1-pan', 'induction'],
    servings: 1,
    steps: [
      { text: 'Cook quinoa in salted water (1:2 ratio) for 12 minutes.', timer_seconds: 720 },
      { text: 'Cube paneer and toss with curd, red chilli powder, turmeric, and garam masala.', timer_seconds: 180 },
      { text: 'Sear marinated paneer on a hot pan for 2-3 mins per side until charred edges appear.', timer_seconds: 240 },
      { text: 'Assemble quinoa in bowl, top with paneer tikka, sliced onions, and chopped coriander.', tip: 'Drizzle with mint chutney or lemon juice.' },
    ],
    macros: { kcal: 540, protein: 34.0, carbs: 46.0, fats: 24.0, fiber: 7.0 },
    cost_per_serving: 95.0,
    cost_full_pack: 280.0,
    image_url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=600&q=80',
    emoji: '🥗',
    gradient_seed: 104,
    ingredients: [
      { ingredient_id: 7, qty: 150, unit: 'g' }, // Paneer
      { ingredient_id: 38, qty: 60, unit: 'g' }, // Quinoa
      { ingredient_id: 8, qty: 50, unit: 'g' }, // Curd
      { ingredient_id: 25, qty: 4, unit: 'g' }, // Red chilli
      { ingredient_id: 26, qty: 3, unit: 'g' }, // Garam masala
      { ingredient_id: 4, qty: 10, unit: 'g' }, // Coriander
    ],
  },
  {
    title: 'Truffle Mushroom Fettuccine',
    cuisine: 'Italian',
    budget_tier: 'hifi',
    goals: ['muscle-gain'],
    minutes: 18,
    equipment_tags: ['1-pan', 'induction'],
    servings: 1,
    steps: [
      { text: 'Boil fettuccine pasta in heavily salted rolling water until al dente.', timer_seconds: 540 },
      { text: 'In a pan, melt butter and sauté sliced button mushrooms with minced garlic.', timer_seconds: 240 },
      { text: 'Add cooked fettuccine with 2 tbsp pasta water and emulsion toss.', timer_seconds: 90 },
      { text: 'Remove from heat, drizzle 1 tsp artisan truffle oil and grate cheese.', tip: 'Never boil truffle oil directly — its delicate aroma is best preserved as a finishing drizzle.' },
    ],
    macros: { kcal: 620, protein: 21.0, carbs: 74.0, fats: 28.0, fiber: 5.2 },
    cost_per_serving: 290.0,
    cost_full_pack: 650.0,
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=600&q=80',
    emoji: '🍝',
    gradient_seed: 105,
    ingredients: [
      { ingredient_id: 31, qty: 100, unit: 'g' }, // Fettuccine
      { ingredient_id: 32, qty: 120, unit: 'g' }, // Mushroom
      { ingredient_id: 33, qty: 8, unit: 'ml' }, // Truffle Oil
      { ingredient_id: 16, qty: 20, unit: 'g' }, // Butter
      { ingredient_id: 19, qty: 10, unit: 'g' }, // Garlic
    ],
  },
  {
    title: 'Dragon Fruit & Blueberry Açaí Glow Bowl',
    cuisine: 'Continental',
    budget_tier: 'hifi',
    goals: ['fat-loss', '15-min'],
    minutes: 8,
    equipment_tags: ['mixer', 'hostel-friendly'],
    servings: 1,
    steps: [
      { text: 'Blend frozen dragon fruit cubes, acai puree, and 1 ripe banana until velvety thick.', timer_seconds: 90 },
      { text: 'Pour thick smoothie base into chilled bowl.', timer_seconds: 30 },
      { text: 'Artfully arrange sliced dragon fruit, crunchy granola, and chia seeds.', tip: 'Gourmet cafe antioxidant booster ready in 8 mins flat.' },
    ],
    macros: { kcal: 410, protein: 12.0, carbs: 76.0, fats: 8.0, fiber: 14.0 },
    cost_per_serving: 245.0,
    cost_full_pack: 520.0,
    image_url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80',
    emoji: '🫐',
    gradient_seed: 106,
    ingredients: [
      { ingredient_id: 34, qty: 1, unit: 'piece' }, // Dragon Fruit
      { ingredient_id: 35, qty: 100, unit: 'g' }, // Acai Puree
      { ingredient_id: 46, qty: 1, unit: 'piece' }, // Banana
      { ingredient_id: 45, qty: 40, unit: 'g' }, // Granola
    ],
  },
  {
    title: 'Sourdough Avocado Poached Eggs',
    cuisine: 'Continental',
    budget_tier: 'hifi',
    goals: ['high-protein', '15-min'],
    minutes: 12,
    equipment_tags: ['1-pan'],
    servings: 1,
    steps: [
      { text: 'Toast sourdough slice in pan with a touch of butter until golden and crisp.', timer_seconds: 180 },
      { text: 'Mash ripe avocado with salt, pepper, and lime juice.', timer_seconds: 60 },
      { text: 'Poach or soft-fry 2 eggs in boiling water/pan for 3 minutes.', timer_seconds: 180 },
      { text: 'Spread avocado over toast, top with warm eggs and chilli flakes.', tip: 'Slice open yolks for that iconic golden runny texture.' },
    ],
    macros: { kcal: 490, protein: 24.0, carbs: 36.0, fats: 28.0, fiber: 9.0 },
    cost_per_serving: 210.0,
    cost_full_pack: 460.0,
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    emoji: '🥑',
    gradient_seed: 107,
    ingredients: [
      { ingredient_id: 37, qty: 1, unit: 'slice' }, // Sourdough
      { ingredient_id: 36, qty: 1, unit: 'piece' }, // Avocado
      { ingredient_id: 6, qty: 2, unit: 'piece' }, // Egg
      { ingredient_id: 50, qty: 0.5, unit: 'piece' }, // Lemon
    ],
  },
  {
    title: 'Norwegian Teriyaki Salmon Quinoa Bowl',
    cuisine: 'Pan-Asian',
    budget_tier: 'hifi',
    goals: ['high-protein', 'muscle-gain'],
    minutes: 18,
    equipment_tags: ['1-pan'],
    servings: 1,
    steps: [
      { text: 'Simmer quinoa in 1 cup water with salt until tender and fluffy.', timer_seconds: 600 },
      { text: 'Sear seasoned salmon fillet skin-side down for 4 mins, flip for 3 mins.', timer_seconds: 420 },
      { text: 'Pour soy sauce, honey, and minced garlic over salmon in pan to glaze.', timer_seconds: 60 },
      { text: 'Assemble over quinoa, garnish with toasted seeds.', tip: 'Omega-3 powerhouse with 42g pure protein.' },
    ],
    macros: { kcal: 680, protein: 44.0, carbs: 48.0, fats: 32.0, fiber: 6.0 },
    cost_per_serving: 380.0,
    cost_full_pack: 720.0,
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    emoji: '🍣',
    gradient_seed: 108,
    ingredients: [
      { ingredient_id: 39, qty: 180, unit: 'g' }, // Salmon
      { ingredient_id: 38, qty: 60, unit: 'g' }, // Quinoa
      { ingredient_id: 40, qty: 15, unit: 'ml' }, // Soy Sauce
      { ingredient_id: 19, qty: 5, unit: 'g' }, // Garlic
    ],
  },
  {
    title: 'Mumbai Street-Style Egg Bhurji & Pav',
    cuisine: 'Indian',
    budget_tier: 'broke',
    goals: ['high-protein', '15-min'],
    minutes: 10,
    equipment_tags: ['1-pan', 'hostel-friendly'],
    servings: 1,
    steps: [
      { text: 'Heat butter in pan, add cumin, chopped onions, and green chillies.', timer_seconds: 90 },
      { text: 'Add chopped tomatoes, turmeric, and pav bhaji/garam masala.', timer_seconds: 90 },
      { text: 'Whisk 3 eggs with salt, pour into pan and scramble gently over medium heat.', timer_seconds: 150 },
      { text: 'Toast pav on the buttery pan and serve with coriander.', tip: 'Street food comfort with 24g bioavailable protein.' },
    ],
    macros: { kcal: 430, protein: 25.0, carbs: 32.0, fats: 22.0, fiber: 3.5 },
    cost_per_serving: 42.0,
    cost_full_pack: 130.0,
    image_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    emoji: '🍳',
    gradient_seed: 109,
    ingredients: [
      { ingredient_id: 6, qty: 3, unit: 'piece' }, // Egg
      { ingredient_id: 9, qty: 2, unit: 'piece' }, // Pav / Bread
      { ingredient_id: 1, qty: 1, unit: 'piece' }, // Onion
      { ingredient_id: 3, qty: 1, unit: 'piece' }, // Tomato
      { ingredient_id: 16, qty: 15, unit: 'g' }, // Butter
      { ingredient_id: 4, qty: 10, unit: 'g' }, // Coriander
    ],
  },
  {
    title: 'Dorm Room Soya Keema Bhurji',
    cuisine: 'Indian',
    budget_tier: 'broke',
    goals: ['high-protein', 'muscle-gain'],
    minutes: 15,
    equipment_tags: ['1-pan', 'kettle-only'],
    servings: 1,
    steps: [
      { text: 'Soak soya chunks in boiling water for 8 mins, then squeeze dry and mince.', timer_seconds: 480 },
      { text: 'Heat oil, sauté cumin, onions, ginger, and garlic.', timer_seconds: 120 },
      { text: 'Add tomatoes, turmeric, red chilli, and garam masala.', timer_seconds: 120 },
      { text: 'Toss minced soya, cook for 4 minutes with a splash of water.', timer_seconds: 240 },
    ],
    macros: { kcal: 360, protein: 36.0, carbs: 28.0, fats: 11.0, fiber: 9.0 },
    cost_per_serving: 28.0,
    cost_full_pack: 115.0,
    image_url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80',
    emoji: '🥘',
    gradient_seed: 110,
    ingredients: [
      { ingredient_id: 20, qty: 70, unit: 'g' }, // Soya Chunks
      { ingredient_id: 1, qty: 1, unit: 'piece' }, // Onion
      { ingredient_id: 3, qty: 1, unit: 'piece' }, // Tomato
      { ingredient_id: 19, qty: 5, unit: 'g' }, // Garlic
      { ingredient_id: 25, qty: 3, unit: 'g' }, // Red chilli
      { ingredient_id: 27, qty: 10, unit: 'ml' }, // Oil
    ],
  },
];

// Expand hero list to 150 recipes deterministically
const CUISINE_LIST = ['Indian', 'Italian', 'Pan-Asian', 'Mexican', 'Continental', 'Middle Eastern'];
const GOALS_LIST = ['high-protein', 'muscle-gain', 'fat-loss', '15-min'];
const EQUIPMENT_LIST = ['1-pan', 'kettle-only', 'hostel-friendly', 'induction', 'oven', 'mixer'];
const BASE_DISHES = [
  { name: 'Khichdi', cuisine: 'Indian', emoji: '🍲', baseTier: 'broke' },
  { name: 'Poha', cuisine: 'Indian', emoji: '🍚', baseTier: 'broke' },
  { name: 'Bhurji', cuisine: 'Indian', emoji: '🍳', baseTier: 'broke' },
  { name: 'Curry', cuisine: 'Indian', emoji: '🥘', baseTier: 'balanced' },
  { name: 'Tikka Bowl', cuisine: 'Indian', emoji: '🥗', baseTier: 'balanced' },
  { name: 'Biryani Bowl', cuisine: 'Indian', emoji: '🍛', baseTier: 'balanced' },
  { name: 'Pasta Aglio e Olio', cuisine: 'Italian', emoji: '🍝', baseTier: 'broke' },
  { name: 'Tomato Basil Penne', cuisine: 'Italian', emoji: '🍝', baseTier: 'balanced' },
  { name: 'Truffle Fettuccine', cuisine: 'Italian', emoji: '🍝', baseTier: 'hifi' },
  { name: 'Ramen Quick Pot', cuisine: 'Pan-Asian', emoji: '🍜', baseTier: 'broke' },
  { name: 'Teriyaki Stir Fry', cuisine: 'Pan-Asian', emoji: '🥢', baseTier: 'balanced' },
  { name: 'Gourmet Sushi Bowl', cuisine: 'Pan-Asian', emoji: '🍣', baseTier: 'hifi' },
  { name: 'Bean & Corn Quesadilla', cuisine: 'Mexican', emoji: '🌮', baseTier: 'broke' },
  { name: 'Chipotle Protein Bowl', cuisine: 'Mexican', emoji: '🌯', baseTier: 'balanced' },
  { name: 'Artisan Fajita Skillet', cuisine: 'Mexican', emoji: '🥩', baseTier: 'hifi' },
  { name: 'Peanut Butter Oats', cuisine: 'Continental', emoji: '🥣', baseTier: 'broke' },
  { name: 'Greek Yogurt Parfait', cuisine: 'Continental', emoji: '🍨', baseTier: 'balanced' },
  { name: 'Avocado Sourdough Toast', cuisine: 'Continental', emoji: '🥑', baseTier: 'hifi' },
  { name: 'Acai Superfood Bowl', cuisine: 'Continental', emoji: '🫐', baseTier: 'hifi' },
  { name: 'Hummus Pita Wrap', cuisine: 'Middle Eastern', emoji: '🥙', baseTier: 'balanced' },
];

console.log('Generating 10,000 deterministic recipes...');

const allRecipes: RecipeSeed[] = [];

// 1. Add top curated heroes
HERO_RECIPES_DATA.forEach((hero, index) => {
  allRecipes.push({
    id: index + 1,
    ...hero,
  });
});

// 2. Generate remaining up to 150 heroes
while (allRecipes.length < 150) {
  const id = allRecipes.length + 1;
  const dish = sample(BASE_DISHES);
  const tier = dish.baseTier as 'broke' | 'balanced' | 'hifi';
  const goal = sample(GOALS_LIST);
  const equip = sampleMultiple(EQUIPMENT_LIST, randomInt(1, 2));

  let costPerServing: number;
  let costFullPack: number;
  if (tier === 'broke') {
    costPerServing = randomFloat(22, 58);
    costFullPack = randomFloat(80, 140);
  } else if (tier === 'balanced') {
    costPerServing = randomFloat(62, 145);
    costFullPack = randomFloat(160, 320);
  } else {
    costPerServing = randomFloat(155, 390);
    costFullPack = randomFloat(420, 850);
  }

  const minutes = tier === 'broke' ? randomInt(8, 15) : randomInt(12, 25);
  const image = CATEGORY_IMAGE_POOL[id % CATEGORY_IMAGE_POOL.length];

  const ingredientSample = sampleMultiple(INGREDIENTS, randomInt(3, 5)).map((ing) => ({
    ingredient_id: ing.id,
    qty: randomInt(10, 100),
    unit: ing.packSize.includes('g') ? 'g' : ing.packSize.includes('piece') ? 'piece' : 'g',
  }));

  allRecipes.push({
    id,
    title: `Hero ${dish.name} with ${sample(['Crispy Onions', 'Herb Spices', 'Toasted Peanuts', 'Garlic Crunch', 'Farm Veggies'])}`,
    cuisine: dish.cuisine,
    budget_tier: tier,
    goals: [goal, minutes <= 15 ? '15-min' : 'muscle-gain'],
    minutes,
    equipment_tags: equip,
    servings: 1,
    steps: [
      { text: 'Prep ingredients and heat cooking surface.', timer_seconds: 60, tip: 'Keep everything measured beforehand.' },
      { text: `Cook base ${dish.name} gently with spices and season to taste.`, timer_seconds: minutes * 45 },
      { text: 'Garnish with fresh herbs and serve immediately hot.', tip: 'Pair with warm tea or cold yogurt.' },
    ],
    macros: {
      kcal: randomInt(280, 650),
      protein: randomFloat(12, 42),
      carbs: randomFloat(30, 75),
      fats: randomFloat(6, 26),
      fiber: randomFloat(3, 11),
    },
    cost_per_serving: costPerServing,
    cost_full_pack: costFullPack,
    image_url: image,
    emoji: dish.emoji,
    gradient_seed: id,
    ingredients: ingredientSample,
  });
}

// 3. Generate remaining recipes up to 10,000
const ADJECTIVES = ['Quick', 'Hostel', 'Homestyle', 'Fiery', 'Loaded', 'Golden', 'Creamy', 'Rustic', 'Spicy', 'Crispy', 'Power', 'Smart', 'Zesty', 'Savory', 'Smoky'];
const VARIATIONS = ['with Caramelized Onions', 'with Fried Eggs', 'with Aloo Crunch', 'with Garlic Butter', 'with Roasted Peanuts', 'with Tangy Tomato', 'with Soya Protein', 'with Fresh Dhaniya', 'with Melting Cheese', 'with Chili Flakes'];

for (let id = 151; id <= 10000; id++) {
  const dish = sample(BASE_DISHES);
  const adj = sample(ADJECTIVES);
  const variation = sample(VARIATIONS);
  const tier: 'broke' | 'balanced' | 'hifi' = (id % 3 === 0) ? 'broke' : (id % 3 === 1) ? 'balanced' : 'hifi';
  
  let costPerServing: number;
  let costFullPack: number;
  if (tier === 'broke') {
    costPerServing = randomFloat(20, 58);
    costFullPack = randomFloat(75, 145);
  } else if (tier === 'balanced') {
    costPerServing = randomFloat(60, 148);
    costFullPack = randomFloat(150, 320);
  } else {
    costPerServing = randomFloat(152, 420);
    costFullPack = randomFloat(380, 890);
  }

  const minutes = randomInt(8, 28);
  const goals = sampleMultiple(GOALS_LIST, randomInt(1, 2));
  if (minutes <= 15 && !goals.includes('15-min')) goals.push('15-min');

  const equip = sampleMultiple(EQUIPMENT_LIST, randomInt(1, 2));
  const image = CATEGORY_IMAGE_POOL[id % CATEGORY_IMAGE_POOL.length];

  const ingCount = randomInt(3, 6);
  const recipeIngs = sampleMultiple(INGREDIENTS, ingCount).map((ing) => ({
    ingredient_id: ing.id,
    qty: randomInt(15, 120),
    unit: ing.packSize.includes('piece') ? 'piece' : 'g',
  }));

  allRecipes.push({
    id,
    title: `${adj} ${dish.cuisine} ${dish.name} ${variation}`,
    cuisine: dish.cuisine,
    budget_tier: tier,
    goals,
    minutes,
    equipment_tags: equip,
    servings: randomInt(1, 2),
    steps: [
      { text: `Rinse and prep ingredients. Heat pan or kettle.`, timer_seconds: 60, tip: 'Simple prep cuts cook time in half.' },
      { text: `Add base ingredients and aromatics. Sauté until fragrant.`, timer_seconds: minutes * 30 },
      { text: `Simmer and cook until tender. Adjust salt and seasoning.`, timer_seconds: minutes * 30 },
      { text: `Serve hot and enjoy a budget-friendly home-cooked meal!`, tip: 'Pack leftovers for campus lunch.' },
    ],
    macros: {
      kcal: randomInt(260, 680),
      protein: randomFloat(14, 46),
      carbs: randomFloat(28, 80),
      fats: randomFloat(5, 28),
      fiber: randomFloat(2, 12),
    },
    cost_per_serving: costPerServing,
    cost_full_pack: costFullPack,
    image_url: image,
    emoji: dish.emoji,
    gradient_seed: id,
    ingredients: recipeIngs,
  });
}

console.log(`Generated ${allRecipes.length} recipes deterministically.`);

// 4. Generate Store Prices for each ingredient across Zepto, Blinkit, Instamart
const storePrices: { ingredient_id: number; store: string; price: number }[] = [];

INGREDIENTS.forEach((ing) => {
  const base = ing.avgPackPrice;
  const zeptoPrice = Number((base * (1.0 + (ing.id % 5) * 0.02 - 0.04)).toFixed(0));
  const blinkitPrice = Number((base * (1.0 + ((ing.id * 3) % 7) * 0.02 - 0.06)).toFixed(0));
  const instamartPrice = Number((base * (1.0 + ((ing.id * 5) % 6) * 0.02 - 0.03)).toFixed(0));

  storePrices.push({ ingredient_id: ing.id, store: 'ZEPTO', price: Math.max(10, zeptoPrice) });
  storePrices.push({ ingredient_id: ing.id, store: 'BLINKIT', price: Math.max(10, blinkitPrice) });
  storePrices.push({ ingredient_id: ing.id, store: 'INSTAMART', price: Math.max(10, instamartPrice) });
});

// Ensure directory exists
const assetDir = path.join(process.cwd(), 'bitecraft', 'assets', 'seeds');
if (!fs.existsSync(assetDir)) {
  fs.mkdirSync(assetDir, { recursive: true });
}

// Write JSON files for offline Drift SQLite seeding
fs.writeFileSync(
  path.join(assetDir, 'ingredients_seed.json'),
  JSON.stringify(INGREDIENTS, null, 2),
  'utf-8'
);
console.log(`Wrote ${INGREDIENTS.length} ingredients to ingredients_seed.json`);

// Compact JSON for recipes to keep file fast to read
fs.writeFileSync(
  path.join(assetDir, 'recipes_seed.json'),
  JSON.stringify(allRecipes),
  'utf-8'
);
console.log(`Wrote ${allRecipes.length} recipes to recipes_seed.json`);

fs.writeFileSync(
  path.join(assetDir, 'store_prices_seed.json'),
  JSON.stringify(storePrices, null, 2),
  'utf-8'
);
console.log(`Wrote ${storePrices.length} store prices to store_prices_seed.json`);

// 5. Generate seed.sql in supabase/
const sqlPath = path.join(process.cwd(), 'supabase', 'seed.sql');
const sqlWriteStream = fs.createWriteStream(sqlPath, { encoding: 'utf-8' });

sqlWriteStream.write('-- Deterministic BiteCraft Seed Data (10,000 Recipes)\n\n');

// Insert Ingredients
sqlWriteStream.write('-- Ingredients\n');
for (const ing of INGREDIENTS) {
  const aliasesArray = `ARRAY[${ing.aliases.map((a) => `'${a.replace(/'/g, "''")}'`).join(', ')}]`;
  sqlWriteStream.write(
    `INSERT INTO public.ingredients (id, name, aliases, category, pack_size, avg_pack_price) VALUES (${ing.id}, '${ing.name.replace(/'/g, "''")}', ${aliasesArray}, '${ing.category}', '${ing.packSize}', ${ing.avgPackPrice}) ON CONFLICT (id) DO NOTHING;\n`
  );
}

// Insert Store Prices
sqlWriteStream.write('\n-- Store Prices\n');
for (const sp of storePrices) {
  sqlWriteStream.write(
    `INSERT INTO public.store_prices (ingredient_id, store, price) VALUES (${sp.ingredient_id}, '${sp.store}', ${sp.price}) ON CONFLICT (ingredient_id, store) DO UPDATE SET price = EXCLUDED.price;\n`
  );
}

// Insert Recipes in batches
sqlWriteStream.write('\n-- Recipes\n');
const BATCH_SIZE = 250;
for (let i = 0; i < allRecipes.length; i += BATCH_SIZE) {
  const batch = allRecipes.slice(i, i + BATCH_SIZE);
  const values = batch
    .map((r) => {
      const goalsArray = `ARRAY[${r.goals.map((g) => `'${g}'`).join(',')}]`;
      const equipArray = `ARRAY[${r.equipment_tags.map((e) => `'${e}'`).join(',')}]`;
      const stepsJson = `'${JSON.stringify(r.steps).replace(/'/g, "''")}'::jsonb`;
      const macrosJson = `'${JSON.stringify(r.macros).replace(/'/g, "''")}'::jsonb`;
      const title = r.title.replace(/'/g, "''");
      return `(${r.id}, '${title}', '${r.cuisine}', '${r.budget_tier}', ${goalsArray}, ${r.minutes}, ${equipArray}, ${r.servings}, ${stepsJson}, ${macrosJson}, ${r.cost_per_serving}, ${r.cost_full_pack}, '${r.image_url}', '${r.emoji}', ${r.gradient_seed})`;
    })
    .join(',\n');

  sqlWriteStream.write(
    `INSERT INTO public.recipes (id, title, cuisine, budget_tier, goals, minutes, equipment_tags, servings, steps, macros, cost_per_serving, cost_full_pack, image_url, emoji, gradient_seed) VALUES\n${values}\nON CONFLICT (id) DO NOTHING;\n`
  );
}

// Insert Recipe Ingredients
sqlWriteStream.write('\n-- Recipe Ingredients\n');
const allRecipeIngs: { recipe_id: number; ingredient_id: number; qty: number; unit: string }[] = [];
for (const r of allRecipes) {
  for (const ring of r.ingredients) {
    allRecipeIngs.push({
      recipe_id: r.id,
      ingredient_id: ring.ingredient_id,
      qty: ring.qty,
      unit: ring.unit,
    });
  }
}

for (let i = 0; i < allRecipeIngs.length; i += 500) {
  const batch = allRecipeIngs.slice(i, i + 500);
  const values = batch
    .map((ri) => `(${ri.recipe_id}, ${ri.ingredient_id}, ${ri.qty}, '${ri.unit}')`)
    .join(',\n');
  sqlWriteStream.write(
    `INSERT INTO public.recipe_ingredients (recipe_id, ingredient_id, qty, unit) VALUES\n${values};\n`
  );
}

sqlWriteStream.end(() => {
  console.log(`Generated complete seed.sql at ${sqlPath}`);
  console.log('Seed generation finished successfully!');
});
