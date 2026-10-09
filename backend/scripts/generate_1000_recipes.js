import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comprehensive localized ingredient dictionary with dual names (English + Hindi/Marathi)
const LOCALIZED_INGREDIENTS = {
  onion: { name: 'Onion (Kanda / Pyaz)', portion: '1 medium (chopped)', unitCost: 6, packUnit: '1kg bag', packCost: 35, zepto: 36, blinkit: 34, instamart: 38 },
  potato: { name: 'Potato (Aloo / Batata)', portion: '2 medium (boiled/diced)', unitCost: 8, packUnit: '1kg bag', packCost: 32, zepto: 32, blinkit: 30, instamart: 35 },
  tomato: { name: 'Tomato (Tamatar)', portion: '2 medium (diced)', unitCost: 8, packUnit: '1kg bag', packCost: 30, zepto: 30, blinkit: 28, instamart: 32 },
  garlic: { name: 'Garlic (Lehsun / Lasun)', portion: '6 cloves (minced)', unitCost: 6, packUnit: '250g pack', packCost: 45, zepto: 45, blinkit: 42, instamart: 48 },
  ginger: { name: 'Ginger (Adrak / Ale)', portion: '1 inch (grated)', unitCost: 5, packUnit: '200g pack', packCost: 35, zepto: 35, blinkit: 32, instamart: 38 },
  coriander: { name: 'Coriander Leaves (Dhaniya / Kothimbir)', portion: '1 handful (chopped)', unitCost: 5, packUnit: '100g bunch', packCost: 15, zepto: 15, blinkit: 14, instamart: 16 },
  greenChili: { name: 'Green Chilies (Hari Mirch)', portion: '2 pcs (slit)', unitCost: 3, packUnit: '100g pack', packCost: 15, zepto: 15, blinkit: 14, instamart: 16 },
  curryLeaves: { name: 'Curry Leaves (Kadi Patta / Kariveppila)', portion: '10-12 leaves', unitCost: 3, packUnit: '50g bunch', packCost: 12, zepto: 12, blinkit: 10, instamart: 14 },
  paneer: { name: 'Cottage Cheese (Malai Paneer)', portion: '150g cubes', unitCost: 60, packUnit: '200g pack', packCost: 85, zepto: 85, blinkit: 80, instamart: 88 },
  egg: { name: 'Farm Eggs (Ande)', portion: '2-3 eggs', unitCost: 18, packUnit: 'Pack of 6', packCost: 48, zepto: 48, blinkit: 45, instamart: 50 },
  chicken: { name: 'Boneless Chicken (Murgh)', portion: '180g pieces', unitCost: 80, packUnit: '450g pack', packCost: 195, zepto: 195, blinkit: 190, instamart: 205 },
  rice: { name: 'Basmati Rice (Chawal / Tandul)', portion: '1 cup (uncooked)', unitCost: 18, packUnit: '1kg bag', packCost: 90, zepto: 90, blinkit: 85, instamart: 95 },
  poha: { name: 'Flattened Rice (Poha / Aval / Chivda)', portion: '1 cup (70g)', unitCost: 8, packUnit: '500g pack', packCost: 45, zepto: 45, blinkit: 42, instamart: 48 },
  soyaChunks: { name: 'Soya Chunks (Mealmaker)', portion: '60g', unitCost: 14, packUnit: '200g pack', packCost: 45, zepto: 45, blinkit: 42, instamart: 48 },
  moongDal: { name: 'Yellow Moong Dal (Pasi Paruppu)', portion: '1/2 cup', unitCost: 15, packUnit: '500g pouch', packCost: 80, zepto: 80, blinkit: 78, instamart: 85 },
  toorDal: { name: 'Toor Dal (Arhar Dal / Tuvaram Paruppu)', portion: '1/2 cup', unitCost: 18, packUnit: '500g pouch', packCost: 95, zepto: 95, blinkit: 90, instamart: 98 },
  chanaDal: { name: 'Chana Dal (Bengal Gram)', portion: '1/2 cup', unitCost: 14, packUnit: '500g pouch', packCost: 75, zepto: 75, blinkit: 70, instamart: 78 },
  rajma: { name: 'Red Kidney Beans (Rajma)', portion: '1/2 cup (soaked)', unitCost: 16, packUnit: '500g pack', packCost: 85, zepto: 85, blinkit: 80, instamart: 90 },
  chole: { name: 'White Chickpeas (Kabuli Chana)', portion: '1/2 cup (soaked)', unitCost: 18, packUnit: '500g pack', packCost: 90, zepto: 90, blinkit: 85, instamart: 95 },
  kalaChana: { name: 'Black Chickpeas (Kala Chana)', portion: '1/2 cup (soaked)', unitCost: 12, packUnit: '500g pack', packCost: 55, zepto: 55, blinkit: 50, instamart: 58 },
  ghee: { name: 'Clarified Butter (Desi Ghee / Toop)', portion: '1-2 tbsp', unitCost: 15, packUnit: '200ml jar', packCost: 140, zepto: 140, blinkit: 135, instamart: 145 },
  mustardSeeds: { name: 'Mustard Seeds (Rai / Sarson / Mohari)', portion: '1 tsp', unitCost: 2, packUnit: '100g pack', packCost: 25, zepto: 25, blinkit: 22, instamart: 28 },
  cuminSeeds: { name: 'Cumin Seeds (Jeera / Jeeragam)', portion: '1 tsp', unitCost: 3, packUnit: '100g pack', packCost: 40, zepto: 40, blinkit: 38, instamart: 42 },
  turmeric: { name: 'Turmeric Powder (Haldi / Manjal)', portion: '1/2 tsp', unitCost: 2, packUnit: '100g pack', packCost: 30, zepto: 30, blinkit: 28, instamart: 32 },
  redChiliPowder: { name: 'Kashmiri Red Chili Powder (Lal Mirch)', portion: '1 tsp', unitCost: 3, packUnit: '100g pack', packCost: 42, zepto: 42, blinkit: 40, instamart: 45 },
  garamMasala: { name: 'Garam Masala Blend', portion: '1/2 tsp', unitCost: 3, packUnit: '100g box', packCost: 55, zepto: 55, blinkit: 50, instamart: 58 },
  peanuts: { name: 'Raw Peanuts (Moongfali / Singdana / Shengdana)', portion: '2-3 tbsp', unitCost: 6, packUnit: '200g pack', packCost: 40, zepto: 40, blinkit: 38, instamart: 42 },
  dahi: { name: 'Curd / Yogurt (Dahi / Thayir)', portion: '1/2 cup (100g)', unitCost: 14, packUnit: '400g tub', packCost: 45, zepto: 45, blinkit: 42, instamart: 46 },
  besan: { name: 'Gram Flour (Besan / Kadalai Maavu)', portion: '1/2 cup (60g)', unitCost: 10, packUnit: '500g pouch', packCost: 65, zepto: 65, blinkit: 60, instamart: 68 },
  sooji: { name: 'Semolina (Rava / Sooji)', portion: '1/2 cup (70g)', unitCost: 9, packUnit: '500g pouch', packCost: 45, zepto: 45, blinkit: 42, instamart: 48 },
  atta: { name: 'Whole Wheat Flour (Chakki Atta)', portion: '1 cup', unitCost: 10, packUnit: '1kg bag', packCost: 48, zepto: 48, blinkit: 45, instamart: 50 },
  bread: { name: 'Whole Wheat Bread / Brown Bread', portion: '2-3 slices', unitCost: 10, packUnit: '400g loaf', packCost: 45, zepto: 45, blinkit: 42, instamart: 46 },
  peanutButter: { name: 'Peanut Butter (Crunchy / Creamy)', portion: '2 tbsp (32g)', unitCost: 14, packUnit: '500g jar', packCost: 180, zepto: 175, blinkit: 170, instamart: 185 },
  maggi: { name: 'Maggi 2-Minute Masala Noodles', portion: '1 pack (70g)', unitCost: 14, packUnit: 'Single pack', packCost: 14, zepto: 14, blinkit: 14, instamart: 14 },
  oats: { name: 'Rolled Oats / Masala Oats', portion: '40g', unitCost: 15, packUnit: '400g pack', packCost: 85, zepto: 85, blinkit: 80, instamart: 88 },
  spinach: { name: 'Fresh Spinach (Palak / Keerai)', portion: '1 bunch (200g)', unitCost: 18, packUnit: 'Fresh bunch', packCost: 22, zepto: 22, blinkit: 20, instamart: 24 },
  capsicum: { name: 'Bell Pepper (Capsicum / Shimla Mirch)', portion: '1 medium (sliced)', unitCost: 14, packUnit: '250g pack', packCost: 35, zepto: 35, blinkit: 32, instamart: 38 },
  mushroom: { name: 'Button & Cremini Mushrooms', portion: '100g (sliced)', unitCost: 45, packUnit: '200g punnet', packCost: 85, zepto: 85, blinkit: 80, instamart: 90 },
  avocado: { name: 'Hass Avocado (Imported)', portion: '1/2 to 1 ripe fruit', unitCost: 95, packUnit: '1 pc (180g)', packCost: 110, zepto: 110, blinkit: 105, instamart: 118 },
  dragonfruit: { name: 'Pink Dragon Fruit (Pitaya / Kamalam)', portion: '1 fruit', unitCost: 90, packUnit: '1 pc (350g)', packCost: 110, zepto: 109, blinkit: 105, instamart: 115 },
  blueberries: { name: 'Wild Blueberries / Berries', portion: '40g', unitCost: 55, packUnit: '125g box', packCost: 180, zepto: 180, blinkit: 175, instamart: 185 },
  pasta: { name: 'Italian Pasta (Penne / Spaghetti / Fettuccine)', portion: '90g', unitCost: 32, packUnit: '500g box', packCost: 135, zepto: 135, blinkit: 128, instamart: 140 },
  oliveOil: { name: 'Extra Virgin Olive Oil (Jaitun Ka Tel)', portion: '1-2 tbsp', unitCost: 20, packUnit: '500ml bottle', packCost: 550, zepto: 540, blinkit: 535, instamart: 560 },
  cheese: { name: 'Mozzarella & Cheddar Cheese Block', portion: '40g grated', unitCost: 35, packUnit: '200g block', packCost: 145, zepto: 145, blinkit: 140, instamart: 150 },
  lemon: { name: 'Fresh Lemon / Lime (Nimbu / Limbu)', portion: '1 juicy lemon', unitCost: 4, packUnit: '3 pcs pack', packCost: 18, zepto: 18, blinkit: 16, instamart: 20 },
  kasuriMethi: { name: 'Dried Fenugreek Leaves (Kasuri Methi)', portion: '1 tsp (crushed)', unitCost: 2, packUnit: '50g box', packCost: 35, zepto: 35, blinkit: 32, instamart: 38 },
  hing: { name: 'Asafoetida (Hing / Perungayam)', portion: '1 pinch', unitCost: 1, packUnit: '50g container', packCost: 65, zepto: 65, blinkit: 60, instamart: 68 }
};

