import { Types } from 'mongoose';
import { InventoryLogModel } from '../models/InventoryLog';
import { ProductModel } from '../models/Product';

export async function getDashboardAnalytics(owner: string) {
  const ownerId = new Types.ObjectId(owner);

  const [summary] = await ProductModel.aggregate([
    { $match: { owner: ownerId } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalInventoryValue: { $sum: '$totalPurchaseValue' },
        totalSalesValue: { $sum: '$totalSalesValue' },
        totalProfit: { $sum: '$profitAmount' },
        totalStockAvailable: { $sum: '$stockAvailable' },
        lowStockProducts: {
          $sum: {
            $cond: [{ $lte: ['$stockAvailable', '$lowStockAlertThreshold'] }, 1, 0]
          }
        }
      }
    }
  ]);

  const [categoryDistribution, recentActivities, salesAnalytics, lowStockItems] = await Promise.all([
    ProductModel.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          stockAvailable: { $sum: '$stockAvailable' },
          inventoryValue: { $sum: '$totalPurchaseValue' }
        }
      },
      { $sort: { count: -1 } }
    ]),
    InventoryLogModel.find({ owner }).sort({ createdAt: -1 }).limit(10).populate('product', 'title sku images').lean(),
    InventoryLogModel.aggregate([
      {
        $match: {
          owner: ownerId,
          action: 'sale_recorded',
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          unitsSold: { $sum: { $abs: '$quantityDelta' } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]),
    ProductModel.find({
      owner,
      $expr: { $lte: ['$stockAvailable', '$lowStockAlertThreshold'] }
    })
      .sort({ stockAvailable: 1 })
      .limit(8)
      .lean()
  ]);

  return {
    summary: {
      totalProducts: summary?.totalProducts ?? 0,
      totalInventoryValue: summary?.totalInventoryValue ?? 0,
      totalSalesValue: summary?.totalSalesValue ?? 0,
      totalProfit: summary?.totalProfit ?? 0,
      totalStockAvailable: summary?.totalStockAvailable ?? 0,
      lowStockProducts: summary?.lowStockProducts ?? 0
    },
    categoryDistribution,
    recentActivities,
    salesAnalytics,
    lowStockItems
  };
}
