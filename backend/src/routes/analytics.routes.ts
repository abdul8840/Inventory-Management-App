import { Router } from 'express';
import { dashboardAnalyticsHandler } from '../controllers/analytics.controller';
import { requireAuth } from '../middleware/auth';

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);
analyticsRouter.get('/dashboard', dashboardAnalyticsHandler);