// Culinary photographic asset collections
const FOOD_IMAGES = {
  poha: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  curry: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
  paneer: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
  pasta: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
  egg: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
  bowl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  acai: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
  maggi: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80',
  rice: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
  wrap: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  dal: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  mexican: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  pancake: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
  truffle: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281096?auto=format&fit=crop&w=800&q=80',
  asian: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80'
};

// Rich variety of dish archetypes across all cuisines, regions, and diets
const DISH_PATTERNS = [
  // 1. North Indian Curries & Dals
  { name: 'Paneer Butter Masala', cuisine: 'Indian', meal: 'dinner', type: 'paneer', veg: true, equip: ['1 Pan or Kadai'], goals: ['weight-gain', 'high-protein'], tier: 'balanced', baseCost: 95, img: 'paneer', tags: ['kanda', 'pyaz', 'tamatar', 'paneer', 'makhani'] },
  { name: 'Dal Makhani Slow Simmer', cuisine: 'Indian', meal: 'dinner', type: 'dal', veg: true, equip: ['1 Pot or Cooker'], goals: ['high-protein', 'weight-gain'], tier: 'balanced', baseCost: 75, img: 'dal', tags: ['dal', 'rajma', 'butter', 'kanda', 'pyaz'] },
  { name: 'Dhaba Style Tadka Dal Rice', cuisine: 'Indian', meal: 'lunch', type: 'dal', veg: true, equip: ['1 Pan + Rice Pot'], goals: ['weight-loss', 'exam-quick'], tier: 'broke-student', baseCost: 35, img: 'dal', tags: ['dal', 'jeera', 'kanda', 'pyaz', 'chawal', 'tadka'] },
  { name: 'Rajma Masala with Jeera Rice', cuisine: 'Indian', meal: 'lunch', type: 'dal', veg: true, equip: ['1 Cooker or Deep Pan'], goals: ['high-protein', 'weight-loss'], tier: 'balanced', baseCost: 55, img: 'dal', tags: ['rajma', 'chawal', 'kanda', 'tamatar', 'jeera'] },
  { name: 'Amritsari Chole Kulche Bowl', cuisine: 'Indian', meal: 'lunch', type: 'dal', veg: true, equip: ['1 Kadai'], goals: ['high-protein', 'weight-gain'], tier: 'balanced', baseCost: 65, img: 'curry', tags: ['chole', 'kanda', 'kulcha', 'tamatar', 'spicy'] },
  { name: 'Kadai Paneer with Bell Peppers', cuisine: 'Indian', meal: 'dinner', type: 'paneer', veg: true, equip: ['1 Kadai / Pan'], goals: ['high-protein', 'weight-gain'], tier: 'balanced', baseCost: 90, img: 'paneer', tags: ['paneer', 'capsicum', 'kanda', 'shimla mirch'] },
  { name: 'Matar Paneer Homestyle Curry', cuisine: 'Indian', meal: 'dinner', type: 'paneer', veg: true, equip: ['1 Pan'], goals: ['high-protein', 'weight-loss'], tier: 'balanced', baseCost: 70, img: 'paneer', tags: ['paneer', 'matar', 'kanda', 'pyaz', 'tamatar'] },
  { name: 'Aloo Jeera Crispy Roast', cuisine: 'Indian', meal: 'lunch', type: 'curry', veg: true, equip: ['1 Frying Pan'], goals: ['exam-quick', 'weight-gain'], tier: 'broke-student', baseCost: 25, img: 'curry', tags: ['aloo', 'batata', 'jeera', 'dhaniya', 'haldi'] },
  { name: 'Aloo Gobi Matar Sauté', cuisine: 'Indian', meal: 'dinner', type: 'curry', veg: true, equip: ['1 Pan'], goals: ['weight-loss', 'exam-quick'], tier: 'broke-student', baseCost: 32, img: 'curry', tags: ['aloo', 'gobi', 'matar', 'kanda', 'tamatar'] },
  { name: 'Palak Paneer Green Power Curry', cuisine: 'Indian', meal: 'dinner', type: 'paneer', veg: true, equip: ['1 Pan', 'Blender'], goals: ['high-protein', 'weight-loss'], tier: 'balanced', baseCost: 88, img: 'paneer', tags: ['palak', 'paneer', 'lehsun', 'kanda', 'healthy'] },
  { name: 'Butter Chicken Dorm Hack', cuisine: 'Indian', meal: 'dinner', type: 'curry', veg: false, equip: ['1 Pan'], goals: ['high-protein', 'weight-gain'], tier: 'balanced', baseCost: 130, img: 'curry', tags: ['chicken', 'murgh', 'makhani', 'kanda', 'pyaz', 'butter'] },
  { name: 'Spicy Tariwala Chicken Curry', cuisine: 'Indian', meal: 'dinner', type: 'curry', veg: false, equip: ['1 Deep Pot'], goals: ['high-protein', 'weight-loss'], tier: 'balanced', baseCost: 110, img: 'curry', tags: ['chicken', 'kanda', 'tamatar', 'adrak', 'lehsun'] },
  { name: 'Egg Curry with Steamed Rice', cuisine: 'Indian', meal: 'dinner', type: 'egg', veg: false, equip: ['1 Pan'], goals: ['high-protein', 'weight-gain'], tier: 'broke-student', baseCost: 38, img: 'egg', tags: ['ande', 'eggs', 'kanda', 'pyaz', 'tamatar', 'chawal'] },
  { name: 'Soya Keema Masala Bhurji', cuisine: 'Indian', meal: 'lunch', type: 'curry', veg: true, equip: ['1 Pan'], goals: ['high-protein', 'weight-gain', 'weight-loss'], tier: 'broke-student', baseCost: 28, img: 'curry', tags: ['soya', 'keema', 'kanda', 'pyaz', 'tamatar', 'protein'] },

  // 2. Maharashtrian & Mumbai Street Classics
  { name: 'Kanda Poha with Roasted Peanuts', cuisine: 'Indian', meal: 'breakfast', type: 'poha', veg: true, equip: ['1 Pan', 'Strainer'], goals: ['weight-loss', 'exam-quick'], tier: 'broke-student', baseCost: 24, img: 'poha', tags: ['kanda', 'poha', 'singdana', 'moongfali', 'kadi patta', 'limbu'] },
  { name: 'Batata Poha Morning Fuel', cuisine: 'Indian', meal: 'breakfast', type: 'poha', veg: true, equip: ['1 Pan'], goals: ['exam-quick', 'weight-gain'], tier: 'broke-student', baseCost: 26, img: 'poha', tags: ['batata', 'aloo', 'poha', 'kanda', 'rai', 'mirch'] },
  { name: 'Mumbai Tapri Egg Bhurji & Pav', cuisine: 'Indian', meal: 'dinner', type: 'egg', veg: false, equip: ['1 Tawa or Pan'], goals: ['high-protein', 'exam-quick'], tier: 'broke-student', baseCost: 42, img: 'egg', tags: ['ande', 'eggs', 'bhurji', 'kanda', 'pyaz', 'pav', 'tamatar'] },
  { name: 'Paneer Bhurji Street Toast', cuisine: 'Indian', meal: 'breakfast', type: 'paneer', veg: true, equip: ['1 Pan'], goals: ['high-protein', 'weight-gain'], tier: 'balanced', baseCost: 65, img: 'paneer', tags: ['paneer', 'bhurji', 'kanda', 'pyaz', 'pav', 'toast'] },
  { name: 'Misal Pav Sprouted Power Curry', cuisine: 'Indian', meal: 'breakfast', type: 'dal', veg: true, equip: ['1 Pot'], goals: ['high-protein', 'weight-loss'], tier: 'broke-student', baseCost: 35, img: 'curry', tags: ['misal', 'matki', 'farsan', 'kanda', 'limbu', 'rassa'] },
  { name: 'Sabudana Khichdi Peanuts Bowl', cuisine: 'Indian', meal: 'breakfast', type: 'poha', veg: true, equip: ['1 Pan'], goals: ['weight-gain', 'exam-quick'], tier: 'broke-student', baseCost: 30, img: 'poha', tags: ['sabudana', 'singdana', 'batata', 'jeera', 'fasting'] },
  { name: 'Kolhapuri Chicken Sukka', cuisine: 'Indian', meal: 'dinner', type: 'curry', veg: false, equip: ['1 Pan'], goals: ['high-protein', 'weight-gain'], tier: 'balanced', baseCost: 120, img: 'curry', tags: ['chicken', 'sukka', 'kanda', 'coconut', 'spicy'] },

  // 3. South Indian Fast & Nutritious
  { name: 'Masala Dosa Crispy Potato Roll', cuisine: 'Indian', meal: 'breakfast', type: 'poha', veg: true, equip: ['1 Tawa'], goals: ['exam-quick', 'weight-gain'], tier: 'broke-student', baseCost: 35, img: 'curry', tags: ['dosa', 'batata', 'aloo', 'kanda', 'chutney', 'sambar'] },
  { name: 'Rava Upma with Crunchy Peanuts', cuisine: 'Indian', meal: 'breakfast', type: 'poha', veg: true, equip: ['1 Pan'], goals: ['weight-loss', 'exam-quick'], tier: 'broke-student', baseCost: 22, img: 'poha', tags: ['rava', 'sooji', 'kanda', 'rai', 'singdana', 'upma'] },
  { name: 'Tomato Rasam Comfort Soup with Rice', cuisine: 'Indian', meal: 'lunch', type: 'dal', veg: true, equip: ['1 Small Pot'], goals: ['weight-loss', 'exam-quick'], tier: 'broke-student', baseCost: 25, img: 'dal', tags: ['tamatar', 'rasam', 'jeera', 'lehsun', 'chawal'] },
  { name: 'Curd Rice Stomach Soother', cuisine: 'Indian', meal: 'lunch', type: 'rice', veg: true, equip: ['1 Bowl'], goals: ['weight-loss', 'exam-quick'], tier: 'broke-student', baseCost: 22, img: 'rice', tags: ['dahi', 'thayir', 'chawal', 'rai', 'kadi patta'] },
  { name: 'Lemon Rice Peanuts Crunch', cuisine: 'Indian', meal: 'lunch', type: 'rice', veg: true, equip: ['1 Pan'], goals: ['exam-quick', 'weight-loss'], tier: 'broke-student', baseCost: 24, img: 'rice', tags: ['chawal', 'nimbu', 'haldi', 'singdana', 'rai'] },
  { name: 'Andhra Spicy Chicken Vepudu', cuisine: 'Indian', meal: 'dinner', type: 'curry', veg: false, equip: ['1 Kadai'], goals: ['high-protein', 'weight-gain'], tier: 'balanced', baseCost: 125, img: 'curry', tags: ['chicken', 'vepudu', 'kanda', 'mirch', 'curry leaves'] },
  { name: 'Chettinad Pepper Chicken', cuisine: 'Indian', meal: 'dinner', type: 'curry', veg: false, equip: ['1 Pan'], goals: ['high-protein', 'weight-gain'], tier: 'balanced', baseCost: 135, img: 'curry', tags: ['chicken', 'pepper', 'kanda', 'chettinad', 'spicy'] },

  // 4. Quick Student Hacks & Midnight Fuel
  { name: 'Gym Bro 2-Egg Maggi Upgrade', cuisine: 'Indian', meal: 'snack', type: 'maggi', veg: false, equip: ['1 Pan or Kettle'], goals: ['high-protein', 'exam-quick'], tier: 'broke-student', baseCost: 35, img: 'maggi', tags: ['maggi', 'ande', 'eggs', 'kanda', 'pyaz', 'mirch'] },
  { name: 'Cheesy Veggie Butter Maggi', cuisine: 'Indian', meal: 'snack', type: 'maggi', veg: true, equip: ['1 Pan or Kettle'], goals: ['weight-gain', 'exam-quick'], tier: 'broke-student', baseCost: 38, img: 'maggi', tags: ['maggi', 'cheese', 'kanda', 'tamatar', 'butter'] },
  { name: 'Spicy Schezwan Fried Maggi', cuisine: 'Indian', meal: 'snack', type: 'maggi', veg: true, equip: ['1 Pan'], goals: ['exam-quick', 'weight-gain'], tier: 'broke-student', baseCost: 30, img: 'maggi', tags: ['maggi', 'schezwan', 'kanda', 'garlic', 'chili'] },
  { name: 'Masala Oats Power Bowl with Eggs', cuisine: 'Indian', meal: 'breakfast', type: 'egg', veg: false, equip: ['1 Kettle / Pan'], goals: ['high-protein', 'weight-loss', 'exam-quick'], tier: 'broke-student', baseCost: 36, img: 'bowl', tags: ['oats', 'ande', 'eggs', 'kanda', 'pyaz', 'nimbu'] },
  { name: 'Crispy Besan Cheela with Mint Dahi', cuisine: 'Indian', meal: 'breakfast', type: 'poha', veg: true, equip: ['1 Tawa'], goals: ['high-protein', 'weight-loss', 'exam-quick'], tier: 'broke-student', baseCost: 20, img: 'poha', tags: ['besan', 'kanda', 'tamatar', 'ajwain', 'dahi'] },
  { name: 'Tangy Kala Chana Protein Chaat', cuisine: 'Indian', meal: 'snack', type: 'dal', veg: true, equip: ['Mixing Bowl'], goals: ['high-protein', 'weight-loss', 'exam-quick'], tier: 'broke-student', baseCost: 22, img: 'bowl', tags: ['kala chana', 'kanda', 'pyaz', 'tamatar', 'chaat masala'] },
  { name: 'Peanut Butter Banana Power Toast', cuisine: 'Continental', meal: 'brunch', type: 'pancake', veg: true, equip: ['Toaster or Tawa'], goals: ['weight-gain', 'high-protein'], tier: 'broke-student', baseCost: 25, img: 'egg', tags: ['peanut butter', 'banana', 'bread', 'cinnamon'] },
  { name: 'Boiled Egg Chaat with Black Salt', cuisine: 'Indian', meal: 'snack', type: 'egg', veg: false, equip: ['Kettle or Pot'], goals: ['high-protein', 'weight-loss', 'exam-quick'], tier: 'broke-student', baseCost: 22, img: 'egg', tags: ['ande', 'eggs', 'chaat masala', 'nimbu', 'kanda'] },
  { name: 'Butter Garlic Toast with Herbs', cuisine: 'Continental', meal: 'snack', type: 'pasta', veg: true, equip: ['Tawa or Pan'], goals: ['exam-quick', 'weight-gain'], tier: 'broke-student', baseCost: 18, img: 'pasta', tags: ['bread', 'lehsun', 'lasun', 'butter', 'chili flakes'] },

  // 5. Global Italian, Mexican & Pan-Asian
  { name: 'Classic Garlic Chili Aglio e Olio', cuisine: 'Italian', meal: 'dinner', type: 'pasta', veg: true, equip: ['1 Pot', '1 Pan'], goals: ['exam-quick', 'weight-loss'], tier: 'balanced', baseCost: 75, img: 'pasta', tags: ['spaghetti', 'olive oil', 'lehsun', 'lasun', 'chili'] },
  { name: 'Creamy Tuscan Tomato Penne', cuisine: 'Italian', meal: 'dinner', type: 'pasta', veg: true, equip: ['1 Pot', '1 Pan'], goals: ['weight-gain', 'high-protein'], tier: 'balanced', baseCost: 85, img: 'pasta', tags: ['penne', 'tamatar', 'cheese', 'palak', 'lehsun'] },
  { name: 'Truffle Glazed Wild Mushroom Fettuccine', cuisine: 'Italian', meal: 'dinner', type: 'truffle', veg: true, equip: ['1 Pot', '1 Skillet'], goals: ['weight-gain'], tier: 'hifi-gourmet', baseCost: 310, img: 'truffle', tags: ['fettuccine', 'truffle', 'mushrooms', 'parmesan', 'lehsun'] },
  { name: 'Mexican Chipotle Black Bean Bowl', cuisine: 'Mexican', meal: 'lunch', type: 'mexican', veg: true, equip: ['1 Pan'], goals: ['weight-loss', 'exam-quick'], tier: 'balanced', baseCost: 85, img: 'mexican', tags: ['rajma', 'beans', 'chawal', 'tamatar', 'salsa', 'kanda'] },
  { name: 'Cheesy Corn & Bell Pepper Quesadilla', cuisine: 'Mexican', meal: 'lunch', type: 'mexican', veg: true, equip: ['1 Tawa'], goals: ['weight-gain', 'high-protein'], tier: 'balanced', baseCost: 75, img: 'mexican', tags: ['cheese', 'corn', 'capsicum', 'roti', 'kanda'] },
  { name: 'Loaded Chipotle Chicken Fajita Bowl', cuisine: 'Mexican', meal: 'lunch', type: 'mexican', veg: false, equip: ['1 Skillet'], goals: ['high-protein', 'weight-gain'], tier: 'balanced', baseCost: 125, img: 'mexican', tags: ['chicken', 'capsicum', 'kanda', 'chawal', 'salsa'] },
  { name: 'Korean Kimchi Fried Rice with Egg', cuisine: 'Pan-Asian', meal: 'lunch', type: 'rice', veg: false, equip: ['1 Frying Pan / Wok'], goals: ['exam-quick', 'weight-gain'], tier: 'balanced', baseCost: 85, img: 'rice', tags: ['kimchi', 'chawal', 'ande', 'sesame', 'kanda'] },
  { name: 'Japanese Teriyaki Chicken Rice Bowl', cuisine: 'Pan-Asian', meal: 'dinner', type: 'asian', veg: false, equip: ['1 Pan'], goals: ['high-protein', 'weight-gain'], tier: 'balanced', baseCost: 135, img: 'asian', tags: ['chicken', 'teriyaki', 'chawal', 'sesame', 'broccoli'] },
  { name: 'Spicy Garlic Chili Hakka Noodles', cuisine: 'Pan-Asian', meal: 'dinner', type: 'asian', veg: true, equip: ['1 Wok / Kadai'], goals: ['exam-quick', 'weight-gain'], tier: 'balanced', baseCost: 65, img: 'asian', tags: ['noodles', 'kanda', 'capsicum', 'lehsun', 'soy sauce'] },
  { name: 'Crispy Chili Paneer Stir Fry', cuisine: 'Pan-Asian', meal: 'dinner', type: 'paneer', veg: true, equip: ['1 Wok'], goals: ['high-protein', 'weight-gain'], tier: 'balanced', baseCost: 95, img: 'paneer', tags: ['paneer', 'kanda', 'capsicum', 'schezwan', 'lehsun'] },

  // 6. Hi-Fi Luxury Superfood & Gourmet Brunches
  { name: 'Dragon Fruit & Açaí Glow Bowl', cuisine: 'Continental', meal: 'breakfast', type: 'acai', veg: true, equip: ['Blender', 'Serving Bowl'], goals: ['weight-gain', 'high-protein'], tier: 'hifi-gourmet', baseCost: 245, img: 'acai', tags: ['pitaya', 'dragon fruit', 'kamalam', 'dahi', 'blueberries', 'chia'] },
  { name: 'Artisanal Sourdough Avocado & Poached Eggs', cuisine: 'Continental', meal: 'brunch', type: 'egg', veg: false, equip: ['Pan', 'Egg Pot'], goals: ['high-protein', 'weight-loss'], tier: 'hifi-gourmet', baseCost: 220, img: 'egg', tags: ['sourdough', 'avocado', 'ande', 'poached', 'lehsun'] },
  { name: 'Norwegian Teriyaki Salmon Quinoa Bowl', cuisine: 'Pan-Asian', meal: 'lunch', type: 'bowl', veg: false, equip: ['1 Skillet', '1 Pot'], goals: ['high-protein', 'weight-gain'], tier: 'hifi-gourmet', baseCost: 380, img: 'bowl', tags: ['salmon', 'quinoa', 'avocado', 'teriyaki', 'edamame'] },
  { name: 'Almond Butter & Whey Blueberry Pancakes', cuisine: 'Continental', meal: 'brunch', type: 'pancake', veg: true, equip: ['Tawa / Pan'], goals: ['high-protein', 'weight-gain'], tier: 'hifi-gourmet', baseCost: 210, img: 'pancake', tags: ['whey', 'oats', 'almond butter', 'blueberries', 'maple'] },
  { name: 'Mediterranean Shakshuka with Feta & Sourdough', cuisine: 'Middle Eastern', meal: 'brunch', type: 'egg', veg: false, equip: ['1 Skillet with Lid'], goals: ['high-protein', 'weight-loss'], tier: 'hifi-gourmet', baseCost: 195, img: 'egg', tags: ['ande', 'tamatar', 'capsicum', 'feta', 'sourdough'] },
  { name: 'Gourmet Lemon Caper Chicken Piccata', cuisine: 'Italian', meal: 'dinner', type: 'pasta', veg: false, equip: ['1 Pasta Pot', '1 Skillet'], goals: ['high-protein', 'weight-gain'], tier: 'hifi-gourmet', baseCost: 275, img: 'pasta', tags: ['chicken', 'capellini', 'lemon', 'butter', 'lehsun'] }
];

