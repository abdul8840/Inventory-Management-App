import { Router } from 'express';
import { createSession, getMe, logout, updateAccount } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { firebaseSessionSchema, updateAccountSchema } from '../schemas/auth.schemas';

export const authRouter = Router();

authRouter.post('/session', validate(firebaseSessionSchema), createSession);
authRouter.get('/me', requireAuth, getMe);
authRouter.patch('/account', requireAuth, validate(updateAccountSchema), updateAccount);
authRouter.post('/logout', requireAuth, logout);
