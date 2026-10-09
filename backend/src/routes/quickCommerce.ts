import { Router, Request, Response } from 'express';
import { RECIPES_DATA } from '../data/recipes.js';
import { QuickCommerceService } from '../services/quickCommerceService.js';

export const quickCommerceRouter = Router();

// GET /api/prices/compare/:recipeId
quickCommerceRouter.get('/compare/:recipeId', (req: Request, res: Response) => {
  const recipe = RECIPES_DATA.find((r) => r.id === req.params.recipeId);
  if (!recipe) {
    res.status(404).json({ error: 'Recipe not found' });
    return;
  }

  const comparison = QuickCommerceService.compareForRecipe(recipe);
  res.json(comparison);
});

// POST /api/prices/compare-cart
quickCommerceRouter.post('/compare-cart', (req: Request, res: Response) => {
  const { ingredients } = req.body;
  if (!ingredients || !Array.isArray(ingredients)) {
    res.status(400).json({ error: 'Ingredients array required' });
    return;
  }

  const comparison = QuickCommerceService.compareIngredients(ingredients);
  res.json(comparison);
});
