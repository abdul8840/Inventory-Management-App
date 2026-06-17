import type { Types } from 'mongoose';
import { NotificationModel } from '../models/Notification';

export async function createLowStockNotification(owner: string | Types.ObjectId, product: {
  _id: Types.ObjectId;
  title: string;
  stockAvailable: number;
  lowStockAlertThreshold: number;
}) {
  return NotificationModel.create({
    owner,
    type: 'low_stock',
    title: 'Low stock alert',
    body: `${product.title} has ${product.stockAvailable} unit(s) available.`,
    data: {
      productId: product._id,
      threshold: product.lowStockAlertThreshold
    }
  });
}
