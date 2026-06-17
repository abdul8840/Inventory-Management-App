import type { Request, Response } from 'express';
import { SettingsModel } from '../models/Settings';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';

export const getSettingsHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw new ApiError(401, 'Authentication required');
  const settings = await SettingsModel.findOneAndUpdate(
    { owner: req.auth.userId },
    { $setOnInsert: { owner: req.auth.userId } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  res.json({ success: true, data: settings });
});

export const updateSettingsHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw new ApiError(401, 'Authentication required');
  const settings = await SettingsModel.findOneAndUpdate(
    { owner: req.auth.userId },
    { $set: req.validated?.body },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  res.json({ success: true, data: settings });
});
