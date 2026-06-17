import type { UserRole } from '../constants/roles';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        firebaseUid: string;
        role: UserRole;
        email: string;
        name?: string;
      };
      validated?: {
        body?: any;
        query?: any;
        params?: any;
      };
    }
  }
}

export {};