// Stylistic & regional descriptors to generate distinct culinary variants
const REGIONAL_FLAVORS = [
  { prefix: 'Classic Homestyle', costMul: 1.0, calMul: 1.0, timeOffset: 0 },
  { prefix: 'Dhaba Style Spicy', costMul: 1.05, calMul: 1.08, timeOffset: 2 },
  { prefix: '10-Minute Hostel', costMul: 0.95, calMul: 0.95, timeOffset: -3 },
  { prefix: 'High-Protein Double', costMul: 1.25, calMul: 1.15, protBoost: 12, timeOffset: 2 },
  { prefix: 'Cheesy Indulgent', costMul: 1.3, calMul: 1.2, timeOffset: 1 },
  { prefix: 'Mumbai Tapri Spiced', costMul: 1.02, calMul: 1.05, timeOffset: 0 },
  { prefix: 'Clean Eating Low-Cal', costMul: 1.05, calMul: 0.85, timeOffset: -2 },
  { prefix: 'Desi Butter Glazed', costMul: 1.15, calMul: 1.12, timeOffset: 1 },
  { prefix: 'Midnight Exam Special', costMul: 0.98, calMul: 1.02, timeOffset: -4 },
  { prefix: 'Garlic Butter Infused', costMul: 1.1, calMul: 1.06, timeOffset: 1 },
  { prefix: 'Gym Bro Bulk Edition', costMul: 1.35, calMul: 1.25, protBoost: 18, timeOffset: 3 },
  { prefix: 'Street Cart Charred', costMul: 1.08, calMul: 1.04, timeOffset: 2 },
  { prefix: 'Grandma’s Healing', costMul: 0.95, calMul: 0.98, timeOffset: 3 },
  { prefix: 'Zero-Mess Single Pot', costMul: 1.0, calMul: 1.0, timeOffset: -2 },
  { prefix: 'Crispy Tawa Toasted', costMul: 1.02, calMul: 1.03, timeOffset: 0 },
  { prefix: 'Café Aesthetic', costMul: 1.4, calMul: 1.05, timeOffset: 2 },
  { prefix: 'South Coast Coconut', costMul: 1.12, calMul: 1.06, timeOffset: 2 },
  { prefix: 'Fiery Schezwan Tossed', costMul: 1.06, calMul: 1.05, timeOffset: 1 },
  { prefix: 'Creamy Malai Rich', costMul: 1.2, calMul: 1.18, timeOffset: 2 },
  { prefix: 'Quick Induction Pot', costMul: 0.98, calMul: 0.97, timeOffset: -3 }
];

