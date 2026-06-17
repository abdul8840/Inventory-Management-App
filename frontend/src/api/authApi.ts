import { apiClient } from './apiClient';
import type { ApiEnvelope } from '../types/api';
import type { AppUser, AuthSession } from '../types/user';

export async function createBackendSession(idToken: string) {
  const { data } = await apiClient.post<ApiEnvelope<AuthSession>>('/auth/session', { idToken });
  return data.data;
}

export async function getCurrentUser() {
  const { data } = await apiClient.get<ApiEnvelope<AppUser>>('/auth/me');
  return data.data;
}

export async function updateAccount(payload: Pick<AppUser, 'name'> & { profileImage?: string }) {
  const { data } = await apiClient.patch<ApiEnvelope<AppUser>>('/auth/account', payload);
  return data.data;
}

export async function logoutBackend() {
  await apiClient.post('/auth/logout');
}
