import { Router } from 'express';
import { exportCsvHandler, exportPdfHandler } from '../controllers/report.controller';
import { requireAuth } from '../middleware/auth';

export const reportRouter = Router();

reportRouter.use(requireAuth);
reportRouter.get('/inventory.csv', exportCsvHandler);
reportRouter.get('/inventory.pdf', exportPdfHandler);
