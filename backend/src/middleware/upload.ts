import multer from 'multer';
import { ApiError } from '../utils/apiError';

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 1
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(new ApiError(415, 'Only image uploads are supported'));
      return;
    }

    callback(null, true);
  }
});
