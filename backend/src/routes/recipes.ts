import { Router, Request, Response } from 'express';
import { RECIPES_DATA } from '../data/recipes.js';
import { BudgetTier, CuisineType, FitnessGoal, MealType } from '../types.js';

export const recipesRouter = Router();

// GET /api/recipes - Filter and list recipes
recipesRouter.get('/', (req: Request, res: Response) => {
  const {
    budgetTier,
    fitnessGoal,
    cuisine,
    mealType,
    maxTime,
    isVegetarian,
    search
  } = req.query;

  let results = [...RECIPES_DATA];

  if (budgetTier && typeof budgetTier === 'string') {
    results = results.filter((r) => r.budgetTier === budgetTier);
  }

  if (fitnessGoal && typeof fitnessGoal === 'string') {
    results = results.filter((r) => r.fitnessGoals.includes(fitnessGoal as FitnessGoal));
  }

  if (cuisine && typeof cuisine === 'string') {
    results = results.filter((r) => r.cuisine.toLowerCase() === cuisine.toLowerCase());
  }

  if (mealType && typeof mealType === 'string') {
    results = results.filter((r) => r.mealType === mealType);
  }

  if (maxTime) {
    const maxMinutes = parseInt(maxTime as string, 10);
    if (!isNaN(maxMinutes)) {
      results = results.filter(
        (r) => r.prepTimeMinutes + r.cookTimeMinutes <= maxMinutes
      );
    }
  }

  if (isVegetarian === 'true') {
    results = results.filter((r) => r.isVegetarian);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(q))
    );
  }

  res.json({
    count: results.length,
    recipes: results
  });
});

// GET /api/recipes/meta/filters - Metadata options for frontend pills and dropdowns
recipesRouter.get('/meta/filters', (_req: Request, res: Response) => {
  res.json({
    budgetTiers: [
      { id: 'broke-student', label: '💸 Broke Student (< ₹60)', maxCost: 60, color: '#10b981' },
      { id: 'balanced', label: '⚖️ Balanced (₹60 - ₹150)', minCost: 60, maxCost: 150, color: '#f59e0b' },
      { id: 'hifi-gourmet', label: '✨ Hi-Fi Gourmet (₹150+)', minCost: 150, color: '#8b5cf6' }
    ],
    fitnessGoals: [
      { id: 'weight-gain', label: '💪 Muscle / Weight Gain', icon: 'trending-up', desc: 'Caloric surplus, muscle growth' },
      { id: 'weight-loss', label: '🔥 Fat / Weight Loss', icon: 'flame', desc: 'High satiety, high volume' },
      { id: 'high-protein', label: '⚡ High Protein (20g+)', icon: 'zap', desc: 'Lean fuel for gym lovers' },
      { id: 'exam-quick', label: '⏱️ 15-Min Exam Prep', icon: 'clock', desc: 'Quick & zero dishes' }
    ],
    cuisines: [
      'Indian',
      'Italian',
      'Pan-Asian',
      'Mexican',
      'Continental',
      'Middle Eastern'
    ],
    mealTypes: ['breakfast', 'brunch', 'lunch', 'snack', 'dinner']
  });
});

// GET /api/recipes/:id - Single recipe detail
recipesRouter.get('/:id', (req: Request, res: Response) => {
  const recipe = RECIPES_DATA.find((r) => r.id === req.params.id);
  if (!recipe) {
    res.status(404).json({ error: 'Recipe not found' });
    return;
  }
  res.json(recipe);
});
