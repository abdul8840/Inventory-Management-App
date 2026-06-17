import { Router } from 'express';
import { uploadProductImageHandler } from '../controllers/upload.controller';
import { requireAuth } from '../middleware/auth';
import { imageUpload } from '../middleware/upload';

export const uploadRouter = Router();

uploadRouter.use(requireAuth);
uploadRouter.post('/product-image', imageUpload.single('image'), uploadProductImageHandler);
