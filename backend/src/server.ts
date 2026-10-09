import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { recipesRouter } from './routes/recipes.js';
import { quickCommerceRouter } from './routes/quickCommerce.js';
import { plannerRouter } from './routes/planner.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/recipes', recipesRouter);
app.use('/api/prices', quickCommerceRouter);
app.use('/api/planner', plannerRouter);

// Root health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'BiteCraft Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.send({
    message: '🥑 Welcome to BiteCraft API - Food recipes, Nutrition & Quick-Commerce Price Comparator for Students',
    docs: {
      recipes: '/api/recipes',
      meta: '/api/recipes/meta/filters',
      prices: '/api/prices/compare/:recipeId',
      planner: '/api/planner/generate',
      health: '/api/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🥑 BiteCraft API server running on http://localhost:${PORT}`);
});
