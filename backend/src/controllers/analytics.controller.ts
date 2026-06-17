import type { Request, Response } from 'express';
import { getDashboardAnalytics } from '../services/analytics.service';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';

export const dashboardAnalyticsHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw new ApiError(401, 'Authentication required');
  const data = await getDashboardAnalytics(req.auth.userId);
  res.json({ success: true, data });
});
