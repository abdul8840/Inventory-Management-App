import { Router } from 'express';
import { getSettingsHandler, updateSettingsHandler } from '../controllers/settings.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateSettingsSchema } from '../schemas/settings.schemas';

export const settingsRouter = Router();

settingsRouter.use(requireAuth);
settingsRouter.get('/', getSettingsHandler);
settingsRouter.patch('/', validate(updateSettingsSchema), updateSettingsHandler);