console.log('Generating 1,000+ authentic multi-cuisine recipes with dual local names...');

const generatedRecipes = [];
let recipeIndex = 1;

// Loop across dish patterns and regional flavor variations
for (let variant of REGIONAL_FLAVORS) {
  for (let base of DISH_PATTERNS) {
    const id = `bitecraft-${String(recipeIndex).padStart(4, '0')}`;
    const title = `${variant.prefix} ${base.name}`;
    const cost = Math.round(base.baseCost * variant.costMul);

    let budgetTier = base.tier;
    if (cost < 60) budgetTier = 'broke-student';
    else if (cost <= 150) budgetTier = 'balanced';
    else budgetTier = 'hifi-gourmet';

    const prep = Math.max(3, 8 + variant.timeOffset);
    const cook = Math.max(4, 10 + variant.timeOffset);

    // Calculate realistic macros
    let baseCalories = base.tier === 'broke-student' ? 360 : base.tier === 'balanced' ? 490 : 580;
    let baseProtein = base.goals.includes('high-protein') ? 26 : 14;
    if (base.type === 'paneer' || base.type === 'egg') baseProtein = 24;
    if (base.type === 'curry' && !base.veg) baseProtein = 38;
    if (variant.protBoost) baseProtein += variant.protBoost;

    const calories = Math.round(baseCalories * variant.calMul);
    const protein = Math.round(baseProtein);
    const carbs = Math.round((calories * 0.48) / 4);
    const fats = Math.round((calories - (protein * 4 + carbs * 4)) / 9);
    const fiber = Math.max(3, Math.round(carbs * 0.12));

    // Curate relevant localized ingredients
    const ings = [];
    // Every Indian / savoury dish has Onion (Kanda / Pyaz) & Tomato (Tamatar)
    if (base.cuisine === 'Indian' || base.tags.includes('kanda')) {
      ings.push({
        id: `${id}-ing-1`,
        name: LOCALIZED_INGREDIENTS.onion.name,
        portionAmount: LOCALIZED_INGREDIENTS.onion.portion,
        portionCost: LOCALIZED_INGREDIENTS.onion.unitCost,
        fullPackUnit: LOCALIZED_INGREDIENTS.onion.packUnit,
        fullPackCost: LOCALIZED_INGREDIENTS.onion.packCost,
        quickCommerce: {
          zeptoPrice: LOCALIZED_INGREDIENTS.onion.zepto,
          blinkitPrice: LOCALIZED_INGREDIENTS.onion.blinkit,
          instamartPrice: LOCALIZED_INGREDIENTS.onion.instamart,
          inStock: true
        }
      });
      ings.push({
        id: `${id}-ing-2`,
        name: LOCALIZED_INGREDIENTS.tomato.name,
        portionAmount: LOCALIZED_INGREDIENTS.tomato.portion,
        portionCost: LOCALIZED_INGREDIENTS.tomato.unitCost,
        fullPackUnit: LOCALIZED_INGREDIENTS.tomato.packUnit,
        fullPackCost: LOCALIZED_INGREDIENTS.tomato.packCost,
        quickCommerce: {
          zeptoPrice: LOCALIZED_INGREDIENTS.tomato.zepto,
          blinkitPrice: LOCALIZED_INGREDIENTS.tomato.blinkit,
          instamartPrice: LOCALIZED_INGREDIENTS.tomato.instamart,
          inStock: true
        }
      });
      ings.push({
        id: `${id}-ing-3`,
        name: LOCALIZED_INGREDIENTS.garlic.name,
        portionAmount: LOCALIZED_INGREDIENTS.garlic.portion,
        portionCost: LOCALIZED_INGREDIENTS.garlic.unitCost,
        fullPackUnit: LOCALIZED_INGREDIENTS.garlic.packUnit,
        fullPackCost: LOCALIZED_INGREDIENTS.garlic.packCost,
        quickCommerce: {
          zeptoPrice: LOCALIZED_INGREDIENTS.garlic.zepto,
          blinkitPrice: LOCALIZED_INGREDIENTS.garlic.blinkit,
          instamartPrice: LOCALIZED_INGREDIENTS.garlic.instamart,
          inStock: true
        }
      });
    }

    if (base.type === 'paneer') {
      ings.push({
        id: `${id}-ing-4`,
        name: LOCALIZED_INGREDIENTS.paneer.name,
        portionAmount: LOCALIZED_INGREDIENTS.paneer.portion,
        portionCost: LOCALIZED_INGREDIENTS.paneer.unitCost,
        fullPackUnit: LOCALIZED_INGREDIENTS.paneer.packUnit,
        fullPackCost: LOCALIZED_INGREDIENTS.paneer.packCost,
        quickCommerce: {
          zeptoPrice: LOCALIZED_INGREDIENTS.paneer.zepto,
          blinkitPrice: LOCALIZED_INGREDIENTS.paneer.blinkit,
          instamartPrice: LOCALIZED_INGREDIENTS.paneer.instamart,
          inStock: true
        }
      });
    } else if (base.type === 'egg') {
      ings.push({
        id: `${id}-ing-4`,
        name: LOCALIZED_INGREDIENTS.egg.name,
        portionAmount: LOCALIZED_INGREDIENTS.egg.portion,
        portionCost: LOCALIZED_INGREDIENTS.egg.unitCost,
        fullPackUnit: LOCALIZED_INGREDIENTS.egg.packUnit,
        fullPackCost: LOCALIZED_INGREDIENTS.egg.packCost,
        quickCommerce: {
          zeptoPrice: LOCALIZED_INGREDIENTS.egg.zepto,
          blinkitPrice: LOCALIZED_INGREDIENTS.egg.blinkit,
          instamartPrice: LOCALIZED_INGREDIENTS.egg.instamart,
          inStock: true
        }
      });
    } else if (!base.veg && base.cuisine === 'Indian') {
      ings.push({
        id: `${id}-ing-4`,
        name: LOCALIZED_INGREDIENTS.chicken.name,
        portionAmount: LOCALIZED_INGREDIENTS.chicken.portion,
        portionCost: LOCALIZED_INGREDIENTS.chicken.unitCost,
        fullPackUnit: LOCALIZED_INGREDIENTS.chicken.packUnit,
        fullPackCost: LOCALIZED_INGREDIENTS.chicken.packCost,
        quickCommerce: {
          zeptoPrice: LOCALIZED_INGREDIENTS.chicken.zepto,
          blinkitPrice: LOCALIZED_INGREDIENTS.chicken.blinkit,
          instamartPrice: LOCALIZED_INGREDIENTS.chicken.instamart,
          inStock: true
        }
      });
    } else if (base.type === 'poha') {
      ings.push({
        id: `${id}-ing-4`,
        name: LOCALIZED_INGREDIENTS.poha.name,
        portionAmount: LOCALIZED_INGREDIENTS.poha.portion,
        portionCost: LOCALIZED_INGREDIENTS.poha.unitCost,
        fullPackUnit: LOCALIZED_INGREDIENTS.poha.packUnit,
        fullPackCost: LOCALIZED_INGREDIENTS.poha.packCost,
        quickCommerce: {
          zeptoPrice: LOCALIZED_INGREDIENTS.poha.zepto,
          blinkitPrice: LOCALIZED_INGREDIENTS.poha.blinkit,
          instamartPrice: LOCALIZED_INGREDIENTS.poha.instamart,
          inStock: true
        }
      });
      ings.push({
        id: `${id}-ing-5`,
        name: LOCALIZED_INGREDIENTS.peanuts.name,
        portionAmount: LOCALIZED_INGREDIENTS.peanuts.portion,
        portionCost: LOCALIZED_INGREDIENTS.peanuts.unitCost,
        fullPackUnit: LOCALIZED_INGREDIENTS.peanuts.packUnit,
        fullPackCost: LOCALIZED_INGREDIENTS.peanuts.packCost,
        quickCommerce: {
          zeptoPrice: LOCALIZED_INGREDIENTS.peanuts.zepto,
          blinkitPrice: LOCALIZED_INGREDIENTS.peanuts.blinkit,
          instamartPrice: LOCALIZED_INGREDIENTS.peanuts.instamart,
          inStock: true
        }
      });
    } else if (base.type === 'maggi') {
      ings.push({
        id: `${id}-ing-4`,
        name: LOCALIZED_INGREDIENTS.maggi.name,
        portionAmount: LOCALIZED_INGREDIENTS.maggi.portion,
        portionCost: LOCALIZED_INGREDIENTS.maggi.unitCost,
        fullPackUnit: LOCALIZED_INGREDIENTS.maggi.packUnit,
        fullPackCost: LOCALIZED_INGREDIENTS.maggi.packCost,
        quickCommerce: {
          zeptoPrice: LOCALIZED_INGREDIENTS.maggi.zepto,
          blinkitPrice: LOCALIZED_INGREDIENTS.maggi.blinkit,
          instamartPrice: LOCALIZED_INGREDIENTS.maggi.instamart,
          inStock: true
        }
      });
    } else if (base.type === 'acai') {
      ings.push({
        id: `${id}-ing-4`,
        name: LOCALIZED_INGREDIENTS.dragonfruit.name,
        portionAmount: LOCALIZED_INGREDIENTS.dragonfruit.portion,
        portionCost: LOCALIZED_INGREDIENTS.dragonfruit.unitCost,
        fullPackUnit: LOCALIZED_INGREDIENTS.dragonfruit.packUnit,
        fullPackCost: LOCALIZED_INGREDIENTS.dragonfruit.packCost,
        quickCommerce: {
          zeptoPrice: LOCALIZED_INGREDIENTS.dragonfruit.zepto,
          blinkitPrice: LOCALIZED_INGREDIENTS.dragonfruit.blinkit,
          instamartPrice: LOCALIZED_INGREDIENTS.dragonfruit.instamart,
          inStock: true
        }
      });
      ings.push({
        id: `${id}-ing-5`,
        name: LOCALIZED_INGREDIENTS.blueberries.name,
        portionAmount: LOCALIZED_INGREDIENTS.blueberries.portion,
        portionCost: LOCALIZED_INGREDIENTS.blueberries.unitCost,
        fullPackUnit: LOCALIZED_INGREDIENTS.blueberries.packUnit,
        fullPackCost: LOCALIZED_INGREDIENTS.blueberries.packCost,
        quickCommerce: {
          zeptoPrice: LOCALIZED_INGREDIENTS.blueberries.zepto,
          blinkitPrice: LOCALIZED_INGREDIENTS.blueberries.blinkit,
          instamartPrice: LOCALIZED_INGREDIENTS.blueberries.instamart,
          inStock: true
        }
      });
    } else if (base.type === 'pasta') {
      ings.push({
        id: `${id}-ing-4`,
        name: LOCALIZED_INGREDIENTS.pasta.name,
        portionAmount: LOCALIZED_INGREDIENTS.pasta.portion,
        portionCost: LOCALIZED_INGREDIENTS.pasta.unitCost,
        fullPackUnit: LOCALIZED_INGREDIENTS.pasta.packUnit,
        fullPackCost: LOCALIZED_INGREDIENTS.pasta.packCost,
        quickCommerce: {
          zeptoPrice: LOCALIZED_INGREDIENTS.pasta.zepto,
          blinkitPrice: LOCALIZED_INGREDIENTS.pasta.blinkit,
          instamartPrice: LOCALIZED_INGREDIENTS.pasta.instamart,
          inStock: true
        }
      });
      ings.push({
        id: `${id}-ing-5`,
        name: LOCALIZED_INGREDIENTS.oliveOil.name,
        portionAmount: LOCALIZED_INGREDIENTS.oliveOil.portion,
        portionCost: LOCALIZED_INGREDIENTS.oliveOil.unitCost,
        fullPackUnit: LOCALIZED_INGREDIENTS.oliveOil.packUnit,
        fullPackCost: LOCALIZED_INGREDIENTS.oliveOil.packCost,
        quickCommerce: {
          zeptoPrice: LOCALIZED_INGREDIENTS.oliveOil.zepto,
          blinkitPrice: LOCALIZED_INGREDIENTS.oliveOil.blinkit,
          instamartPrice: LOCALIZED_INGREDIENTS.oliveOil.instamart,
          inStock: true
        }
      });
    } else {
      // Default hearty staple
      ings.push({
        id: `${id}-ing-4`,
        name: LOCALIZED_INGREDIENTS.rice.name,
        portionAmount: LOCALIZED_INGREDIENTS.rice.portion,
        portionCost: LOCALIZED_INGREDIENTS.rice.unitCost,
        fullPackUnit: LOCALIZED_INGREDIENTS.rice.packUnit,
        fullPackCost: LOCALIZED_INGREDIENTS.rice.packCost,
        quickCommerce: {
          zeptoPrice: LOCALIZED_INGREDIENTS.rice.zepto,
          blinkitPrice: LOCALIZED_INGREDIENTS.rice.blinkit,
          instamartPrice: LOCALIZED_INGREDIENTS.rice.instamart,
          inStock: true
        }
      });
    }

    // Always include a fresh finishing herb
    ings.push({
      id: `${id}-ing-end`,
      name: LOCALIZED_INGREDIENTS.coriander.name,
      portionAmount: LOCALIZED_INGREDIENTS.coriander.portion,
      portionCost: LOCALIZED_INGREDIENTS.coriander.unitCost,
      fullPackUnit: LOCALIZED_INGREDIENTS.coriander.packUnit,
      fullPackCost: LOCALIZED_INGREDIENTS.coriander.packCost,
      quickCommerce: {
        zeptoPrice: LOCALIZED_INGREDIENTS.coriander.zepto,
        blinkitPrice: LOCALIZED_INGREDIENTS.coriander.blinkit,
        instamartPrice: LOCALIZED_INGREDIENTS.coriander.instamart,
        inStock: true
      }
    });

    const tags = [
      ...base.tags,
      base.cuisine.toLowerCase(),
      budgetTier,
      'kanda',
      'pyaz',
      'quick grocery',
      variant.prefix.toLowerCase()
    ];

    generatedRecipes.push({
      id,
      title,
      subtitle: `${variant.prefix} preparation of ${base.name} tailored for student kitchens.`,
      description: `Delicious, foolproof ${base.name} with aromatic spices, fresh local ingredients including Onion (Kanda / Pyaz), and complete macro tracking.`,
      cuisine: base.cuisine,
      mealType: base.meal,
      budgetTier,
      estimatedCostPerServing: cost,
      prepTimeMinutes: prep,
      cookTimeMinutes: cook,
      difficulty: prep + cook <= 15 ? 'Super Easy' : prep + cook <= 25 ? 'Easy' : 'Medium',
      isVegetarian: base.veg,
      equipment: base.equip,
      fitnessGoals: base.goals,
      nutrition: { calories, protein, carbs, fats, fiber },
      ingredients: ings,
      steps: [
        {
          stepNumber: 1,
          instruction: `Prep aromatics: finely dice Onion (Kanda / Pyaz), Tomato (Tamatar), and slit green chilies.`,
          timerSeconds: 120,
          beginnerTip: `Keep diced Onion (Kanda) even in size so they brown uniformly without burning!`
        },
        {
          stepNumber: 2,
          instruction: `Heat 1 tsp oil/ghee on medium flame. Sauté aromatics for 3-4 minutes until golden and fragrant.`,
          timerSeconds: 240
        },
        {
          stepNumber: 3,
          instruction: `Toss in primary ingredients and spices. Cook covered for ${cook - 2} minutes.`,
          timerSeconds: (cook - 2) * 60
        },
        {
          stepNumber: 4,
          instruction: `Finish with fresh Coriander Leaves (Dhaniya / Kothimbir) and a generous squeeze of fresh lemon. Serve piping hot!`
        }
      ],
      studentHacks: [
        `If you are out of butter, 1 tsp desi ghee or cooking oil gives a great aroma!`,
        `Ingredients can be ordered with 10-minute instant delivery on Zepto or Blinkit.`
      ],
      imageUrl: FOOD_IMAGES[base.img] || FOOD_IMAGES.curry,
      tags
    });

    recipeIndex++;
  }
}

// Write generated 1000+ recipes to file
const outputPath = path.join(__dirname, '../src/data/recipes_1000.json');
fs.writeFileSync(outputPath, JSON.stringify(generatedRecipes, null, 2), 'utf-8');

console.log(`✅ Successfully generated ${generatedRecipes.length} rich recipes!`);
console.log(`Saved to: ${outputPath}`);
