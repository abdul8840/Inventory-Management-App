import { apiClient } from './apiClient';
import type { ApiEnvelope } from '../types/api';
import type { Product } from '../types/product';

export interface DashboardAnalytics {
  summary: {
    totalProducts: number;
    totalInventoryValue: number;
    totalSalesValue: number;
    totalProfit: number;
    totalStockAvailable: number;
    lowStockProducts: number;
  };
  categoryDistribution: Array<{ _id: string; count: number; stockAvailable: number; inventoryValue: number }>;
  recentActivities: Array<Record<string, unknown>>;
  salesAnalytics: Array<{ _id: { year: number; month: number; day: number }; unitsSold: number }>;
  lowStockItems: Product[];
}

export async function fetchDashboardAnalytics() {
  const { data } = await apiClient.get<ApiEnvelope<DashboardAnalytics>>('/analytics/dashboard');
  return data.data;
}
