import type { Request, Response } from 'express';
import { buildInventoryCsv, buildInventoryPdf } from '../services/report.service';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';

export const exportCsvHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw new ApiError(401, 'Authentication required');
  const csv = await buildInventoryCsv(req.auth.userId);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="inventory-report.csv"');
  res.send(csv);
});

export const exportPdfHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw new ApiError(401, 'Authentication required');
  const pdf = await buildInventoryPdf(req.auth.userId);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="inventory-report.pdf"');
  res.send(pdf);
});
