import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../constants/roles';
import { ApiError } from '../utils/apiError';

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!roles.includes(req.auth.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }

    return next();
  };
}
