import { apiClient } from './apiClient';
import type { ApiEnvelope } from '../types/api';

export interface AppNotification {
  _id: string;
  type: 'low_stock' | 'system' | 'export_ready' | 'account' | 'inventory';
  title: string;
  body: string;
  readAt?: string;
  createdAt: string;
  data?: Record<string, unknown>;
}

export async function fetchNotifications() {
  const { data } = await apiClient.get<ApiEnvelope<AppNotification[]>>('/notifications');
  return data.data;
}

export async function markNotificationRead(notificationId: string) {
  const { data } = await apiClient.patch<ApiEnvelope<AppNotification>>(`/notifications/${notificationId}/read`);
  return data.data;
}
