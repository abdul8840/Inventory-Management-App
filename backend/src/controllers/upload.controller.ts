import type { Request, Response } from 'express';
import { uploadProductImage } from '../services/cloudinary.service';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';

export const uploadProductImageHandler = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, 'Image file is required');
  }

  const data = await uploadProductImage(req.file.buffer, req.file.originalname);
  res.status(201).json({ success: true, data });
});
