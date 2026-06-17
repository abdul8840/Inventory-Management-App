import { Router } from 'express';
import { analyticsRouter } from './analytics.routes';
import { authRouter } from './auth.routes';
import { categoryRouter } from './category.routes';
import { notificationRouter } from './notification.routes';
import { productRouter } from './product.routes';
import { reportRouter } from './report.routes';
import { settingsRouter } from './settings.routes';
import { uploadRouter } from './upload.routes';

export const apiRouter = Router();

apiRouter.get('/health', (_req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/notifications', notificationRouter);
apiRouter.use('/reports', reportRouter);
apiRouter.use('/settings', settingsRouter);
apiRouter.use('/uploads', uploadRouter);
