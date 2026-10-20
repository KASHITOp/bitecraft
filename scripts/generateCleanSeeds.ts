import * as fs from 'fs';
import * as path from 'path';

// Ingredient seed representation
interface IngredientSeed {
  id: number;
  name: string;
  aliases: string[];
  category: string;
  packSize: string;
  avgPackPrice: number;
  // unit price and nutrition per standard base unit (grams, ml, or piece)
  unitPrice: number; // ₹ per g/ml or per piece
  unitType: 'g' | 'ml' | 'piece';
  calPerUnit: number;
  protPerUnit: number;
  carbPerUnit: number;
  fatPerUnit: number;
  fibPerUnit: number;
}

// 50 ingredients with exact IDs matching existing seed
const INGREDIENTS_DATA: IngredientSeed[] = [
  { id: 1, name: 'Onion', aliases: ['Kanda', 'Pyaz', 'Piyaz'], category: 'Produce', packSize: '1 kg', avgPackPrice: 38, unitPrice: 38 / 1000, unitType: 'g', calPerUnit: 0.40, protPerUnit: 0.011, carbPerUnit: 0.093, fatPerUnit: 0.001, fibPerUnit: 0.017 },
  { id: 2, name: 'Potato', aliases: ['Aloo', 'Batata', 'Alu'], category: 'Produce', packSize: '1 kg', avgPackPrice: 32, unitPrice: 32 / 1000, unitType: 'g', calPerUnit: 0.77, protPerUnit: 0.020, carbPerUnit: 0.175, fatPerUnit: 0.001, fibPerUnit: 0.022 },
  { id: 3, name: 'Tomato', aliases: ['Tamatar', 'Tameta'], category: 'Produce', packSize: '500 g', avgPackPrice: 28, unitPrice: 28 / 500, unitType: 'g', calPerUnit: 0.18, protPerUnit: 0.009, carbPerUnit: 0.039, fatPerUnit: 0.002, fibPerUnit: 0.012 },
  { id: 4, name: 'Coriander', aliases: ['Kothimbir', 'Dhaniya', 'Cilantro'], category: 'Produce', packSize: '100 g', avgPackPrice: 15, unitPrice: 15 / 1000, unitType: 'g', calPerUnit: 0.23, protPerUnit: 0.021, carbPerUnit: 0.037, fatPerUnit: 0.005, fibPerUnit: 0.028 },
  { id: 5, name: 'Poha', aliases: ['Aval', 'Chivda', 'Flattened Rice', 'Atukulu'], category: 'Grains', packSize: '500 g', avgPackPrice: 42, unitPrice: 42 / 500, unitType: 'g', calPerUnit: 3.60, protPerUnit: 0.070, carbPerUnit: 0.770, fatPerUnit: 0.020, fibPerUnit: 0.030 },
  { id: 6, name: 'Egg', aliases: ['Anda', 'Eggs', 'Muttai'], category: 'Dairy & Eggs', packSize: '6 pack', avgPackPrice: 52, unitPrice: 52 / 6, unitType: 'piece', calPerUnit: 72, protPerUnit: 6.3, carbPerUnit: 0.4, fatPerUnit: 5.0, fibPerUnit: 0.0 },
  { id: 7, name: 'Paneer', aliases: ['Cottage Cheese', 'Chenna'], category: 'Dairy & Eggs', packSize: '200 g', avgPackPrice: 85, unitPrice: 85 / 200, unitType: 'g', calPerUnit: 2.90, protPerUnit: 0.180, carbPerUnit: 0.030, fatPerUnit: 0.220, fibPerUnit: 0.0 },
  { id: 8, name: 'Curd', aliases: ['Dahi', 'Yogurt', 'Thayir'], category: 'Dairy & Eggs', packSize: '400 g', avgPackPrice: 35, unitPrice: 35 / 400, unitType: 'g', calPerUnit: 0.60, protPerUnit: 0.035, carbPerUnit: 0.047, fatPerUnit: 0.030, fibPerUnit: 0.0 },
  { id: 9, name: 'Bread', aliases: ['Pav', 'White Bread', 'Brown Bread', 'Roti'], category: 'Bakery', packSize: '400 g', avgPackPrice: 40, unitPrice: 40 / 8, unitType: 'piece', calPerUnit: 80, protPerUnit: 2.7, carbPerUnit: 15.0, fatPerUnit: 1.0, fibPerUnit: 0.9 },
  { id: 10, name: 'Rice', aliases: ['Chawal', 'Basmati Rice', 'Bhat'], category: 'Grains', packSize: '1 kg', avgPackPrice: 65, unitPrice: 65 / 1000, unitType: 'g', calPerUnit: 3.60, protPerUnit: 0.070, carbPerUnit: 0.800, fatPerUnit: 0.006, fibPerUnit: 0.013 },
  { id: 11, name: 'Moong Dal', aliases: ['Yellow Lentil', 'Peeli Dal', 'Mung'], category: 'Pulses', packSize: '500 g', avgPackPrice: 70, unitPrice: 70 / 500, unitType: 'g', calPerUnit: 3.47, protPerUnit: 0.240, carbPerUnit: 0.600, fatPerUnit: 0.012, fibPerUnit: 0.160 },
  { id: 12, name: 'Toor Dal', aliases: ['Arhar Dal', 'Yellow Pigeon Peas'], category: 'Pulses', packSize: '500 g', avgPackPrice: 85, unitPrice: 85 / 500, unitType: 'g', calPerUnit: 3.43, protPerUnit: 0.220, carbPerUnit: 0.630, fatPerUnit: 0.015, fibPerUnit: 0.150 },
  { id: 13, name: 'Rolled Oats', aliases: ['Oatmeal', 'Oats', 'Masala Oats'], category: 'Grains', packSize: '500 g', avgPackPrice: 90, unitPrice: 90 / 500, unitType: 'g', calPerUnit: 3.89, protPerUnit: 0.169, carbPerUnit: 0.663, fatPerUnit: 0.069, fibPerUnit: 0.106 },
  { id: 14, name: 'Chicken Breast', aliases: ['Boneless Chicken', 'Murgh'], category: 'Meat', packSize: '500 g', avgPackPrice: 170, unitPrice: 170 / 500, unitType: 'g', calPerUnit: 1.65, protPerUnit: 0.310, carbPerUnit: 0.0, fatPerUnit: 0.036, fibPerUnit: 0.0 },
  { id: 15, name: 'Peanut Butter', aliases: ['PB', 'Mungfali Butter'], category: 'Spreads', packSize: '350 g', avgPackPrice: 140, unitPrice: 140 / 350, unitType: 'g', calPerUnit: 5.88, protPerUnit: 0.250, carbPerUnit: 0.200, fatPerUnit: 0.500, fibPerUnit: 0.060 },
  { id: 16, name: 'Butter', aliases: ['Makhan', 'Amul Butter'], category: 'Dairy & Eggs', packSize: '100 g', avgPackPrice: 56, unitPrice: 56 / 100, unitType: 'g', calPerUnit: 7.17, protPerUnit: 0.009, carbPerUnit: 0.001, fatPerUnit: 0.810, fibPerUnit: 0.0 },
  { id: 17, name: 'Green Chilli', aliases: ['Hari Mirch', 'Mirchi'], category: 'Produce', packSize: '100 g', avgPackPrice: 12, unitPrice: 12 / 100, unitType: 'g', calPerUnit: 0.40, protPerUnit: 0.020, carbPerUnit: 0.090, fatPerUnit: 0.002, fibPerUnit: 0.015 },
  { id: 18, name: 'Ginger', aliases: ['Adrak', 'Inji'], category: 'Produce', packSize: '100 g', avgPackPrice: 20, unitPrice: 20 / 100, unitType: 'g', calPerUnit: 0.80, protPerUnit: 0.018, carbPerUnit: 0.178, fatPerUnit: 0.008, fibPerUnit: 0.020 },
  { id: 19, name: 'Garlic', aliases: ['Lahsun', 'Lasun', 'Poondu'], category: 'Produce', packSize: '100 g', avgPackPrice: 25, unitPrice: 25 / 100, unitType: 'g', calPerUnit: 1.49, protPerUnit: 0.064, carbPerUnit: 0.331, fatPerUnit: 0.005, fibPerUnit: 0.021 },
  { id: 20, name: 'Soya Chunks', aliases: ['Mealmaker', 'Nutrela', 'Soya Keema'], category: 'Proteins', packSize: '200 g', avgPackPrice: 45, unitPrice: 45 / 200, unitType: 'g', calPerUnit: 3.45, protPerUnit: 0.520, carbPerUnit: 0.330, fatPerUnit: 0.005, fibPerUnit: 0.130 },
  { id: 21, name: 'Peanuts', aliases: ['Moongphali', 'Groundnut', 'Shengdana'], category: 'Nuts', packSize: '200 g', avgPackPrice: 40, unitPrice: 40 / 200, unitType: 'g', calPerUnit: 5.67, protPerUnit: 0.258, carbPerUnit: 0.161, fatPerUnit: 0.492, fibPerUnit: 0.085 },
  { id: 22, name: 'Mustard Seeds', aliases: ['Rai', 'Sarson'], category: 'Spices', packSize: '100 g', avgPackPrice: 22, unitPrice: 22 / 100, unitType: 'g', calPerUnit: 5.08, protPerUnit: 0.260, carbPerUnit: 0.280, fatPerUnit: 0.360, fibPerUnit: 0.120 },
  { id: 23, name: 'Cumin Seeds', aliases: ['Jeera', 'Jira'], category: 'Spices', packSize: '100 g', avgPackPrice: 38, unitPrice: 38 / 100, unitType: 'g', calPerUnit: 3.75, protPerUnit: 0.178, carbPerUnit: 0.442, fatPerUnit: 0.223, fibPerUnit: 0.105 },
  { id: 24, name: 'Turmeric Powder', aliases: ['Haldi', 'Manjal'], category: 'Spices', packSize: '100 g', avgPackPrice: 28, unitPrice: 28 / 100, unitType: 'g', calPerUnit: 3.54, protPerUnit: 0.078, carbPerUnit: 0.650, fatPerUnit: 0.100, fibPerUnit: 0.210 },
  { id: 25, name: 'Red Chilli Powder', aliases: ['Lal Mirch', 'Kashmiri Mirch'], category: 'Spices', packSize: '100 g', avgPackPrice: 34, unitPrice: 34 / 100, unitType: 'g', calPerUnit: 2.82, protPerUnit: 0.130, carbPerUnit: 0.500, fatPerUnit: 0.140, fibPerUnit: 0.340 },
  { id: 26, name: 'Garam Masala', aliases: ['Curry Powder', 'Spice Blend'], category: 'Spices', packSize: '100 g', avgPackPrice: 45, unitPrice: 45 / 100, unitType: 'g', calPerUnit: 3.79, protPerUnit: 0.150, carbPerUnit: 0.460, fatPerUnit: 0.150, fibPerUnit: 0.250 },
  { id: 27, name: 'Cooking Oil', aliases: ['Tel', 'Refined Oil', 'Mustard Oil'], category: 'Oils', packSize: '1 L', avgPackPrice: 130, unitPrice: 130 / 1000, unitType: 'ml', calPerUnit: 8.84, protPerUnit: 0.0, carbPerUnit: 0.0, fatPerUnit: 1.0, fibPerUnit: 0.0 },
  { id: 28, name: 'Ghee', aliases: ['Desi Ghee', 'Clarified Butter', 'Neyyi'], category: 'Dairy & Eggs', packSize: '200 ml', avgPackPrice: 155, unitPrice: 155 / 200, unitType: 'ml', calPerUnit: 9.00, protPerUnit: 0.0, carbPerUnit: 0.0, fatPerUnit: 1.0, fibPerUnit: 0.0 },
  { id: 29, name: 'Milk', aliases: ['Doodh', 'Paal'], category: 'Dairy & Eggs', packSize: '500 ml', avgPackPrice: 33, unitPrice: 33 / 500, unitType: 'ml', calPerUnit: 0.62, protPerUnit: 0.032, carbPerUnit: 0.048, fatPerUnit: 0.033, fibPerUnit: 0.0 },
  { id: 30, name: 'Cheese Slice', aliases: ['Processed Cheese', 'Cheddar Slice'], category: 'Dairy & Eggs', packSize: '10 slices', avgPackPrice: 110, unitPrice: 110 / 10, unitType: 'piece', calPerUnit: 65, protPerUnit: 4.0, carbPerUnit: 0.5, fatPerUnit: 5.5, fibPerUnit: 0.0 },
  { id: 31, name: 'Fettuccine Pasta', aliases: ['Pasta', 'Spaghetti', 'Noodles'], category: 'Grains', packSize: '500 g', avgPackPrice: 120, unitPrice: 120 / 500, unitType: 'g', calPerUnit: 3.55, protPerUnit: 0.130, carbPerUnit: 0.710, fatPerUnit: 0.015, fibPerUnit: 0.032 },
  { id: 32, name: 'Mushroom', aliases: ['Button Mushroom', 'Kukurmutta'], category: 'Produce', packSize: '200 g', avgPackPrice: 65, unitPrice: 65 / 200, unitType: 'g', calPerUnit: 0.22, protPerUnit: 0.031, carbPerUnit: 0.033, fatPerUnit: 0.003, fibPerUnit: 0.010 },
  { id: 33, name: 'Truffle Oil', aliases: ['Truffle Essence', 'Artisan Oil'], category: 'Gourmet', packSize: '100 ml', avgPackPrice: 450, unitPrice: 450 / 100, unitType: 'ml', calPerUnit: 8.84, protPerUnit: 0.0, carbPerUnit: 0.0, fatPerUnit: 1.0, fibPerUnit: 0.0 },
  { id: 34, name: 'Dragon Fruit', aliases: ['Pitaya', 'Kamalam'], category: 'Fruits', packSize: '1 piece', avgPackPrice: 95, unitPrice: 95, unitType: 'piece', calPerUnit: 150, protPerUnit: 3.0, carbPerUnit: 33.0, fatPerUnit: 1.0, fibPerUnit: 7.0 },
  { id: 35, name: 'Acai Puree', aliases: ['Acai Berry', 'Berry Blend'], category: 'Gourmet', packSize: '200 g', avgPackPrice: 290, unitPrice: 290 / 200, unitType: 'g', calPerUnit: 0.70, protPerUnit: 0.015, carbPerUnit: 0.040, fatPerUnit: 0.050, fibPerUnit: 0.030 },
  { id: 36, name: 'Avocado', aliases: ['Butter Fruit', 'Makhan Phal'], category: 'Produce', packSize: '1 piece', avgPackPrice: 85, unitPrice: 85, unitType: 'piece', calPerUnit: 240, protPerUnit: 3.0, carbPerUnit: 12.0, fatPerUnit: 22.0, fibPerUnit: 10.0 },
  { id: 37, name: 'Sourdough Bread', aliases: ['Artisan Bread', 'Sourdough Loaf'], category: 'Bakery', packSize: '400 g', avgPackPrice: 135, unitPrice: 135 / 6, unitType: 'piece', calPerUnit: 170, protPerUnit: 6.0, carbPerUnit: 34.0, fatPerUnit: 1.0, fibPerUnit: 2.0 },
  { id: 38, name: 'Quinoa', aliases: ['Supergrain', 'Inca Wheat'], category: 'Grains', packSize: '500 g', avgPackPrice: 195, unitPrice: 195 / 500, unitType: 'g', calPerUnit: 3.68, protPerUnit: 0.141, carbPerUnit: 0.642, fatPerUnit: 0.061, fibPerUnit: 0.070 },
  { id: 39, name: 'Salmon Fillet', aliases: ['Raw Salmon', 'Atlantic Salmon'], category: 'Meat', packSize: '250 g', avgPackPrice: 380, unitPrice: 380 / 250, unitType: 'g', calPerUnit: 2.08, protPerUnit: 0.200, carbPerUnit: 0.0, fatPerUnit: 0.130, fibPerUnit: 0.0 },
  { id: 40, name: 'Soy Sauce', aliases: ['Dark Soya Sauce', 'Shoyu'], category: 'Sauces', packSize: '200 ml', avgPackPrice: 60, unitPrice: 60 / 200, unitType: 'ml', calPerUnit: 0.53, protPerUnit: 0.080, carbPerUnit: 0.050, fatPerUnit: 0.001, fibPerUnit: 0.008 },
  { id: 41, name: 'Tofu', aliases: ['Bean Curd', 'Soya Paneer'], category: 'Proteins', packSize: '200 g', avgPackPrice: 65, unitPrice: 65 / 200, unitType: 'g', calPerUnit: 0.76, protPerUnit: 0.080, carbPerUnit: 0.019, fatPerUnit: 0.048, fibPerUnit: 0.003 },
  { id: 42, name: 'Black Beans', aliases: ['Frijoles', 'Rajma Chota'], category: 'Pulses', packSize: '500 g', avgPackPrice: 95, unitPrice: 95 / 500, unitType: 'g', calPerUnit: 3.41, protPerUnit: 0.216, carbPerUnit: 0.624, fatPerUnit: 0.014, fibPerUnit: 0.152 },
  { id: 43, name: 'Sweet Corn', aliases: ['Makai', 'Corn Kernels'], category: 'Produce', packSize: '250 g', avgPackPrice: 40, unitPrice: 40 / 250, unitType: 'g', calPerUnit: 0.86, protPerUnit: 0.032, carbPerUnit: 0.190, fatPerUnit: 0.012, fibPerUnit: 0.027 },
  { id: 44, name: 'Greek Yogurt', aliases: ['Hung Curd', 'Protein Dahi'], category: 'Dairy & Eggs', packSize: '400 g', avgPackPrice: 90, unitPrice: 90 / 400, unitType: 'g', calPerUnit: 0.97, protPerUnit: 0.090, carbPerUnit: 0.040, fatPerUnit: 0.050, fibPerUnit: 0.0 },
  { id: 45, name: 'Granola', aliases: ['Muesli', 'Breakfast Clusters'], category: 'Grains', packSize: '400 g', avgPackPrice: 185, unitPrice: 185 / 400, unitType: 'g', calPerUnit: 4.50, protPerUnit: 0.100, carbPerUnit: 0.650, fatPerUnit: 0.170, fibPerUnit: 0.080 },
  { id: 46, name: 'Banana', aliases: ['Kela', 'Vazhaipazham'], category: 'Fruits', packSize: '6 pack', avgPackPrice: 45, unitPrice: 45 / 6, unitType: 'piece', calPerUnit: 89, protPerUnit: 1.1, carbPerUnit: 22.8, fatPerUnit: 0.3, fibPerUnit: 2.6 },
  { id: 47, name: 'Maggi Noodles', aliases: ['Instant Noodles', '2-Min Noodles'], category: 'Grains', packSize: '4 pack', avgPackPrice: 56, unitPrice: 56 / 4, unitType: 'piece', calPerUnit: 310, protPerUnit: 7.0, carbPerUnit: 45.0, fatPerUnit: 11.5, fibPerUnit: 2.5 },
  { id: 48, name: 'Spinach', aliases: ['Palak', 'Keerai'], category: 'Produce', packSize: '250 g', avgPackPrice: 25, unitPrice: 25 / 250, unitType: 'g', calPerUnit: 0.23, protPerUnit: 0.029, carbPerUnit: 0.036, fatPerUnit: 0.004, fibPerUnit: 0.022 },
  { id: 49, name: 'Capsicum', aliases: ['Shimla Mirch', 'Bell Pepper'], category: 'Produce', packSize: '250 g', avgPackPrice: 32, unitPrice: 32 / 250, unitType: 'g', calPerUnit: 0.26, protPerUnit: 0.010, carbPerUnit: 0.060, fatPerUnit: 0.003, fibPerUnit: 0.021 },
  { id: 50, name: 'Lemon', aliases: ['Nimbu', 'Lime'], category: 'Produce', packSize: '4 pack', avgPackPrice: 20, unitPrice: 20 / 4, unitType: 'piece', calPerUnit: 15, protPerUnit: 0.5, carbPerUnit: 4.5, fatPerUnit: 0.2, fibPerUnit: 1.4 },
];

