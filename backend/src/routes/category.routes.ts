import { Router } from 'express';
import { listCategoriesHandler } from '../controllers/category.controller';
import { requireAuth } from '../middleware/auth';

export const categoryRouter = Router();

categoryRouter.get('/', requireAuth, listCategoriesHandler);
