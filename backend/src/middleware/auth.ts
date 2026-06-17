import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { UserModel } from '../models/User';
import type { UserRole } from '../constants/roles';
import { ApiError } from '../utils/apiError';

export interface AppJwtPayload extends JwtPayload {
  uid: string;
  userId: string;
  role: UserRole;
  email: string;
  name?: string;
}

export function signAppJwt(payload: Omit<AppJwtPayload, 'iat' | 'exp'>): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    subject: payload.userId
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

    if (!token) {
      throw new ApiError(401, 'Authentication token is required');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as AppJwtPayload;
    const user = await UserModel.findOne({
      _id: decoded.userId,
      firebaseUid: decoded.uid,
      disabled: false
    }).lean();

    if (!user) {
      throw new ApiError(401, 'User session is no longer valid');
    }

    req.auth = {
      userId: String(user._id),
      firebaseUid: user.firebaseUid,
      role: user.role as UserRole,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    next(new ApiError(401, 'Invalid or expired authentication token'));
  }
}
