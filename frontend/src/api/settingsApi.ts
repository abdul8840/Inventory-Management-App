import { apiClient } from './apiClient';
import type { ApiEnvelope } from '../types/api';

export interface UserSettings {
  _id: string;
  theme: 'system' | 'light' | 'dark';
  currency: string;
  locale: string;
  lowStockAlertsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  emailReportsEnabled: boolean;
  defaultLowStockThreshold: number;
}

export async function fetchSettings() {
  const { data } = await apiClient.get<ApiEnvelope<UserSettings>>('/settings');
  return data.data;
}

export async function updateSettings(payload: Partial<UserSettings>) {
  const { data } = await apiClient.patch<ApiEnvelope<UserSettings>>('/settings', payload);
  return data.data;
}
