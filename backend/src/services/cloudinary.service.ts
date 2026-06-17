import { UploadApiResponse } from 'cloudinary';
import sharp from 'sharp';
import { cloudinary } from '../config/cloudinary';
import { env } from '../config/env';
import { ApiError } from '../utils/apiError';

export async function uploadProductImage(buffer: Buffer, filename: string) {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new ApiError(500, 'Cloudinary is not configured');
  }

  const optimized = await sharp(buffer)
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: env.CLOUDINARY_FOLDER,
        resource_type: 'image',
        public_id: filename.replace(/\.[^/.]+$/, ''),
        overwrite: false,
        transformation: [{ fetch_format: 'auto', quality: 'auto' }]
      },
      (error, response) => {
        if (error || !response) {
          reject(error);
          return;
        }

        resolve(response);
      }
    );

    stream.end(optimized);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes
  };
}
