import type { Request, Response } from 'express';
import { NotificationModel } from '../models/Notification';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';

export const listNotificationsHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw new ApiError(401, 'Authentication required');
  const notifications = await NotificationModel.find({ owner: req.auth.userId }).sort({ createdAt: -1 }).limit(50).lean();
  res.json({ success: true, data: notifications });
});

export const markNotificationReadHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw new ApiError(401, 'Authentication required');
  const notification = await NotificationModel.findOneAndUpdate(
    { _id: req.params.id, owner: req.auth.userId },
    { $set: { readAt: new Date() } },
    { new: true }
  ).lean();

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  res.json({ success: true, data: notification });
});
