import type { Request, Response } from 'express';
import { verifyFirebaseIdToken } from '../config/firebaseAdmin';
import { UserModel } from '../models/User';
import { signAppJwt } from '../middleware/auth';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import { upsertUserFromFirebase } from '../services/user.service';

export const createSession = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.validated?.body as { idToken: string };
  const decodedToken = await verifyFirebaseIdToken(idToken);
  const user = await upsertUserFromFirebase(decodedToken);

  const token = signAppJwt({
    uid: user.firebaseUid,
    userId: String(user._id),
    role: user.role,
    email: user.email,
    name: user.name
  });

  res.status(200).json({
    success: true,
    data: {
      token,
      user
    }
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw new ApiError(401, 'Authentication required');
  const user = await UserModel.findById(req.auth.userId).lean();
  res.json({ success: true, data: user });
});

export const updateAccount = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw new ApiError(401, 'Authentication required');
  const user = await UserModel.findByIdAndUpdate(req.auth.userId, { $set: req.validated?.body }, { new: true }).lean();
  res.json({ success: true, data: user });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Session removed on client'
  });
});
