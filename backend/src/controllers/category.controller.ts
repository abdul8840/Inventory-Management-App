import type { Request, Response } from 'express';
import { SYSTEM_CATEGORIES } from '../models/Category';
import { asyncHandler } from '../utils/asyncHandler';

export const listCategoriesHandler = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ success: true, data: SYSTEM_CATEGORIES });
});