const ingMap = new Map<number, IngredientSeed>();
INGREDIENTS_DATA.forEach(i => ingMap.set(i.id, i));

// Step definition
interface StepDef {
  text: string;
  timer_seconds?: number;
  tip?: string;
}

// Ingredient requirement
interface IngReq {
  id: number;
  qty: number;
  unit: string;
}

// Topping definition
interface ToppingDef {
  suffix: string; // e.g. "with Roasted Peanuts"
  step: StepDef; // specific topping prep step
  ingredients: IngReq[];
  extraMinutes?: number;
}

// Base dish definition
interface BaseDishConfig {
  name: string;
  cuisine: string;
  emoji: string;
  minutes: number;
  equipment: string[];
  imageUrl: string;
  whereItGoesWrongTip: string;
  baseSteps: StepDef[];
  baseIngredients: IngReq[];
  toppings: ToppingDef[];
}

const BASE_DISH_CONFIGS: BaseDishConfig[] = [
  // 1. Kanda Poha (Indian)
  {
    name: 'Kanda Poha',
    cuisine: 'Indian',
    emoji: '🍚',
    minutes: 10,
    equipment: ['1-pan', 'hostel-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Rinsing poha for too long or soaking it in standing water turns it into soggy mush. A quick 20-second rinse in a colander is all it takes.',
    baseIngredients: [
      { id: 5, qty: 90, unit: 'g' }, // Poha
      { id: 1, qty: 60, unit: 'g' }, // Onion
      { id: 22, qty: 3, unit: 'g' }, // Mustard Seeds
      { id: 24, qty: 2, unit: 'g' }, // Turmeric Powder
      { id: 27, qty: 10, unit: 'ml' }, // Cooking Oil
      { id: 17, qty: 5, unit: 'g' }, // Green Chilli
      { id: 4, qty: 8, unit: 'g' }, // Coriander
      { id: 50, qty: 0.5, unit: 'piece' }, // Lemon
    ],
    baseSteps: [
      { text: 'Place 90g thick poha in a colander and rinse gently under slow running water for 20 seconds; drain completely and let rest 5 minutes.', timer_seconds: 300 },
      { text: 'Finely chop 1 medium onion (60g) and slice 1 green chilli into thin rounds.' },
      { text: 'Heat 10ml cooking oil in a pan on medium induction heat (level 4 / 600W) for 45 seconds.', timer_seconds: 45 },
      { text: 'Add 1/2 tsp mustard seeds and sliced green chilli; sauté for 30 seconds until seeds begin to crackle.', timer_seconds: 30 },
      { text: 'Add the chopped onions and sauté for 2.5 minutes until translucent and soft.', timer_seconds: 150 },
      { text: 'Lower heat to minimum, add 1/2 tsp turmeric powder, 1/2 tsp salt, and the drained poha. Gently toss with a flat spatula for 2 minutes until evenly yellow.', timer_seconds: 120 },
      { text: 'Turn off heat, cover pan with lid for 1 minute to let residual steam plump the flakes, then squeeze 1/2 fresh lemon.', timer_seconds: 60 },
    ],
    toppings: [
      {
        suffix: 'with Roasted Peanuts',
        step: { text: 'In 1 tsp oil, fry 25g raw peanuts for 2 minutes until crunchy and golden brown; scatter over the warm poha.', timer_seconds: 120 },
        ingredients: [{ id: 21, qty: 25, unit: 'g' }],
      },
      {
        suffix: 'with Boiled Egg Slices',
        step: { text: 'Hard-boil 1 egg for 8 minutes, peel, slice into neat rounds, and arrange over the poha with black pepper.', timer_seconds: 480 },
        ingredients: [{ id: 6, qty: 1, unit: 'piece' }],
        extraMinutes: 4,
      },
      {
        suffix: 'with Fresh Dhaniya & Lemon',
        step: { text: 'Finely mince a generous 15g fresh coriander leaves and squeeze an extra half lemon for bright zesty punch.' },
        ingredients: [{ id: 4, qty: 15, unit: 'g' }, { id: 50, qty: 0.5, unit: 'piece' }],
      },
      {
        suffix: 'with Crispy Potato Cubes',
        step: { text: 'Peel and dice 80g potato into 5mm mini cubes; shallow fry in pan for 3.5 minutes until crispy before mixing with onions.', timer_seconds: 210 },
        ingredients: [{ id: 2, qty: 80, unit: 'g' }],
        extraMinutes: 3,
      },
      {
        suffix: 'with Grated Paneer',
        step: { text: 'Grate 50g fresh paneer evenly across the steaming poha; let it soften gently in the steam for 30 seconds.', timer_seconds: 30 },
        ingredients: [{ id: 7, qty: 50, unit: 'g' }],
      },
      {
        suffix: 'with Sautéed Sweet Corn',
        step: { text: 'Add 40g sweet corn kernels along with the onions and sauté for 2 minutes until plump and sweet.', timer_seconds: 120 },
        ingredients: [{ id: 43, qty: 40, unit: 'g' }],
      },
      {
        suffix: 'with Butter Tadka',
        step: { text: 'Melt 10g salted butter in a small ladle until foaming, then drizzle the golden butter sizzle over the plated poha.', timer_seconds: 45 },
        ingredients: [{ id: 16, qty: 10, unit: 'g' }],
      },
    ],
  },

  // 2. Moong Dal Khichdi (Indian)
  {
    name: 'Moong Dal Khichdi',
    cuisine: 'Indian',
    emoji: '🍲',
    minutes: 15,
    equipment: ['1-pan', 'kettle-only', 'hostel-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Skimping on water leaves hard, chalky lentils. Always maintain a generous 1:4 water ratio so the dal fully breaks down into creamy comfort porridge.',
    baseIngredients: [
      { id: 10, qty: 60, unit: 'g' }, // Rice
      { id: 11, qty: 60, unit: 'g' }, // Moong Dal
      { id: 23, qty: 4, unit: 'g' }, // Cumin Seeds
      { id: 24, qty: 2, unit: 'g' }, // Turmeric Powder
      { id: 28, qty: 10, unit: 'ml' }, // Ghee
      { id: 18, qty: 5, unit: 'g' }, // Ginger
    ],
    baseSteps: [
      { text: 'Measure 60g rice and 60g moong dal together; wash 3 times until water runs mostly clear, then drain.', timer_seconds: 60 },
      { text: 'In your kettle or deep pot, melt 10ml desi ghee on medium heat for 45 seconds.', timer_seconds: 45 },
      { text: 'Add 1 tsp cumin seeds and 1 tsp finely grated ginger; sauté for 30 seconds until warm and fragrant.', timer_seconds: 30 },
      { text: 'Tip in the drained rice-dal mix, 1/2 tsp turmeric powder, and 3/4 tsp salt. Stir gently for 1 minute to toast in ghee.', timer_seconds: 60 },
      { text: 'Pour in 500ml water. Cover with lid loosely and simmer on low for 12 minutes until grains are completely soft.', timer_seconds: 720 },
      { text: 'Beat lightly with the back of a ladle to achieve that classic creamy, soupy consistency.', timer_seconds: 30 },
    ],
    toppings: [
      {
        suffix: 'with Desi Ghee Jeera Tadka',
        step: { text: 'Heat an extra 10ml desi ghee with 1/2 tsp cumin seeds until dark golden, and pour the crackling tadka right on top.', timer_seconds: 45 },
        ingredients: [{ id: 28, qty: 10, unit: 'ml' }, { id: 23, qty: 3, unit: 'g' }],
      },
      {
        suffix: 'with Fresh Curd',
        step: { text: 'Ladle 80g cold, fresh creamy curd (dahi) on the side of the bowl for that soothing hot-and-cold contrast.' },
        ingredients: [{ id: 8, qty: 80, unit: 'g' }],
      },
      {
        suffix: 'with Sautéed Spinach',
        step: { text: 'Roughly chop 50g fresh spinach and 1 clove garlic; stir directly into the hot khichdi for 90 seconds until wilted.', timer_seconds: 90 },
        ingredients: [{ id: 48, qty: 50, unit: 'g' }, { id: 19, qty: 5, unit: 'g' }],
      },
      {
        suffix: 'with Crispy Fried Onions',
        step: { text: 'Thinly slice 40g onion and shallow fry in 1 tsp oil for 3 minutes until deep caramel brown; scatter over the bowl.', timer_seconds: 180 },
        ingredients: [{ id: 1, qty: 40, unit: 'g' }, { id: 27, qty: 5, unit: 'ml' }],
      },
      {
        suffix: 'with Aloo Fry',
        step: { text: 'Dice 70g potato into cubes, toss with 1/4 tsp red chilli powder and salt, pan-fry for 4 minutes until crisp-edged.', timer_seconds: 240 },
        ingredients: [{ id: 2, qty: 70, unit: 'g' }, { id: 25, qty: 2, unit: 'g' }],
        extraMinutes: 3,
      },
      {
        suffix: 'with Butter & Black Pepper',
        step: { text: 'Drop 10g cold salted butter in the center of the steaming bowl and crack coarse black pepper over it.' },
        ingredients: [{ id: 16, qty: 10, unit: 'g' }],
      },
      {
        suffix: 'with Soft Boiled Egg',
        step: { text: 'Boil 1 egg for 6.5 minutes for a jammy yolk, peel, halve, and nestle gently into the hot khichdi.', timer_seconds: 390 },
        ingredients: [{ id: 6, qty: 1, unit: 'piece' }],
        extraMinutes: 3,
      },
    ],
  },

  // 3. Egg Bhurji (Indian)
  {
    name: 'Egg Bhurji',
    cuisine: 'Indian',
    emoji: '🍳',
    minutes: 10,
    equipment: ['1-pan', 'hostel-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Blasting high heat while scrambling cooks out moisture and makes eggs tough and dry. Turn heat down and pull eggs off while still glossy and slightly wet.',
    baseIngredients: [
      { id: 6, qty: 2, unit: 'piece' }, // Egg
      { id: 1, qty: 50, unit: 'g' }, // Onion
      { id: 3, qty: 50, unit: 'g' }, // Tomato
      { id: 17, qty: 5, unit: 'g' }, // Green Chilli
      { id: 16, qty: 10, unit: 'g' }, // Butter
      { id: 24, qty: 2, unit: 'g' }, // Turmeric Powder
      { id: 26, qty: 2, unit: 'g' }, // Garam Masala
      { id: 4, qty: 8, unit: 'g' }, // Coriander
    ],
    baseSteps: [
      { text: 'Finely dice 1 small onion (50g), 1 small tomato (50g), and 1 green chilli.' },
      { text: 'Crack 2 fresh eggs into a small bowl, add 1/3 tsp salt, and whisk briskly with a fork for 30 seconds.', timer_seconds: 30 },
      { text: 'Melt 10g butter in a frying pan over medium heat (600W) until sizzling.', timer_seconds: 40 },
      { text: 'Add diced onions and green chilli; sauté for 2 minutes until translucent.', timer_seconds: 120 },
      { text: 'Add chopped tomatoes, 1/4 tsp turmeric, and 1/4 tsp garam masala; cook for 2 minutes, mashing tomatoes with spatula.', timer_seconds: 120 },
      { text: 'Reduce heat to low, pour in whisked eggs, and scramble gently with circular motions for 90 seconds until soft curds form.', timer_seconds: 90 },
      { text: 'Remove from heat while eggs are still tender and glossy; stir in chopped fresh coriander.', timer_seconds: 15 },
    ],
    toppings: [
      {
        suffix: 'with Toasted Butter Pav',
        step: { text: 'Slit 2 pav buns horizontally, butter the pan, and toast both sides for 60 seconds until crusty and golden.', timer_seconds: 60 },
        ingredients: [{ id: 9, qty: 2, unit: 'piece' }, { id: 16, qty: 10, unit: 'g' }],
      },
      {
        suffix: 'with Melting Cheese Slice',
        step: { text: 'Lay 1 slice of processed cheese directly over the warm scrambled eggs; cover pan for 30 seconds until gooey.', timer_seconds: 30 },
        ingredients: [{ id: 30, qty: 1, unit: 'piece' }],
      },
      {
        suffix: 'with Sautéed Capsicum & Onions',
        step: { text: 'Dice 35g capsicum and sauté with onions on high heat for 90 seconds for smoky crunch.', timer_seconds: 90 },
        ingredients: [{ id: 49, qty: 35, unit: 'g' }],
      },
      {
        suffix: 'with Extra Dhaniya & Lemon',
        step: { text: 'Scatter 10g fresh chopped coriander leaves and squeeze 1/2 fresh lemon across the steaming scramble.' },
        ingredients: [{ id: 4, qty: 10, unit: 'g' }, { id: 50, qty: 0.5, unit: 'piece' }],
      },
      {
        suffix: 'with Crispy Fried Garlic',
        step: { text: 'Thinly slice 2 cloves garlic and fry in 1 tsp oil for 45 seconds until golden chips form; sprinkle on top.', timer_seconds: 45 },
        ingredients: [{ id: 19, qty: 8, unit: 'g' }, { id: 27, qty: 5, unit: 'ml' }],
      },
      {
        suffix: 'with Roasted Cumin Butter',
        step: { text: 'Warm 10g butter with 1/2 tsp cumin seeds in a small spoon until fragrant, then swirl across the eggs.', timer_seconds: 40 },
        ingredients: [{ id: 16, qty: 10, unit: 'g' }, { id: 23, qty: 2, unit: 'g' }],
      },
      {
        suffix: 'with Sautéed Mushrooms',
        step: { text: 'Slice 60g button mushrooms and sauté in butter for 2.5 minutes until browned before adding the eggs.', timer_seconds: 150 },
        ingredients: [{ id: 32, qty: 60, unit: 'g' }],
      },
    ],
  },

  // 4. Soya Keema Bhurji (Indian)
  {
    name: 'Soya Keema Bhurji',
    cuisine: 'Indian',
    emoji: '🥘',
    minutes: 15,
    equipment: ['1-pan', 'kettle-only', 'hostel-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Not squeezing the soaked soya chunks leaves a soggy, raw flavor. Press firmly in a clean cloth or fist until completely dry before chopping.',
    baseIngredients: [
      { id: 20, qty: 55, unit: 'g' }, // Soya Chunks
      { id: 1, qty: 60, unit: 'g' }, // Onion
      { id: 3, qty: 60, unit: 'g' }, // Tomato
      { id: 19, qty: 6, unit: 'g' }, // Garlic
      { id: 18, qty: 6, unit: 'g' }, // Ginger
      { id: 25, qty: 3, unit: 'g' }, // Red Chilli Powder
      { id: 26, qty: 3, unit: 'g' }, // Garam Masala
      { id: 27, qty: 10, unit: 'ml' }, // Cooking Oil
    ],
    baseSteps: [
      { text: 'Place 55g soya chunks in a bowl, pour 300ml boiling water, and soak for 7 minutes until spongy.', timer_seconds: 420 },
      { text: 'Drain soya in a strainer, rinse with cold water, squeeze out all excess moisture firmly, and finely chop to coarse mince.' },
      { text: 'Heat 10ml cooking oil in a pan on medium heat. Add 1 tsp minced ginger and 1 tsp minced garlic; sauté 30 seconds.', timer_seconds: 30 },
      { text: 'Add 1 finely chopped onion; cook for 3 minutes until light golden brown.', timer_seconds: 180 },
      { text: 'Add 1 chopped tomato, 1/2 tsp red chilli powder, 1/2 tsp garam masala, and 1/2 tsp salt; cook 2 minutes until saucy.', timer_seconds: 120 },
      { text: 'Toss in the minced soya with 3 tbsp water. Cover and simmer on low heat for 4 minutes so soya absorbs the spices.', timer_seconds: 240 },
    ],
    toppings: [
      {
        suffix: 'with Toasted Pav',
        step: { text: 'Butter and toast 2 soft pav buns on a hot tawa for 60 seconds until crusty and golden.', timer_seconds: 60 },
        ingredients: [{ id: 9, qty: 2, unit: 'piece' }, { id: 16, qty: 8, unit: 'g' }],
      },
      {
        suffix: 'with Fresh Curd & Mint',
        step: { text: 'Serve alongside 60g chilled thick curd whisked with a pinch of salt and crushed mint leaves.' },
        ingredients: [{ id: 8, qty: 60, unit: 'g' }],
      },
      {
        suffix: 'with Sautéed Capsicum',
        step: { text: 'Dice 40g green bell pepper and toss into the pan for the final 2 minutes for crunch and aroma.', timer_seconds: 120 },
        ingredients: [{ id: 49, qty: 40, unit: 'g' }],
      },
      {
        suffix: 'with Boiled Egg Crumbles',
        step: { text: 'Hard-boil 1 egg (8 minutes), chop into small crumbles, and toss through the hot soya keema.', timer_seconds: 480 },
        ingredients: [{ id: 6, qty: 1, unit: 'piece' }],
        extraMinutes: 3,
      },
      {
        suffix: 'with Squeeze of Fresh Lemon',
        step: { text: 'Finish with finely chopped coriander leaves and a bright squeeze of fresh lemon juice.' },
        ingredients: [{ id: 50, qty: 0.5, unit: 'piece' }, { id: 4, qty: 8, unit: 'g' }],
      },
      {
        suffix: 'with Melting Processed Cheese',
        step: { text: 'Place 1 processed cheese slice over the steaming keema, cover pan for 45 seconds until molten.', timer_seconds: 45 },
        ingredients: [{ id: 30, qty: 1, unit: 'piece' }],
      },
      {
        suffix: 'with Crispy Fried Onions',
        step: { text: 'Scatter 2 tbsp crispy golden fried onions over the warm plate for caramelized sweetness.', timer_seconds: 60 },
        ingredients: [{ id: 1, qty: 30, unit: 'g' }, { id: 27, qty: 5, unit: 'ml' }],
      },
    ],
  },

  // 5. Masala Oats (Indian)
  {
    name: 'Masala Oats',
    cuisine: 'Indian',
    emoji: '🥣',
    minutes: 10,
    equipment: ['1-pan', 'kettle-only', 'hostel-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Walking away while oats cook on high heat. Rolled oats stick and burn at the bottom of the pan rapidly; stir frequently over medium-low heat.',
    baseIngredients: [
      { id: 13, qty: 50, unit: 'g' }, // Rolled Oats
      { id: 1, qty: 40, unit: 'g' }, // Onion
      { id: 3, qty: 40, unit: 'g' }, // Tomato
      { id: 17, qty: 4, unit: 'g' }, // Green Chilli
      { id: 24, qty: 2, unit: 'g' }, // Turmeric Powder
      { id: 26, qty: 2, unit: 'g' }, // Garam Masala
      { id: 27, qty: 8, unit: 'ml' }, // Cooking Oil
    ],
    baseSteps: [
      { text: 'Finely dice 1/2 small onion (40g), 1/2 small tomato (40g), and 1/2 green chilli.' },
      { text: 'Heat 8ml cooking oil in a small pan or electric kettle on medium heat for 30 seconds.', timer_seconds: 30 },
      { text: 'Add diced onion and green chilli; sauté for 90 seconds until translucent.', timer_seconds: 90 },
      { text: 'Add diced tomato, 1/4 tsp turmeric, 1/4 tsp garam masala, and 1/3 tsp salt; cook 1 minute until soft.', timer_seconds: 60 },
      { text: 'Add 50g rolled oats and pour in 250ml water; stir well to combine.', timer_seconds: 30 },
      { text: 'Simmer on low heat for 3 minutes, stirring continuously until oats turn into a thick savory porridge.', timer_seconds: 180 },
      { text: 'Turn off heat and let rest covered for 1 minute to finish swelling.', timer_seconds: 60 },
    ],
    toppings: [
      {
        suffix: 'with Boiled Egg',
        step: { text: 'Boil 1 egg in your kettle for 7 minutes, peel, slice in half, and place on the oats with black pepper.', timer_seconds: 420 },
        ingredients: [{ id: 6, qty: 1, unit: 'piece' }],
        extraMinutes: 3,
      },
      {
        suffix: 'with Paneer Cubes',
        step: { text: 'Dice 50g fresh paneer into cubes, pan-sear for 2 minutes until golden, and tumble onto the oats.', timer_seconds: 120 },
        ingredients: [{ id: 7, qty: 50, unit: 'g' }],
      },
      {
        suffix: 'with Sautéed Sweet Corn',
        step: { text: 'Simmer 40g sweet corn kernels in the oats during the last 2 minutes for juicy sweet pops.', timer_seconds: 120 },
        ingredients: [{ id: 43, qty: 40, unit: 'g' }],
      },
      {
        suffix: 'with Toasted Peanuts',
        step: { text: 'Dry roast 20g raw peanuts in a pan for 90 seconds until crisp, then scatter over the bowl.', timer_seconds: 90 },
        ingredients: [{ id: 21, qty: 20, unit: 'g' }],
      },
      {
        suffix: 'with Baby Spinach',
        step: { text: 'Wash 40g tender spinach leaves and fold directly into the hot oats for 45 seconds until wilted.', timer_seconds: 45 },
        ingredients: [{ id: 48, qty: 40, unit: 'g' }],
      },
      {
        suffix: 'with Spoon of Ghee',
        step: { text: 'Swirl 1 tsp warm desi ghee over the hot oats right at the table for rich homestyle warmth.' },
        ingredients: [{ id: 28, qty: 6, unit: 'ml' }],
      },
      {
        suffix: 'with Sautéed Mushrooms',
        step: { text: 'Slice 50g button mushrooms and sauté in 1 tsp oil for 2 minutes before spooning on the oats.', timer_seconds: 120 },
        ingredients: [{ id: 32, qty: 50, unit: 'g' }],
      },
    ],
  },

  // 6. Homestyle Curry (Indian)
  {
    name: 'Homestyle Curry',
    cuisine: 'Indian',
    emoji: '🥘',
    minutes: 18,
    equipment: ['1-pan', 'induction'],
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Rushing the bhunai (sautéing of onions and tomatoes). If the paste does not cook until oil separates, the gravy will taste raw and unpleasantly tart.',
    baseIngredients: [
      { id: 1, qty: 80, unit: 'g' }, // Onion
      { id: 3, qty: 90, unit: 'g' }, // Tomato
      { id: 18, qty: 6, unit: 'g' }, // Ginger
      { id: 19, qty: 6, unit: 'g' }, // Garlic
      { id: 24, qty: 2, unit: 'g' }, // Turmeric Powder
      { id: 25, qty: 3, unit: 'g' }, // Red Chilli Powder
      { id: 26, qty: 3, unit: 'g' }, // Garam Masala
      { id: 27, qty: 12, unit: 'ml' }, // Cooking Oil
      { id: 4, qty: 8, unit: 'g' }, // Coriander
    ],
    baseSteps: [
      { text: 'Finely chop 1 medium onion (80g), 2 small tomatoes (90g), and mince 2 cloves garlic and 1 slice ginger.' },
      { text: 'Heat 12ml cooking oil in a pan on medium induction heat (800W) for 45 seconds.', timer_seconds: 45 },
      { text: 'Add minced ginger and garlic; cook for 30 seconds until fragrant.', timer_seconds: 30 },
      { text: 'Add chopped onions and sauté for 3.5 minutes until deep golden brown.', timer_seconds: 210 },
      { text: 'Add chopped tomatoes, 1/2 tsp turmeric, 1/2 tsp red chilli, 1/2 tsp garam masala, and 3/4 tsp salt. Cook for 3 minutes until oil glazes the edges.', timer_seconds: 180 },
      { text: 'Pour in 180ml hot water, stir well, bring to a gentle boil, and simmer on low for 4 minutes to create a rich gravy.', timer_seconds: 240 },
    ],
    toppings: [
      {
        suffix: 'with Paneer & Peas',
        step: { text: 'Slide 90g paneer cubes and 30g green peas into the simmering gravy for 3 minutes to turn luscious.', timer_seconds: 180 },
        ingredients: [{ id: 7, qty: 90, unit: 'g' }, { id: 43, qty: 30, unit: 'g' }],
      },
      {
        suffix: 'with Tender Chicken Breast',
        step: { text: 'Dice 130g chicken breast into cubes; sear in the onion masala for 5 minutes until tender and cooked through.', timer_seconds: 300 },
        ingredients: [{ id: 14, qty: 130, unit: 'g' }],
        extraMinutes: 4,
      },
      {
        suffix: 'with Boiled Eggs & Aloo',
        step: { text: 'Add 2 halved boiled eggs and 1 diced boiled potato into the gravy for 3 minutes to absorb flavors.', timer_seconds: 180 },
        ingredients: [{ id: 6, qty: 2, unit: 'piece' }, { id: 2, qty: 70, unit: 'g' }],
        extraMinutes: 2,
      },
      {
        suffix: 'with Soya Chunks & Potato',
        step: { text: 'Simmer 40g soaked soya chunks and 1 diced potato in the gravy for 4 minutes on low heat.', timer_seconds: 240 },
        ingredients: [{ id: 20, qty: 40, unit: 'g' }, { id: 2, qty: 60, unit: 'g' }],
      },
      {
        suffix: 'with Button Mushrooms',
        step: { text: 'Halve 80g button mushrooms and simmer in the curry for 3.5 minutes until juicy and flavorful.', timer_seconds: 210 },
        ingredients: [{ id: 32, qty: 80, unit: 'g' }],
      },
      {
        suffix: 'with Steamed Basmati Rice',
        step: { text: 'Serve curry over a bowl of 120g warm, fluffy steamed basmati rice with fresh coriander.', timer_seconds: 60 },
        ingredients: [{ id: 10, qty: 70, unit: 'g' }],
      },
      {
        suffix: 'with Desi Ghee & Kasuri Methi',
        step: { text: 'Swirl 10ml desi ghee over the finished curry and garnish with crushed dry fenugreek or coriander.', timer_seconds: 30 },
        ingredients: [{ id: 28, qty: 10, unit: 'ml' }],
      },
    ],
  },

  // 7. Paneer Tikka Bowl (Indian)
  {
    name: 'Paneer Tikka Bowl',
    cuisine: 'Indian',
    emoji: '🥗',
    minutes: 18,
    equipment: ['1-pan', 'induction'],
    imageUrl: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Sautéing paneer over low heat for too long squeezes out moisture and turns it leathery. Sear on high heat for charred spots while keeping the core soft.',
    baseIngredients: [
      { id: 7, qty: 110, unit: 'g' }, // Paneer
      { id: 8, qty: 45, unit: 'g' }, // Curd
      { id: 25, qty: 3, unit: 'g' }, // Red Chilli Powder
      { id: 26, qty: 2, unit: 'g' }, // Garam Masala
      { id: 24, qty: 2, unit: 'g' }, // Turmeric Powder
      { id: 1, qty: 40, unit: 'g' }, // Onion
      { id: 49, qty: 40, unit: 'g' }, // Capsicum
      { id: 27, qty: 10, unit: 'ml' }, // Cooking Oil
      { id: 50, qty: 0.5, unit: 'piece' }, // Lemon
    ],
    baseSteps: [
      { text: 'Cut 110g paneer into bite-sized 2cm cubes, cut 1/2 onion and 1/2 capsicum into square petals.' },
      { text: 'In a bowl, mix 45g thick curd, 1/2 tsp red chilli, 1/2 tsp turmeric, 1/2 tsp garam masala, and 1/2 tsp salt.', timer_seconds: 45 },
      { text: 'Toss paneer, onion petals, and capsicum in the spiced yogurt marinade; let sit for 6 minutes.', timer_seconds: 360 },
      { text: 'Heat 10ml oil in a wide frying pan on medium-high heat (1000W) until shimmering.', timer_seconds: 45 },
      { text: 'Add the marinated paneer and veggies in a single layer. Sear untouched for 2 minutes until deeply charred underneath.', timer_seconds: 120 },
      { text: 'Flip gently and sear the other side for 1.5 minutes; remove to a serving bowl and squeeze 1/2 lemon.', timer_seconds: 90 },
    ],
    toppings: [
      {
        suffix: 'with Seasoned Quinoa',
        step: { text: 'Boil 50g quinoa in 100ml salted water for 12 minutes, fluff, and use as high-protein bowl base.', timer_seconds: 720 },
        ingredients: [{ id: 38, qty: 50, unit: 'g' }],
        extraMinutes: 4,
      },
      {
        suffix: 'with Steamed Basmati Rice',
        step: { text: 'Ladle 120g warm steamed basmati rice into the bowl beside the charred tikka.', timer_seconds: 30 },
        ingredients: [{ id: 10, qty: 65, unit: 'g' }],
      },
      {
        suffix: 'with Mint Curd Raita',
        step: { text: 'Whisk 60g cold dahi with a pinch of cumin and chopped coriander to drizzle as a cooling sauce.', timer_seconds: 45 },
        ingredients: [{ id: 8, qty: 60, unit: 'g' }, { id: 4, qty: 6, unit: 'g' }],
      },
      {
        suffix: 'with Sliced Onion Laccha',
        step: { text: 'Slice 1/2 onion into fine rings, toss with lemon juice and a pinch of chilli, and pile on the side.', timer_seconds: 60 },
        ingredients: [{ id: 1, qty: 45, unit: 'g' }, { id: 50, qty: 0.5, unit: 'piece' }],
      },
      {
        suffix: 'with Charred Capsicum & Corn',
        step: { text: 'Sear 40g sweet corn kernels alongside extra capsicum until blistered and sweet; toss in bowl.', timer_seconds: 120 },
        ingredients: [{ id: 43, qty: 40, unit: 'g' }],
      },
      {
        suffix: 'with Toasted Pav',
        step: { text: 'Toast 2 buttered pav buns on the paneer pan to absorb all the spicy charred pan juices.', timer_seconds: 60 },
        ingredients: [{ id: 9, qty: 2, unit: 'piece' }, { id: 16, qty: 8, unit: 'g' }],
      },
      {
        suffix: 'with Roasted Cumin Butter',
        step: { text: 'Melt 10g butter with 1/2 tsp roasted cumin powder and brush over the hot paneer cubes.', timer_seconds: 40 },
        ingredients: [{ id: 16, qty: 10, unit: 'g' }, { id: 23, qty: 2, unit: 'g' }],
      },
    ],
  },

  // 8. Biryani Bowl (Indian)
  {
    name: 'Biryani Bowl',
    cuisine: 'Indian',
    emoji: '🍛',
    minutes: 20,
    equipment: ['1-pan', 'induction'],
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: High heat during dum cooking scorches the bottom layer. Always lower induction power to minimum (200W) and keep the lid sealed so steam gently infuses the rice.',
    baseIngredients: [
      { id: 10, qty: 75, unit: 'g' }, // Rice
      { id: 1, qty: 70, unit: 'g' }, // Onion
      { id: 3, qty: 60, unit: 'g' }, // Tomato
      { id: 18, qty: 5, unit: 'g' }, // Ginger
      { id: 19, qty: 5, unit: 'g' }, // Garlic
      { id: 26, qty: 3, unit: 'g' }, // Garam Masala
      { id: 24, qty: 2, unit: 'g' }, // Turmeric Powder
      { id: 28, qty: 12, unit: 'ml' }, // Ghee
      { id: 4, qty: 8, unit: 'g' }, // Coriander
    ],
    baseSteps: [
      { text: 'Rinse 75g basmati rice twice; boil in 500ml salted water for 6.5 minutes until 80% cooked, then drain well.', timer_seconds: 390 },
      { text: 'Thinly slice 1 medium onion (70g) and mince ginger and garlic.' },
      { text: 'Melt 12ml desi ghee in a heavy pan on medium heat. Sauté sliced onions for 4 minutes until deeply caramelized.', timer_seconds: 240 },
      { text: 'Add ginger, garlic, 1 chopped tomato, 1/2 tsp turmeric, 1 tsp biryani masala, and 1/2 tsp salt; cook 2.5 minutes until oil surfaces.', timer_seconds: 150 },
      { text: 'Lower heat to minimum. Spread the drained basmati rice evenly over the masala layer; sprinkle 2 tbsp water.', timer_seconds: 40 },
      { text: 'Seal tightly with lid and steam on low (200W) for 6 minutes until rice grains are fluffy and elongated.', timer_seconds: 360 },
      { text: 'Gently fluff from the edges with a flat spatula and garnish with chopped coriander.', timer_seconds: 30 },
    ],
    toppings: [
      {
        suffix: 'with Crispy Fried Onions (Birista)',
        step: { text: 'Fry 40g thinly sliced onion in 1 tbsp hot oil for 3 minutes until dark golden and crispy; scatter over rice.', timer_seconds: 180 },
        ingredients: [{ id: 1, qty: 40, unit: 'g' }, { id: 27, qty: 10, unit: 'ml' }],
      },
      {
        suffix: 'with Spiced Boiled Egg',
        step: { text: 'Boil 1 egg (7.5 mins), peel, toss in 1/2 tsp ghee with turmeric and chilli for 60s, and place in bowl.', timer_seconds: 450 },
        ingredients: [{ id: 6, qty: 1, unit: 'piece' }, { id: 25, qty: 2, unit: 'g' }],
      },
      {
        suffix: 'with Marinated Chicken Breast',
        step: { text: 'Marinate 120g diced chicken in spices, sear in the base masala for 4 minutes before layering rice.', timer_seconds: 240 },
        ingredients: [{ id: 14, qty: 120, unit: 'g' }],
        extraMinutes: 3,
      },
      {
        suffix: 'with Golden Paneer Cubes',
        step: { text: 'Pan-sear 70g paneer cubes in ghee for 2 minutes until golden, then fold into the steaming biryani.', timer_seconds: 120 },
        ingredients: [{ id: 7, qty: 70, unit: 'g' }],
      },
      {
        suffix: 'with Chilled Dahi Raita',
        step: { text: 'Whisk 70g thick dahi with a pinch of roasted cumin and salt; serve in a bowl alongside the hot biryani.', timer_seconds: 45 },
        ingredients: [{ id: 8, qty: 70, unit: 'g' }, { id: 23, qty: 2, unit: 'g' }],
      },
      {
        suffix: 'with Soya Keema',
        step: { text: 'Soak 35g soya chunks, squeeze dry, mince, and cook in the masala base before layering rice.', timer_seconds: 240 },
        ingredients: [{ id: 20, qty: 35, unit: 'g' }],
      },
      {
        suffix: 'with Roasted Cashews & Ghee',
        step: { text: 'Fry 20g peanuts or cashews in 1 tsp desi ghee until fragrant and golden; scatter over top.', timer_seconds: 90 },
        ingredients: [{ id: 21, qty: 20, unit: 'g' }, { id: 28, qty: 6, unit: 'ml' }],
      },
    ],
  },

  // 9. Pasta Aglio e Olio (Italian)
  {
    name: 'Pasta Aglio e Olio',
    cuisine: 'Italian',
    emoji: '🍝',
    minutes: 12,
    equipment: ['1-pan', 'induction'],
    imageUrl: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Burning the garlic. Minced or sliced garlic burns within seconds if heat is high, leaving a bitter taste. Sauté very gently on low heat until pale blonde.',
    baseIngredients: [
      { id: 31, qty: 85, unit: 'g' }, // Fettuccine
      { id: 19, qty: 12, unit: 'g' }, // Garlic
      { id: 27, qty: 20, unit: 'ml' }, // Cooking Oil
      { id: 25, qty: 2, unit: 'g' }, // Chilli flakes (red chilli powder)
      { id: 4, qty: 8, unit: 'g' }, // Coriander/parsley
    ],
    baseSteps: [
      { text: 'Bring 1 liter water to a rolling boil with 1 tsp salt in a pot or pan.', timer_seconds: 240 },
      { text: 'Drop 85g fettuccine pasta into boiling water; cook for 8 minutes until al dente.', timer_seconds: 480 },
      { text: 'Scoop out and reserve 60ml (1/4 cup) starchy pasta water, then drain pasta.', timer_seconds: 30 },
      { text: 'In the same pan, heat 20ml oil on lowest heat (200W). Add 4 thinly sliced cloves of garlic and chilli flakes.', timer_seconds: 45 },
      { text: 'Gently sizzle garlic for 2 minutes until light blonde — do not let it turn brown.', timer_seconds: 120 },
      { text: 'Toss in drained pasta and 3 tbsp reserved pasta water; toss vigorously for 1 minute until a glossy emulsified sauce forms.', timer_seconds: 60 },
      { text: 'Stir in chopped fresh coriander or parsley and season with a pinch of salt.', timer_seconds: 20 },
    ],
    toppings: [
      {
        suffix: 'with Sautéed Button Mushrooms',
        step: { text: 'Slice 70g button mushrooms, sauté in 1 tsp oil for 2.5 minutes until browned and juicy, and fold into pasta.', timer_seconds: 150 },
        ingredients: [{ id: 32, qty: 70, unit: 'g' }],
      },
      {
        suffix: 'with Grated Cheese Slice',
        step: { text: 'Tear 1 cheese slice into ribbons and toss with steaming pasta off the heat until melted and velvety.', timer_seconds: 30 },
        ingredients: [{ id: 30, qty: 1, unit: 'piece' }],
      },
      {
        suffix: 'with Golden Sliced Garlic Chips',
        step: { text: 'Fry 3 extra sliced garlic cloves in oil until crispy golden chips; drain on spoon and scatter on top.', timer_seconds: 60 },
        ingredients: [{ id: 19, qty: 10, unit: 'g' }],
      },
      {
        suffix: 'with Sautéed Baby Spinach',
        step: { text: 'Toss 45g fresh spinach leaves into the hot pasta for 45 seconds until bright green and wilted.', timer_seconds: 45 },
        ingredients: [{ id: 48, qty: 45, unit: 'g' }],
      },
      {
        suffix: 'with Seared Chicken Breast Strips',
        step: { text: 'Season 110g chicken breast strips, sear in pan for 4 minutes until juicy, and lay over pasta.', timer_seconds: 240 },
        ingredients: [{ id: 14, qty: 110, unit: 'g' }],
        extraMinutes: 3,
      },
      {
        suffix: 'with Sweet Corn & Chilli',
        step: { text: 'Toss 40g sweet corn kernels into the garlic oil for 1 minute before tossing with pasta.', timer_seconds: 60 },
        ingredients: [{ id: 43, qty: 40, unit: 'g' }],
      },
      {
        suffix: 'with Butter Glaze',
        step: { text: 'Melt 12g cold salted butter during the final toss for a rich restaurant-style pasta glaze.', timer_seconds: 30 },
        ingredients: [{ id: 16, qty: 12, unit: 'g' }],
      },
    ],
  },

  // 10. Tomato Basil Penne (Italian)
  {
    name: 'Tomato Basil Penne',
    cuisine: 'Italian',
    emoji: '🍝',
    minutes: 15,
    equipment: ['1-pan', 'induction'],
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Under-cooking tomatoes produces a watery, acidic sauce. Sauté tomatoes until broken down into a jammy consistency, then loosen with starchy pasta water.',
    baseIngredients: [
      { id: 31, qty: 85, unit: 'g' }, // Fettuccine/Penne
      { id: 3, qty: 120, unit: 'g' }, // Tomato
      { id: 19, qty: 8, unit: 'g' }, // Garlic
      { id: 1, qty: 35, unit: 'g' }, // Onion
      { id: 27, qty: 12, unit: 'ml' }, // Cooking Oil
    ],
    baseSteps: [
      { text: 'Boil 85g pasta in 1 liter salted boiling water for 8 minutes until al dente; reserve 60ml pasta water and drain.', timer_seconds: 480 },
      { text: 'Finely chop 2 ripe tomatoes (120g), 1/2 small onion (35g), and mince 2 cloves garlic.' },
      { text: 'Heat 12ml cooking oil in a pan on medium heat. Sauté garlic and onions for 2 minutes until soft.', timer_seconds: 120 },
      { text: 'Add chopped tomatoes, 1/2 tsp salt, and a pinch of sugar; cook for 4 minutes, crushing tomatoes until a rich sauce forms.', timer_seconds: 240 },
      { text: 'Pour in 3 tbsp reserved pasta water and simmer for 1 minute until glossy.', timer_seconds: 60 },
      { text: 'Toss drained pasta into the sauce for 90 seconds until thoroughly coated.', timer_seconds: 90 },
    ],
    toppings: [
      {
        suffix: 'with Melting Mozzarella & Cheddar',
        step: { text: 'Tear 1 cheese slice into ribbons, fold into pasta, and cover for 45 seconds until stringy and melted.', timer_seconds: 45 },
        ingredients: [{ id: 30, qty: 1, unit: 'piece' }],
      },
      {
        suffix: 'with Sautéed Mushrooms',
        step: { text: 'Sear 70g sliced button mushrooms in 1 tsp butter for 3 minutes, then toss into the red sauce.', timer_seconds: 180 },
        ingredients: [{ id: 32, qty: 70, unit: 'g' }, { id: 16, qty: 6, unit: 'g' }],
      },
      {
        suffix: 'with Herbed Chicken Breast',
        step: { text: 'Pan-sear 110g seasoned chicken breast chunks for 4 minutes, then fold into the pasta sauce.', timer_seconds: 240 },
        ingredients: [{ id: 14, qty: 110, unit: 'g' }],
        extraMinutes: 3,
      },
      {
        suffix: 'with Sautéed Capsicum & Corn',
        step: { text: 'Dice 35g capsicum and 35g sweet corn, sauté 2 minutes until tender-crisp, and fold into sauce.', timer_seconds: 120 },
        ingredients: [{ id: 49, qty: 35, unit: 'g' }, { id: 43, qty: 35, unit: 'g' }],
      },
      {
        suffix: 'with Crispy Garlic Crumbs',
        step: { text: 'Toast 25g breadcrumbs with minced garlic in butter for 2 minutes until crunchy; sprinkle on top.', timer_seconds: 120 },
        ingredients: [{ id: 9, qty: 1, unit: 'piece' }, { id: 16, qty: 6, unit: 'g' }],
      },
      {
        suffix: 'with Baby Spinach Toss',
        step: { text: 'Fold 50g fresh baby spinach directly into the hot pasta sauce for 60 seconds until gently wilted.', timer_seconds: 60 },
        ingredients: [{ id: 48, qty: 50, unit: 'g' }],
      },
      {
        suffix: 'with Golden Paneer Cubes',
        step: { text: 'Sear 60g paneer cubes for 2 minutes in oil until golden, then toss into the rich tomato sauce.', timer_seconds: 120 },
        ingredients: [{ id: 7, qty: 60, unit: 'g' }],
      },
    ],
  },

  // 11. Truffle Fettuccine (Italian)
  {
    name: 'Truffle Fettuccine',
    cuisine: 'Italian',
    emoji: '🍝',
    minutes: 15,
    equipment: ['1-pan', 'induction'],
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Sautéing truffle oil in high heat destroys its delicate, earthy aroma instantly. Always pull the pan completely off the heat before swirling the oil in.',
    baseIngredients: [
      { id: 31, qty: 90, unit: 'g' }, // Fettuccine
      { id: 32, qty: 90, unit: 'g' }, // Mushroom
      { id: 33, qty: 6, unit: 'ml' }, // Truffle Oil
      { id: 16, qty: 15, unit: 'g' }, // Butter
      { id: 19, qty: 8, unit: 'g' }, // Garlic
    ],
    baseSteps: [
      { text: 'Boil 90g fettuccine pasta in 1 liter well-salted water for 8 minutes until al dente; reserve 60ml pasta water, drain.', timer_seconds: 480 },
      { text: 'Clean 90g button mushrooms with a cloth and slice thinly; mince 2 cloves garlic.' },
      { text: 'Melt 15g butter in a wide skillet on medium heat (600W). Add garlic; cook 30 seconds until fragrant.', timer_seconds: 30 },
      { text: 'Add sliced mushrooms and a pinch of salt; sauté undisturbed for 3 minutes until caramelized and golden.', timer_seconds: 180 },
      { text: 'Pour in 3 tbsp reserved pasta water, swirling with mushroom juices to form a rich emulsion.', timer_seconds: 45 },
      { text: 'Add drained fettuccine, remove pan from heat completely, drizzle 6ml truffle oil, and toss with black pepper.', timer_seconds: 60 },
    ],
    toppings: [
      {
        suffix: 'with Artisan Truffle Drizzle',
        step: { text: 'Drizzle an extra 4ml artisan truffle oil and cracked black pepper over the plated pasta for intense aroma.' },
        ingredients: [{ id: 33, qty: 4, unit: 'ml' }],
      },
      {
        suffix: 'with Melted Aged Cheddar',
        step: { text: 'Melt 1 processed cheese slice or shredded cheddar into the warm pasta off-heat for creamy richness.', timer_seconds: 30 },
        ingredients: [{ id: 30, qty: 1, unit: 'piece' }],
      },
      {
        suffix: 'with Sautéed Garlic Mushrooms',
        step: { text: 'Top with an extra batch of 50g golden butter-garlic sautéed mushrooms for deep savory umami.', timer_seconds: 120 },
        ingredients: [{ id: 32, qty: 50, unit: 'g' }, { id: 16, qty: 6, unit: 'g' }],
      },
      {
        suffix: 'with Seared Chicken Breast',
        step: { text: 'Sear 110g chicken breast medallions for 4 minutes in butter, then fan over the pasta.', timer_seconds: 240 },
        ingredients: [{ id: 14, qty: 110, unit: 'g' }],
        extraMinutes: 3,
      },
      {
        suffix: 'with Wilted Baby Spinach',
        step: { text: 'Fold 40g fresh baby spinach into the pasta off the heat until gently softened by residual warmth.', timer_seconds: 45 },
        ingredients: [{ id: 48, qty: 40, unit: 'g' }],
      },
      {
        suffix: 'with Crushed Black Pepper & Sourdough Croutons',
        step: { text: 'Toast 35g sourdough cubes in butter for 2 minutes until shatteringly crisp; scatter on top.', timer_seconds: 120 },
        ingredients: [{ id: 37, qty: 0.5, unit: 'piece' }],
      },
      {
        suffix: 'with Poached Egg',
        step: { text: 'Poach 1 egg in simmering water for 3 minutes, place atop fettuccine, and pierce to release golden yolk.', timer_seconds: 180 },
        ingredients: [{ id: 6, qty: 1, unit: 'piece' }],
        extraMinutes: 3,
      },
    ],
  },

  // 12. Ramen Quick Pot (Pan-Asian)
  {
    name: 'Ramen Quick Pot',
    cuisine: 'Pan-Asian',
    emoji: '🍜',
    minutes: 8,
    equipment: ['1-pan', 'kettle-only', 'hostel-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Boiling noodles longer than 3 minutes leaves a limp, soggy texture. Cook noodles for 2.5 minutes max so strands stay springy and firm in hot broth.',
    baseIngredients: [
      { id: 47, qty: 1, unit: 'piece' }, // Maggi/Noodles cake
      { id: 40, qty: 12, unit: 'ml' }, // Soy Sauce
      { id: 19, qty: 5, unit: 'g' }, // Garlic
      { id: 18, qty: 5, unit: 'g' }, // Ginger
      { id: 17, qty: 4, unit: 'g' }, // Green Chilli
    ],
    baseSteps: [
      { text: 'Pour 350ml water into an electric kettle or small pot and bring to a rolling boil.', timer_seconds: 90 },
      { text: 'Add 1/2 tsp grated ginger, 1 minced garlic clove, and sliced green chilli to the bubbling broth.', timer_seconds: 30 },
      { text: 'Stir in 12ml soy sauce and half the instant tastemaker noodle seasoning.', timer_seconds: 30 },
      { text: 'Drop in 1 noodle cake (70g); simmer on medium heat for 2.5 minutes, loosening strands with a fork.', timer_seconds: 150 },
      { text: 'Pour springy noodles and aromatic steaming broth into a wide deep bowl.', timer_seconds: 20 },
    ],
    toppings: [
      {
        suffix: 'with Soft Boiled Egg',
        step: { text: 'Boil 1 egg for 6.5 minutes, plunge into cold water, peel, halve, and float in broth for jammy yolk.', timer_seconds: 390 },
        ingredients: [{ id: 6, qty: 1, unit: 'piece' }],
        extraMinutes: 4,
      },
      {
        suffix: 'with Sautéed Mushrooms',
        step: { text: 'Slice 60g mushrooms, sear in 1/2 tsp oil for 2 minutes with soy sauce, and arrange in bowl.', timer_seconds: 120 },
        ingredients: [{ id: 32, qty: 60, unit: 'g' }],
      },
      {
        suffix: 'with Steamed Baby Spinach',
        step: { text: 'Submerge 45g fresh spinach leaves in the hot broth for 30 seconds until bright green and tender.', timer_seconds: 30 },
        ingredients: [{ id: 48, qty: 45, unit: 'g' }],
      },
      {
        suffix: 'with Pan-Seared Tofu',
        step: { text: 'Cube 80g firm tofu, pan-sear with soy sauce for 3 minutes until crisp-crusted, and place in broth.', timer_seconds: 180 },
        ingredients: [{ id: 41, qty: 80, unit: 'g' }],
      },
      {
        suffix: 'with Melting Cheese Slice',
        step: { text: 'Lay 1 slice of processed cheese directly over the steaming noodles; let it melt into rich creamy broth.', timer_seconds: 30 },
        ingredients: [{ id: 30, qty: 1, unit: 'piece' }],
      },
      {
        suffix: 'with Sweet Corn & Chilli Oil',
        step: { text: 'Top with 40g sweet corn kernels and a drizzle of hot chilli oil for sweet-spicy crunch.', timer_seconds: 30 },
        ingredients: [{ id: 43, qty: 40, unit: 'g' }, { id: 27, qty: 5, unit: 'ml' }],
      },
      {
        suffix: 'with Shredded Chicken',
        step: { text: 'Poach 100g chicken breast in the broth for 5 minutes, shred with two forks, and pile on top.', timer_seconds: 300 },
        ingredients: [{ id: 14, qty: 100, unit: 'g' }],
        extraMinutes: 3,
      },
    ],
  },

  // 13. Teriyaki Stir Fry (Pan-Asian)
  {
    name: 'Teriyaki Stir Fry',
    cuisine: 'Pan-Asian',
    emoji: '🥢',
    minutes: 14,
    equipment: ['1-pan', 'induction'],
    imageUrl: 'https://images.unsplash.com/photo-1514944298352-f6700c3b0369?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Stir-frying on low heat causes vegetables to weep water and steam into limp mush. Keep induction heat high and the pan moving for charred crispness.',
    baseIngredients: [
      { id: 40, qty: 25, unit: 'ml' }, // Soy Sauce
      { id: 19, qty: 6, unit: 'g' }, // Garlic
      { id: 18, qty: 6, unit: 'g' }, // Ginger
      { id: 49, qty: 45, unit: 'g' }, // Capsicum
      { id: 1, qty: 45, unit: 'g' }, // Onion
      { id: 27, qty: 10, unit: 'ml' }, // Cooking Oil
    ],
    baseSteps: [
      { text: 'In a small bowl, whisk 25ml soy sauce, 1 tsp sugar, 1 tsp minced ginger, 1 tsp minced garlic, and 2 tbsp water.', timer_seconds: 40 },
      { text: 'Slice 1/2 onion (45g) and 1/2 green bell pepper (45g) into thin strips.' },
      { text: 'Heat 10ml cooking oil in a wide skillet or wok on high heat (1000W) until shimmering.', timer_seconds: 45 },
      { text: 'Add sliced onions and capsicum; stir-fry vigorously for 2 minutes until edges are charred but crisp.', timer_seconds: 120 },
      { text: 'Pour in the teriyaki sauce; it will bubble up and reduce to a shiny, sticky glaze within 60 seconds.', timer_seconds: 60 },
      { text: 'Toss vegetables to coat thoroughly in the savory-sweet glaze and transfer to a bowl.', timer_seconds: 30 },
    ],
    toppings: [
      {
        suffix: 'with Pan-Seared Tofu & Rice',
        step: { text: 'Pan-fry 90g cubed tofu in 1 tsp oil for 3 minutes until golden, glaze in teriyaki, serve over 120g rice.', timer_seconds: 180 },
        ingredients: [{ id: 41, qty: 90, unit: 'g' }, { id: 10, qty: 60, unit: 'g' }],
      },
      {
        suffix: 'with Glazed Chicken Breast & Rice',
        step: { text: 'Sear 120g sliced chicken breast for 4 minutes until cooked, toss in teriyaki glaze, serve over rice.', timer_seconds: 240 },
        ingredients: [{ id: 14, qty: 120, unit: 'g' }, { id: 10, qty: 60, unit: 'g' }],
        extraMinutes: 3,
      },
      {
        suffix: 'with Button Mushrooms & Corn',
        step: { text: 'Sauté 70g mushrooms and 35g sweet corn in the teriyaki pan for 2.5 minutes until caramelized.', timer_seconds: 150 },
        ingredients: [{ id: 32, qty: 70, unit: 'g' }, { id: 43, qty: 35, unit: 'g' }],
      },
      {
        suffix: 'with Steamed Quinoa',
        step: { text: 'Layer 60g cooked fluffy quinoa into the bowl and ladle the glossy stir-fry over it.', timer_seconds: 30 },
        ingredients: [{ id: 38, qty: 50, unit: 'g' }],
      },
      {
        suffix: 'with Toasted Peanuts & Chilli',
        step: { text: 'Toast 25g peanuts with sliced green chilli in 1/2 tsp oil for 90 seconds, scatter over stir fry.', timer_seconds: 90 },
        ingredients: [{ id: 21, qty: 25, unit: 'g' }, { id: 17, qty: 4, unit: 'g' }],
      },
      {
        suffix: 'with Crispy Soya Chunks',
        step: { text: 'Soak 45g soya chunks, squeeze dry, pan-fry until crunchy, and glaze in sticky teriyaki.', timer_seconds: 240 },
        ingredients: [{ id: 20, qty: 45, unit: 'g' }],
      },
      {
        suffix: 'with Sunny Side Egg',
        step: { text: 'Fry 1 egg in oil with crispy lacy edges for 2 minutes; crown the stir-fry bowl.', timer_seconds: 120 },
        ingredients: [{ id: 6, qty: 1, unit: 'piece' }],
      },
    ],
  },

  // 14. Gourmet Sushi Bowl (Pan-Asian)
  {
    name: 'Gourmet Sushi Bowl',
    cuisine: 'Pan-Asian',
    emoji: '🍣',
    minutes: 12,
    equipment: ['no-cook', 'hostel-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Assembling the bowl over piping hot rice wilts fresh veggies and warms the avocado into unpleasant mush. Let cooked rice cool to room temperature first.',
    baseIngredients: [
      { id: 10, qty: 70, unit: 'g' }, // Rice
      { id: 40, qty: 15, unit: 'ml' }, // Soy Sauce
      { id: 36, qty: 0.5, unit: 'piece' }, // Avocado
      { id: 49, qty: 35, unit: 'g' }, // Capsicum/Cucumber
      { id: 50, qty: 0.5, unit: 'piece' }, // Lemon
    ],
    baseSteps: [
      { text: 'Take 130g room-temperature cooked rice; toss with 1 tsp lemon juice, 1/3 tsp salt, and 1/3 tsp sugar.', timer_seconds: 60 },
      { text: 'Spoon the seasoned rice into a shallow broad bowl and level gently with a moist spoon.', timer_seconds: 30 },
      { text: 'Cut 1/2 ripe avocado into clean thin slices; fan out over one quarter of the bowl.' },
      { text: 'Slice 35g capsicum into crisp matchsticks and arrange in the adjacent quarter.' },
      { text: 'Mix 15ml soy sauce with 1/2 tsp lemon juice in a small cup for dressing.', timer_seconds: 30 },
      { text: 'Drizzle the tangy soy dressing across the rice and avocado.', timer_seconds: 20 },
    ],
    toppings: [
      {
        suffix: 'with Norwegian Teriyaki Salmon',
        step: { text: 'Sear 130g salmon fillet in pan for 3.5 mins skin-down, flip 2 mins with soy glaze, and flake over rice.', timer_seconds: 330 },
        ingredients: [{ id: 39, qty: 130, unit: 'g' }, { id: 40, qty: 10, unit: 'ml' }],
        extraMinutes: 4,
      },
      {
        suffix: 'with Sesame Glazed Tofu',
        step: { text: 'Pan-sear 90g firm tofu cubes in soy sauce for 3 minutes until golden-crusted; cluster on bowl.', timer_seconds: 180 },
        ingredients: [{ id: 41, qty: 90, unit: 'g' }],
      },
      {
        suffix: 'with Creamy Sliced Avocado',
        step: { text: 'Double the avocado by fanning another 1/2 avocado with cracked black pepper and lime zest.' },
        ingredients: [{ id: 36, qty: 0.5, unit: 'piece' }],
      },
      {
        suffix: 'with Sweet Corn & Edamame',
        step: { text: 'Steam 45g sweet corn kernels, toss with a touch of oil, and arrange beside the vegetables.', timer_seconds: 60 },
        ingredients: [{ id: 43, qty: 45, unit: 'g' }],
      },
      {
        suffix: 'with Soft Boiled Jammy Egg',
        step: { text: 'Boil 1 egg for 6.5 minutes, peel, slice in half, and set with golden yolk facing up.', timer_seconds: 390 },
        ingredients: [{ id: 6, qty: 1, unit: 'piece' }],
      },
      {
        suffix: 'with Sautéed Teriyaki Mushrooms',
        step: { text: 'Sauté 70g mushrooms in soy sauce and butter for 3 minutes until glazed; spoon over rice.', timer_seconds: 180 },
        ingredients: [{ id: 32, qty: 70, unit: 'g' }, { id: 16, qty: 5, unit: 'g' }],
      },
      {
        suffix: 'with Steamed Fluffy Quinoa',
        step: { text: 'Substitute half the rice with 50g fluffy steamed quinoa tossed with sea salt and lemon.', timer_seconds: 30 },
        ingredients: [{ id: 38, qty: 45, unit: 'g' }],
      },
    ],
  },

  // 15. Bean & Corn Quesadilla (Mexican)
  {
    name: 'Bean & Corn Quesadilla',
    cuisine: 'Mexican',
    emoji: '🌮',
    minutes: 10,
    equipment: ['1-pan', 'hostel-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Cranking up high heat burns the tortilla before the cheese has time to melt inside. Keep heat medium-low so the bread toasts golden while cheese turns gooey.',
    baseIngredients: [
      { id: 9, qty: 1, unit: 'piece' }, // Bread/Roti/Tortilla
      { id: 42, qty: 55, unit: 'g' }, // Black Beans
      { id: 43, qty: 40, unit: 'g' }, // Sweet Corn
      { id: 30, qty: 1, unit: 'piece' }, // Cheese Slice
      { id: 1, qty: 30, unit: 'g' }, // Onion
      { id: 3, qty: 30, unit: 'g' }, // Tomato
      { id: 16, qty: 8, unit: 'g' }, // Butter
    ],
    baseSteps: [
      { text: 'In a bowl, mix 55g cooked black beans and 40g sweet corn kernels with 1/4 tsp cumin, 1/4 tsp chilli, and 1/3 tsp salt.' },
      { text: 'Mash lightly with a fork so the mixture binds slightly.' },
      { text: 'Heat a flat pan on medium-low heat (400W); melt 8g butter.', timer_seconds: 30 },
      { text: 'Place flatbread or tortilla on the pan; lay 1 cheese slice on one half of the bread.' },
      { text: 'Spread the bean-corn filling over the cheese and fold the other half over to create a half-moon.', timer_seconds: 30 },
      { text: 'Toast for 2 minutes until golden brown, flip gently, and cook 1.5 minutes until cheese is molten.', timer_seconds: 210 },
      { text: 'Slice into wedges and enjoy while cheese is gooey and stretchy.', timer_seconds: 20 },
    ],
    toppings: [
      {
        suffix: 'with Fresh Tomato Salsa',
        step: { text: 'Dice 1/2 tomato and 1/4 onion with chopped coriander, green chilli, and lemon; serve on the side.', timer_seconds: 90 },
        ingredients: [{ id: 3, qty: 45, unit: 'g' }, { id: 1, qty: 25, unit: 'g' }, { id: 50, qty: 0.5, unit: 'piece' }],
      },
      {
        suffix: 'with Sautéed Capsicum & Onions',
        step: { text: 'Stir-fry 35g capsicum and onion strips until charred, tuck inside the quesadilla filling.', timer_seconds: 120 },
        ingredients: [{ id: 49, qty: 35, unit: 'g' }],
      },
      {
        suffix: 'with Double Melting Cheese',
        step: { text: 'Add an extra full slice of cheddar/processed cheese for extreme melted cheese pull.' },
        ingredients: [{ id: 30, qty: 1, unit: 'piece' }],
      },
      {
        suffix: 'with Smashed Guacamole',
        step: { text: 'Mash 1/2 avocado with salt, lemon juice, and a pinch of chilli; spoon over warm wedges.', timer_seconds: 60 },
        ingredients: [{ id: 36, qty: 0.5, unit: 'piece' }],
      },
      {
        suffix: 'with Shredded Chicken Breast',
        step: { text: 'Tuck 60g cooked shredded chicken breast seasoned with cumin and chilli inside the quesadilla.', timer_seconds: 120 },
        ingredients: [{ id: 14, qty: 60, unit: 'g' }],
      },
      {
        suffix: 'with Tangy Curd Sour Cream',
        step: { text: 'Whisk 50g thick curd with lemon juice and salt to make a cooling protein dip on the side.', timer_seconds: 30 },
        ingredients: [{ id: 8, qty: 50, unit: 'g' }],
      },
      {
        suffix: 'with Spicy Soya Keema',
        step: { text: 'Add 35g cooked spiced soya mince to the quesadilla filling for 18g plant protein.', timer_seconds: 90 },
        ingredients: [{ id: 20, qty: 35, unit: 'g' }],
      },
    ],
  },

  // 16. Chipotle Protein Bowl (Mexican)
  {
    name: 'Chipotle Protein Bowl',
    cuisine: 'Mexican',
    emoji: '🌯',
    minutes: 15,
    equipment: ['1-pan', 'induction'],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Spooning unseasoned, cold canned beans over rice. Always warm beans in a skillet with cumin, chilli, and salt so they absorb deep Mexican flavors.',
    baseIngredients: [
      { id: 10, qty: 70, unit: 'g' }, // Rice
      { id: 42, qty: 65, unit: 'g' }, // Black Beans
      { id: 43, qty: 45, unit: 'g' }, // Sweet Corn
      { id: 3, qty: 50, unit: 'g' }, // Tomato
      { id: 1, qty: 35, unit: 'g' }, // Onion
      { id: 50, qty: 0.5, unit: 'piece' }, // Lemon
      { id: 4, qty: 8, unit: 'g' }, // Coriander
      { id: 27, qty: 8, unit: 'ml' }, // Cooking Oil
    ],
    baseSteps: [
      { text: 'Layer 130g warm cooked rice into a wide bowl as the base.', timer_seconds: 30 },
      { text: 'Heat 8ml oil in a skillet on medium heat; add 65g black beans, 45g sweet corn, 1/4 tsp cumin, and 1/3 tsp salt.', timer_seconds: 30 },
      { text: 'Sauté beans and corn for 2 minutes until hot and aromatic, then spoon into one quadrant of the bowl.', timer_seconds: 120 },
      { text: 'Dice 50g tomato and 35g onion; toss with chopped coriander, squeeze of lemon, and salt to make fresh salsa.', timer_seconds: 90 },
      { text: 'Spoon the fresh tomato-onion salsa into the adjacent quadrant.', timer_seconds: 20 },
      { text: 'Drizzle 1 tsp olive or cooking oil and squeeze fresh lemon over the assembled bowl.', timer_seconds: 20 },
    ],
    toppings: [
      {
        suffix: 'with Grilled Chicken Breast',
        step: { text: 'Rub 120g chicken breast with cumin, chilli powder, and oil; sear 4.5 minutes, slice and fan over bowl.', timer_seconds: 270 },
        ingredients: [{ id: 14, qty: 120, unit: 'g' }],
        extraMinutes: 3,
      },
      {
        suffix: 'with Sliced Hass Avocado',
        step: { text: 'Slice 1/2 ripe avocado into smooth ribbons and lay over the bowl with a pinch of red chilli flakes.' },
        ingredients: [{ id: 36, qty: 0.5, unit: 'piece' }],
      },
      {
        suffix: 'with Seared Spiced Paneer',
        step: { text: 'Sear 80g paneer cubes with Mexican cumin and chilli in pan for 2 minutes; add to bowl.', timer_seconds: 120 },
        ingredients: [{ id: 7, qty: 80, unit: 'g' }],
      },
      {
        suffix: 'with Seasoned Black Beans & Corn',
        step: { text: 'Double up on warm spiced black beans and sweet corn for high-fiber vegan power.', timer_seconds: 60 },
        ingredients: [{ id: 42, qty: 45, unit: 'g' }, { id: 43, qty: 35, unit: 'g' }],
      },
      {
        suffix: 'with Fresh Tomato Pico de Gallo',
        step: { text: 'Dice 1 full tomato, 1/2 onion, green chilli, and coriander with generous lemon juice for extra salsa.', timer_seconds: 90 },
        ingredients: [{ id: 3, qty: 60, unit: 'g' }, { id: 1, qty: 30, unit: 'g' }],
      },
      {
        suffix: 'with Greek Yogurt Lime Crema',
        step: { text: 'Whisk 50g Greek yogurt with lime juice and a pinch of salt; drizzle as cooling cream dressing.', timer_seconds: 40 },
        ingredients: [{ id: 44, qty: 50, unit: 'g' }],
      },
      {
        suffix: 'with Fluffy Quinoa Base',
        step: { text: 'Swap rice for 50g fluffy cooked quinoa tossed with lime juice and coriander.', timer_seconds: 30 },
        ingredients: [{ id: 38, qty: 50, unit: 'g' }],
      },
    ],
  },

  // 17. Artisan Fajita Skillet (Mexican)
  {
    name: 'Artisan Fajita Skillet',
    cuisine: 'Mexican',
    emoji: '🥩',
    minutes: 15,
    equipment: ['1-pan', 'induction'],
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Moving peppers and onions constantly in the pan prevents them from searing. Let veggies sit motionless on the screaming hot skillet for 60 seconds to get signature blistered char.',
    baseIngredients: [
      { id: 49, qty: 90, unit: 'g' }, // Capsicum
      { id: 1, qty: 70, unit: 'g' }, // Onion
      { id: 19, qty: 6, unit: 'g' }, // Garlic
      { id: 27, qty: 12, unit: 'ml' }, // Cooking Oil
      { id: 50, qty: 0.5, unit: 'piece' }, // Lemon
      { id: 25, qty: 2, unit: 'g' }, // Red Chilli Powder
      { id: 23, qty: 2, unit: 'g' }, // Cumin Seeds
    ],
    baseSteps: [
      { text: 'Cut 1 large bell pepper (90g) and 1 medium onion (70g) into long 1/2cm strips; mince 2 cloves garlic.' },
      { text: 'In a cup, mix 1/2 tsp cumin, 1/2 tsp chilli powder, 1/2 tsp salt, and 1 tbsp lemon juice.', timer_seconds: 30 },
      { text: 'Heat 12ml cooking oil in a wide heavy skillet on high induction heat (1000W) until smoking hot.', timer_seconds: 60 },
      { text: 'Drop in sliced peppers, onions, and minced garlic in a single layer.', timer_seconds: 20 },
      { text: 'Leave untouched for 60 seconds, then toss and sear for another 2.5 minutes until charred and blistered.', timer_seconds: 210 },
      { text: 'Pour the spiced lemon glaze over the sizzling pan; toss vigorously for 30 seconds as steam deglazes.', timer_seconds: 30 },
    ],
    toppings: [
      {
        suffix: 'with Sizzling Chicken Breast Strips',
        step: { text: 'Sear 130g spiced chicken breast strips on high heat for 4 minutes before tossing with vegetables.', timer_seconds: 240 },
        ingredients: [{ id: 14, qty: 130, unit: 'g' }],
        extraMinutes: 3,
      },
      {
        suffix: 'with Charred Paneer Steaks',
        step: { text: 'Cut 90g paneer into thick slabs, sear 2 minutes per side until charred, toss with sizzling peppers.', timer_seconds: 240 },
        ingredients: [{ id: 7, qty: 90, unit: 'g' }],
      },
      {
        suffix: 'with Black Beans & Sweet Corn',
        step: { text: 'Toss 50g black beans and 40g sweet corn into the sizzling skillet for the final 90 seconds.', timer_seconds: 90 },
        ingredients: [{ id: 42, qty: 50, unit: 'g' }, { id: 43, qty: 40, unit: 'g' }],
      },
      {
        suffix: 'with Sliced Avocado & Lime',
        step: { text: 'Arrange 1/2 sliced creamy avocado and charred lime wedges over the hot skillet.', timer_seconds: 40 },
        ingredients: [{ id: 36, qty: 0.5, unit: 'piece' }],
      },
      {
        suffix: 'with Warm Sourdough Flatbread',
        step: { text: 'Toast 1 thick slice of sourdough bread in the skillet juices for 90 seconds until crusty.', timer_seconds: 90 },
        ingredients: [{ id: 37, qty: 1, unit: 'piece' }],
      },
      {
        suffix: 'with Sautéed Garlic Mushrooms',
        step: { text: 'Sauté 75g sliced button mushrooms in the skillet for 3 minutes until juicy and caramelized.', timer_seconds: 180 },
        ingredients: [{ id: 32, qty: 75, unit: 'g' }],
      },
      {
        suffix: 'with Melting Cheddar Layer',
        step: { text: 'Lay 1 slice of cheddar over hot vegetables, cover pan for 45 seconds until bubbling.', timer_seconds: 45 },
        ingredients: [{ id: 30, qty: 1, unit: 'piece' }],
      },
    ],
  },

  // 18. Peanut Butter Oats (Continental)
  {
    name: 'Peanut Butter Oats',
    cuisine: 'Continental',
    emoji: '🥣',
    minutes: 8,
    equipment: ['1-pan', 'kettle-only', 'hostel-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Stirring peanut butter into rolling boiling milk causes the oil to separate and curdle. Turn off heat first, then stir in peanut butter until it melts into silky cream.',
    baseIngredients: [
      { id: 13, qty: 50, unit: 'g' }, // Rolled Oats
      { id: 29, qty: 160, unit: 'ml' }, // Milk
      { id: 15, qty: 25, unit: 'g' }, // Peanut Butter
      { id: 46, qty: 0.5, unit: 'piece' }, // Banana
    ],
    baseSteps: [
      { text: 'Place 50g rolled oats in a small pot or electric kettle.', timer_seconds: 20 },
      { text: 'Pour in 160ml milk (or 80ml milk + 80ml water) and a tiny pinch of salt.', timer_seconds: 30 },
      { text: 'Bring to a gentle simmer on medium-low heat, stirring with a spoon to prevent milk from scorching.', timer_seconds: 120 },
      { text: 'Cook for 2.5 minutes until oats thicken and absorb the milk.', timer_seconds: 150 },
      { text: 'Turn off heat completely. Add 25g peanut butter.', timer_seconds: 20 },
      { text: 'Stir vigorously for 40 seconds until peanut butter melts into velvety, creamy oats.', timer_seconds: 40 },
      { text: 'Pour into a bowl and let settle for 1 minute before topping.', timer_seconds: 60 },
    ],
    toppings: [
      {
        suffix: 'with Fresh Banana Slices',
        step: { text: 'Slice another 1/2 ripe banana into neat coins and arrange across the warm oatmeal.', timer_seconds: 45 },
        ingredients: [{ id: 46, qty: 0.5, unit: 'piece' }],
      },
      {
        suffix: 'with Crunchy Roasted Peanuts',
        step: { text: 'Scatter 20g crushed roasted peanuts on top for contrasting salty crunch.', timer_seconds: 20 },
        ingredients: [{ id: 21, qty: 20, unit: 'g' }],
      },
      {
        suffix: 'with Crispy Granola Clusters',
        step: { text: 'Sprinkle 25g toasted granola clusters over the warm oats for hearty texture.', timer_seconds: 20 },
        ingredients: [{ id: 45, qty: 25, unit: 'g' }],
      },
      {
        suffix: 'with Greek Yogurt Swirl',
        step: { text: 'Dollop 45g cold Greek yogurt in the center and swirl into the warm oats for a protein boost.', timer_seconds: 30 },
        ingredients: [{ id: 44, qty: 45, unit: 'g' }],
      },
      {
        suffix: 'with Warm Cinnamon & Honey',
        step: { text: 'Dust 1/4 tsp ground cinnamon and splash 20ml warm milk over the bowl.' },
        ingredients: [{ id: 29, qty: 20, unit: 'ml' }],
      },
      {
        suffix: 'with Dark Sliced Dragon Fruit',
        step: { text: 'Dice 40g vibrant dragon fruit into cubes and scatter over the bowl.', timer_seconds: 60 },
        ingredients: [{ id: 34, qty: 0.3, unit: 'piece' }],
      },
      {
        suffix: 'with Melted Butter Drizzle',
        step: { text: 'Melt 8g butter over the hot oatmeal for rich, old-fashioned diner-style indulgence.', timer_seconds: 20 },
        ingredients: [{ id: 16, qty: 8, unit: 'g' }],
      },
    ],
  },

  // 19. Greek Yogurt Parfait (Continental)
  {
    name: 'Greek Yogurt Parfait',
    cuisine: 'Continental',
    emoji: '🍨',
    minutes: 6,
    equipment: ['no-cook', 'hostel-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Assembling the parfait hours before eating turns crispy granola soggy and chewy. Keep granola separate and layer on immediately before eating.',
    baseIngredients: [
      { id: 44, qty: 120, unit: 'g' }, // Greek Yogurt
      { id: 45, qty: 35, unit: 'g' }, // Granola
      { id: 46, qty: 0.5, unit: 'piece' }, // Banana
    ],
    baseSteps: [
      { text: 'Take a clean tall glass or broad bowl.' },
      { text: 'Spoon 60g chilled, thick Greek yogurt into the base as the first layer.', timer_seconds: 20 },
      { text: 'Slice 1/2 banana into thin coins and place half the slices over the yogurt.', timer_seconds: 30 },
      { text: 'Sprinkle 20g crunchy granola evenly across the fruit layer.', timer_seconds: 20 },
      { text: 'Spoon remaining 60g Greek yogurt on top to form the second layer.', timer_seconds: 20 },
      { text: 'Finish with remaining banana slices and 15g granola.', timer_seconds: 20 },
    ],
    toppings: [
      {
        suffix: 'with Crunchy Toasted Granola',
        step: { text: 'Heap an extra generous 25g golden toasted granola clusters on top for mega crunch.' },
        ingredients: [{ id: 45, qty: 25, unit: 'g' }],
      },
      {
        suffix: 'with Diced Dragon Fruit',
        step: { text: 'Dice 45g fresh pink dragon fruit into vibrant cubes and scatter over the top.', timer_seconds: 60 },
        ingredients: [{ id: 34, qty: 0.3, unit: 'piece' }],
      },
      {
        suffix: 'with Peanut Butter Drizzle',
        step: { text: 'Warm 15g creamy peanut butter for 30s to loosen, then drizzle ribbons across the parfait.', timer_seconds: 40 },
        ingredients: [{ id: 15, qty: 15, unit: 'g' }],
      },
      {
        suffix: 'with Roasted Crushed Peanuts',
        step: { text: 'Scatter 20g coarsely crushed salted peanuts over the parfait for rich nutty crunch.' },
        ingredients: [{ id: 21, qty: 20, unit: 'g' }],
      },
      {
        suffix: 'with Sliced Ripe Bananas',
        step: { text: 'Fan an extra half sweet banana across the top with a pinch of cinnamon.', timer_seconds: 45 },
        ingredients: [{ id: 46, qty: 0.5, unit: 'piece' }],
      },
      {
        suffix: 'with Chilled Acai Swirl',
        step: { text: 'Swirl 30g chilled acai berry puree through the top yogurt layer for tangy fruit kick.', timer_seconds: 30 },
        ingredients: [{ id: 35, qty: 30, unit: 'g' }],
      },
      {
        suffix: 'with Creamy Curd Layer',
        step: { text: 'Whisk 40g fresh curd with honey and fold between fruit layers for lighter tang.', timer_seconds: 30 },
        ingredients: [{ id: 8, qty: 40, unit: 'g' }],
      },
    ],
  },

  // 20. Avocado Sourdough Toast (Continental)
  {
    name: 'Avocado Sourdough Toast',
    cuisine: 'Continental',
    emoji: '🥑',
    minutes: 10,
    equipment: ['1-pan', 'hostel-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Mashing warm avocado or spreading it on steaming soft bread makes toast limp and wet. Toast bread until rock-crisp, let steam vent 30s, then spread.',
    baseIngredients: [
      { id: 37, qty: 1, unit: 'piece' }, // Sourdough
      { id: 36, qty: 0.5, unit: 'piece' }, // Avocado
      { id: 50, qty: 0.5, unit: 'piece' }, // Lemon
      { id: 16, qty: 8, unit: 'g' }, // Butter
    ],
    baseSteps: [
      { text: 'Heat a dry skillet or pan on medium induction heat (600W) for 1 minute.', timer_seconds: 60 },
      { text: 'Spread 8g butter on both sides of 1 thick slice of artisan sourdough bread.', timer_seconds: 30 },
      { text: 'Toast in the pan for 2 minutes per side until golden brown and audibly crispy.', timer_seconds: 240 },
      { text: 'Cut 1/2 ripe avocado, scoop flesh into a small bowl, add 1 tsp lemon juice, 1/4 tsp salt, and black pepper.', timer_seconds: 45 },
      { text: 'Mash with a fork to a chunky, spreadable texture.', timer_seconds: 30 },
      { text: 'Generously spread seasoned avocado over the crispy sourdough toast from edge to edge.', timer_seconds: 30 },
    ],
    toppings: [
      {
        suffix: 'with Sunny-Side Fried Egg',
        step: { text: 'Fry 1 egg in butter for 2.5 minutes until whites set and yolk is runny; place atop avocado.', timer_seconds: 150 },
        ingredients: [{ id: 6, qty: 1, unit: 'piece' }, { id: 16, qty: 5, unit: 'g' }],
      },
      {
        suffix: 'with Soft Poached Egg & Chilli Flakes',
        step: { text: 'Gently poach 1 egg in simmering water for 3 minutes, place on toast, sprinkle crushed chilli flakes.', timer_seconds: 180 },
        ingredients: [{ id: 6, qty: 1, unit: 'piece' }, { id: 25, qty: 1, unit: 'g' }],
      },
      {
        suffix: 'with Sautéed Button Mushrooms',
        step: { text: 'Sauté 65g sliced button mushrooms in 1 tsp butter and minced garlic for 3 minutes, pile on toast.', timer_seconds: 180 },
        ingredients: [{ id: 32, qty: 65, unit: 'g' }, { id: 19, qty: 5, unit: 'g' }],
      },
      {
        suffix: 'with Crumbled Paneer & Herbs',
        step: { text: 'Crumble 45g fresh paneer over the mashed avocado, garnish with finely chopped coriander.', timer_seconds: 30 },
        ingredients: [{ id: 7, qty: 45, unit: 'g' }, { id: 4, qty: 6, unit: 'g' }],
      },
      {
        suffix: 'with Sliced Boiled Eggs',
        step: { text: 'Slice 1 hard-boiled egg into neat rounds, fan over avocado, sprinkle coarse black pepper.', timer_seconds: 450 },
        ingredients: [{ id: 6, qty: 1, unit: 'piece' }],
      },
      {
        suffix: 'with Melting Cheddar Slice',
        step: { text: 'Place 1 cheese slice over avocado and cover pan for 45 seconds until velvety and melted.', timer_seconds: 45 },
        ingredients: [{ id: 30, qty: 1, unit: 'piece' }],
      },
      {
        suffix: 'with Cherry Tomatoes & Basil',
        step: { text: 'Slice 40g tomatoes, toss with a touch of oil and salt, scatter across the green avocado.', timer_seconds: 45 },
        ingredients: [{ id: 3, qty: 40, unit: 'g' }],
      },
    ],
  },

  // 21. Acai Superfood Bowl (Continental)
  {
    name: 'Acai Superfood Bowl',
    cuisine: 'Continental',
    emoji: '🫐',
    minutes: 8,
    equipment: ['mixer', 'no-cook', 'hostel-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Adding too much liquid turns your smoothie bowl into watery soup. Add only a tiny splash of milk; pulse and tamp down until it churns like thick gelato.',
    baseIngredients: [
      { id: 35, qty: 85, unit: 'g' }, // Acai Puree
      { id: 46, qty: 1, unit: 'piece' }, // Banana
      { id: 34, qty: 0.3, unit: 'piece' }, // Dragon Fruit
      { id: 45, qty: 30, unit: 'g' }, // Granola
    ],
    baseSteps: [
      { text: 'Peel 1 ripe banana, slice into chunks, and place in freezer for 20 minutes (or use pre-frozen banana slices).' },
      { text: 'In a mixer or blender jar, add 85g acai puree and the cold banana chunks.', timer_seconds: 20 },
      { text: 'Add 30ml chilled milk or water to help the blender blades catch.', timer_seconds: 15 },
      { text: 'Pulse in 10-second bursts, stopping to scrape down sides, until thick and frosty like sorbet.', timer_seconds: 60 },
      { text: 'Spoon the frosty purple acai base into a chilled bowl and smooth with a spoon.', timer_seconds: 30 },
      { text: 'Artfully arrange sliced dragon fruit and crunchy granola down the sides.', timer_seconds: 45 },
    ],
    toppings: [
      {
        suffix: 'with Dragon Fruit & Chia Crunch',
        step: { text: 'Cut an extra 40g dragon fruit into cubes, arrange in a row across the bowl with seeds.', timer_seconds: 60 },
        ingredients: [{ id: 34, qty: 0.3, unit: 'piece' }],
      },
      {
        suffix: 'with Sliced Banana & Crunchy Granola',
        step: { text: 'Fan 1/2 sliced banana down one side and heap 25g crunchy granola down the other.', timer_seconds: 45 },
        ingredients: [{ id: 46, qty: 0.5, unit: 'piece' }, { id: 45, qty: 25, unit: 'g' }],
      },
      {
        suffix: 'with Peanut Butter Swirl',
        step: { text: 'Warm 15g creamy peanut butter, then drizzle artistic ribbons over the frosty purple acai.', timer_seconds: 30 },
        ingredients: [{ id: 15, qty: 15, unit: 'g' }],
      },
      {
        suffix: 'with Greek Yogurt Cloud',
        step: { text: 'Spoon 40g thick Greek yogurt alongside the acai for a high-protein marbled swirl.', timer_seconds: 20 },
        ingredients: [{ id: 44, qty: 40, unit: 'g' }],
      },
      {
        suffix: 'with Roasted Peanuts & Seeds',
        step: { text: 'Scatter 20g toasted peanuts over the bowl for rich nutty crunch against the cold fruit.', timer_seconds: 20 },
        ingredients: [{ id: 21, qty: 20, unit: 'g' }],
      },
      {
        suffix: 'with Diced Fresh Fruits',
        step: { text: 'Arrange diced dragon fruit and sweet banana coins across the surface for a cafe look.', timer_seconds: 60 },
        ingredients: [{ id: 46, qty: 0.5, unit: 'piece' }, { id: 34, qty: 0.2, unit: 'piece' }],
      },
      {
        suffix: 'with Chilled Coconut Milk Layer',
        step: { text: 'Drizzle 30ml chilled milk around the perimeter for a creamy white halo.', timer_seconds: 20 },
        ingredients: [{ id: 29, qty: 30, unit: 'ml' }],
      },
    ],
  },

  // 22. Hummus Pita Wrap (Middle Eastern)
  {
    name: 'Hummus Pita Wrap',
    cuisine: 'Middle Eastern',
    emoji: '🥙',
    minutes: 10,
    equipment: ['1-pan', 'no-cook', 'hostel-friendly'],
    imageUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80',
    whereItGoesWrongTip: '⚠️ Where this goes wrong: Over-toasting the pita makes it stiff and brittle so it snaps when rolled. Warm it on the pan for just 30 seconds per side so it stays pliable and soft.',
    baseIngredients: [
      { id: 9, qty: 1, unit: 'piece' }, // Pita/Bread/Flatbread
      { id: 8, qty: 50, unit: 'g' }, // Curd (quick tahini/garlic sauce base)
      { id: 19, qty: 5, unit: 'g' }, // Garlic
      { id: 27, qty: 6, unit: 'ml' }, // Cooking Oil
      { id: 50, qty: 0.5, unit: 'piece' }, // Lemon
      { id: 1, qty: 35, unit: 'g' }, // Onion
      { id: 3, qty: 35, unit: 'g' }, // Tomato
    ],
    baseSteps: [
      { text: 'In a small bowl, whisk 50g thick curd with 1 tsp oil, 1 minced garlic clove, squeeze of lemon, and pinch of salt.', timer_seconds: 60 },
      { text: 'Thinly slice 35g onion and 35g tomato into crescent strips.' },
      { text: 'Warm 1 pita bread or flatbread on a dry pan for 30 seconds per side until soft and pliable.', timer_seconds: 60 },
      { text: 'Lay the warm bread flat; spread the garlic yogurt sauce down the center third.', timer_seconds: 20 },
      { text: 'Layer sliced onions, tomatoes, and herbs over the spread.', timer_seconds: 30 },
      { text: 'Roll the bottom edge up, fold sides in, roll into a tight wrap, and slice diagonally in half.', timer_seconds: 30 },
    ],
    toppings: [
      {
        suffix: 'with Spiced Paneer Cubes',
        step: { text: 'Toss 65g paneer cubes with 1/2 tsp garam masala, pan-sear 2 minutes, and tuck inside the wrap.', timer_seconds: 120 },
        ingredients: [{ id: 7, qty: 65, unit: 'g' }],
      },
      {
        suffix: 'with Seared Chicken Shawarma Strips',
        step: { text: 'Season 110g chicken strips with garlic, cumin, and chilli; sear 4 minutes and roll inside.', timer_seconds: 240 },
        ingredients: [{ id: 14, qty: 110, unit: 'g' }],
        extraMinutes: 3,
      },
      {
        suffix: 'with Sautéed Capsicum & Onions',
        step: { text: 'Sauté 35g bell pepper and onion strips in 1/2 tsp oil for 2 minutes before packing into wrap.', timer_seconds: 120 },
        ingredients: [{ id: 49, qty: 35, unit: 'g' }],
      },
      {
        suffix: 'with Sliced Boiled Egg',
        step: { text: 'Hard-boil 1 egg (7.5 mins), slice lengthwise, and layer inside with cracked black pepper.', timer_seconds: 450 },
        ingredients: [{ id: 6, qty: 1, unit: 'piece' }],
      },
      {
        suffix: 'with Crispy Soya Chunks',
        step: { text: 'Soak 35g soya chunks, squeeze dry, toss with spices, crisp in a pan, and roll up.', timer_seconds: 240 },
        ingredients: [{ id: 20, qty: 35, unit: 'g' }],
      },
      {
        suffix: 'with Fresh Tomato & Herb Salad',
        step: { text: 'Toss 50g diced tomatoes with fresh coriander and lemon juice for a juicy crunch inside the wrap.', timer_seconds: 60 },
        ingredients: [{ id: 3, qty: 50, unit: 'g' }, { id: 4, qty: 8, unit: 'g' }],
      },
      {
        suffix: 'with Melting Cheese Slice',
        step: { text: 'Place 1 cheese slice on the hot pita so it melts before rolling up.', timer_seconds: 30 },
        ingredients: [{ id: 30, qty: 1, unit: 'piece' }],
      },
    ],
  },
];

// Recipe seed interface
interface RecipeSeed {
  id: number;
  title: string;
  cuisine: string;
  budget_tier: 'broke' | 'balanced' | 'hifi';
  goals: string[];
  minutes: number;
  equipment_tags: string[];
  servings: number;
  steps: StepDef[];
  macros: { kcal: number; protein: number; carbs: number; fats: number; fiber: number };
  cost_per_serving: number;
  cost_full_pack: number;
  image_url: string;
  emoji: string;
  gradient_seed: number;
  ingredients: { ingredient_id: number; qty: number; unit: string }[];
}

console.log('Generating deduplicated, culinarily sound recipes...');

const allRecipes: RecipeSeed[] = [];
let recipeIdCounter = 1;

for (const dish of BASE_DISH_CONFIGS) {
  for (const topping of dish.toppings) {
    const id = recipeIdCounter++;
    const title = `${dish.name} ${topping.suffix}`;
    const minutes = dish.minutes + (topping.extraMinutes || 0);

    // Combine ingredients
    const combinedIngMap = new Map<number, { qty: number; unit: string }>();
    
    // Add base ingredients
    for (const b of dish.baseIngredients) {
      combinedIngMap.set(b.id, { qty: b.qty, unit: b.unit });
    }
    // Add topping ingredients
    for (const t of topping.ingredients) {
      if (combinedIngMap.has(t.id)) {
        const cur = combinedIngMap.get(t.id)!;
        combinedIngMap.set(t.id, { qty: cur.qty + t.qty, unit: cur.unit });
      } else {
        combinedIngMap.set(t.id, { qty: t.qty, unit: t.unit });
      }
    }

    const recipeIngs: { ingredient_id: number; qty: number; unit: string }[] = [];
    let costPerServing = 0;
    let costFullPack = 0;
    let totalKcal = 0;
    let totalProt = 0;
    let totalCarb = 0;
    let totalFat = 0;
    let totalFib = 0;

    combinedIngMap.forEach((val, ingId) => {
      recipeIngs.push({ ingredient_id: ingId, qty: val.qty, unit: val.unit });
      const ingSeed = ingMap.get(ingId);
      if (ingSeed) {
        costPerServing += val.qty * ingSeed.unitPrice;
        costFullPack += ingSeed.avgPackPrice;
        totalKcal += val.qty * ingSeed.calPerUnit;
        totalProt += val.qty * ingSeed.protPerUnit;
        totalCarb += val.qty * ingSeed.carbPerUnit;
        totalFat += val.qty * ingSeed.fatPerUnit;
        totalFib += val.qty * ingSeed.fibPerUnit;
      }
    });

    costPerServing = Number(costPerServing.toFixed(1));
    costFullPack = Number(costFullPack.toFixed(0));

    // Determine budget tier
    let budgetTier: 'broke' | 'balanced' | 'hifi' = 'balanced';
    if (costPerServing < 60) {
      budgetTier = 'broke';
    } else if (costPerServing <= 150) {
      budgetTier = 'balanced';
    } else {
      budgetTier = 'hifi';
    }

    // Determine goals
    const goals: string[] = [];
    if (minutes <= 15) goals.push('15-min');
    if (totalProt >= 24) goals.push('high-protein');
    if (totalKcal >= 480) goals.push('muscle-gain');
    if (totalKcal <= 420 && totalProt >= 14) goals.push('fat-loss');
    if (goals.length === 0) goals.push('high-protein');

    // Build steps: 5 to 7 base steps + 1 topping step + tip
    const steps: StepDef[] = [];
    dish.baseSteps.forEach((st, idx) => {
      if (idx === 0) {
        // Embed the dish "Where this goes wrong" tip on the first or second step
        steps.push({ ...st, tip: dish.whereItGoesWrongTip });
      } else {
        steps.push({ ...st });
      }
    });

    // Add topping step
    steps.push(topping.step);

    allRecipes.push({
      id,
      title,
      cuisine: dish.cuisine,
      budget_tier: budgetTier,
      goals,
      minutes,
      equipment_tags: dish.equipment,
      servings: 1,
      steps,
      macros: {
        kcal: Math.round(totalKcal),
        protein: Number(totalProt.toFixed(1)),
        carbs: Number(totalCarb.toFixed(1)),
        fats: Number(totalFat.toFixed(1)),
        fiber: Number(totalFib.toFixed(1)),
      },
      cost_per_serving: costPerServing,
      cost_full_pack: costFullPack,
      image_url: dish.imageUrl,
      emoji: dish.emoji,
      gradient_seed: id,
      ingredients: recipeIngs,
    });
  }
}

console.log(`Generated ${allRecipes.length} clean recipes!`);

// 2. Generate Store Prices
const storePrices: { ingredient_id: number; store: string; price: number }[] = [];
INGREDIENTS_DATA.forEach((ing) => {
  const base = ing.avgPackPrice;
  const zeptoPrice = Number((base * (1.0 + (ing.id % 5) * 0.02 - 0.04)).toFixed(0));
  const blinkitPrice = Number((base * (1.0 + ((ing.id * 3) % 7) * 0.02 - 0.06)).toFixed(0));
  const instamartPrice = Number((base * (1.0 + ((ing.id * 5) % 6) * 0.02 - 0.03)).toFixed(0));

  storePrices.push({ ingredient_id: ing.id, store: 'ZEPTO', price: Math.max(10, zeptoPrice) });
  storePrices.push({ ingredient_id: ing.id, store: 'BLINKIT', price: Math.max(10, blinkitPrice) });
  storePrices.push({ ingredient_id: ing.id, store: 'INSTAMART', price: Math.max(10, instamartPrice) });
});

// 3. Write files
const assetDir = path.join(process.cwd(), 'bitecraft', 'assets', 'seeds');
if (!fs.existsSync(assetDir)) {
  fs.mkdirSync(assetDir, { recursive: true });
}

fs.writeFileSync(
  path.join(assetDir, 'ingredients_seed.json'),
  JSON.stringify(INGREDIENTS_DATA.map(i => ({
    id: i.id,
    name: i.name,
    aliases: i.aliases,
    category: i.category,
    packSize: i.packSize,
    avgPackPrice: i.avgPackPrice,
  })), null, 2),
  'utf-8'
);

fs.writeFileSync(
  path.join(assetDir, 'recipes_seed.json'),
  JSON.stringify(allRecipes, null, 2),
  'utf-8'
);

fs.writeFileSync(
  path.join(assetDir, 'store_prices_seed.json'),
  JSON.stringify(storePrices, null, 2),
  'utf-8'
);

// 4. Generate supabase/seed.sql
const sqlPath = path.join(process.cwd(), 'supabase', 'seed.sql');
const sqlWriteStream = fs.createWriteStream(sqlPath, { encoding: 'utf-8' });

sqlWriteStream.write(`-- Clean Deduplicated BiteCraft Seed Data (${allRecipes.length} Authentic Recipes)\n\n`);

// Ingredients
sqlWriteStream.write('-- Ingredients\n');
for (const ing of INGREDIENTS_DATA) {
  const aliasesArray = `ARRAY[${ing.aliases.map((a) => `'${a.replace(/'/g, "''")}'`).join(', ')}]`;
  sqlWriteStream.write(
    `INSERT INTO public.ingredients (id, name, aliases, category, pack_size, avg_pack_price) VALUES (${ing.id}, '${ing.name.replace(/'/g, "''")}', ${aliasesArray}, '${ing.category}', '${ing.packSize}', ${ing.avgPackPrice}) ON CONFLICT (id) DO NOTHING;\n`
  );
}

// Store Prices
sqlWriteStream.write('\n-- Store Prices\n');
for (const sp of storePrices) {
  sqlWriteStream.write(
    `INSERT INTO public.store_prices (ingredient_id, store, price) VALUES (${sp.ingredient_id}, '${sp.store}', ${sp.price}) ON CONFLICT (ingredient_id, store) DO UPDATE SET price = EXCLUDED.price;\n`
  );
}

// Recipes in batches
sqlWriteStream.write('\n-- Recipes\n');
const BATCH_SIZE = 50;
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

// Recipe Ingredients
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

for (let i = 0; i < allRecipeIngs.length; i += 200) {
  const batch = allRecipeIngs.slice(i, i + 200);
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
