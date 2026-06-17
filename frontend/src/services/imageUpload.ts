import type { Asset } from 'react-native-image-picker';
import { uploadProductImage } from '../api/productApi';

export async function uploadSelectedProductImage(asset: Asset) {
  if (!asset.uri) {
    throw new Error('Selected image is missing a local URI');
  }

  return uploadProductImage(asset.uri, asset.fileName || 'product.jpg', asset.type || 'image/jpeg');
}
