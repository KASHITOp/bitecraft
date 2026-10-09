import { Router, Request, Response } from 'express';
import { PlannerService } from '../services/plannerService.js';
import { DayPlanRequest } from '../types.js';

export const plannerRouter = Router();

// POST /api/planner/generate
plannerRouter.post('/generate', (req: Request, res: Response) => {
  const planRequest: DayPlanRequest = {
    budgetTier: req.body.budgetTier,
    targetDailyBudget: req.body.targetDailyBudget ? Number(req.body.targetDailyBudget) : undefined,
    fitnessGoal: req.body.fitnessGoal || 'high-protein',
    isVegetarianOnly: req.body.isVegetarianOnly === true || req.body.isVegetarianOnly === 'true'
  };

  const plan = PlannerService.generateDayPlan(planRequest);
  res.json(plan);
});
