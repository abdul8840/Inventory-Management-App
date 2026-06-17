import { Router } from 'express';
import { listNotificationsHandler, markNotificationReadHandler } from '../controllers/notification.controller';
import { requireAuth } from '../middleware/auth';

export const notificationRouter = Router();

notificationRouter.use(requireAuth);
notificationRouter.get('/', listNotificationsHandler);
notificationRouter.patch('/:id/read', markNotificationReadHandler);
