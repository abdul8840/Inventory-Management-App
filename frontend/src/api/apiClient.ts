import axios from 'axios';
import type { ApiErrorShape } from '../types/api';
import { getStoredSession } from '../services/secureStorage';
import { appConfig } from '../config/env';

export const API_URL = appConfig.API_URL;
export const API_TIMEOUT_MS = 90000;

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(async (config) => {
  const session = await getStoredSession();
  if (session?.token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${session.token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAxios = axios.isAxiosError(error);
    const responseData = isAxios ? (error.response?.data as { message?: string; details?: unknown } | undefined) : undefined;
    const status = isAxios ? error.response?.status : undefined;
    const hint = getErrorHint(responseData?.details);
    let message = responseData?.message || (error instanceof Error ? error.message : 'Something went wrong');

    if (hint && !message.includes(hint)) {
      message = `${message}. ${hint}`;
    }

    if (isAxios && error.code === 'ECONNABORTED') {
      message = 'The server took too long to respond. Please try again; the production backend may be waking up.';
    } else if (isAxios && !error.response && error.message === 'Network Error') {
      message = `Cannot reach the inventory server. Check your internet connection and confirm the backend is live at ${API_URL}.`;
    }

    const normalized: ApiErrorShape = {
      message,
      details: responseData?.details,
      status
    };
    return Promise.reject(normalized);
  }
);
function getErrorHint(details: unknown) {
  if (!details || typeof details !== 'object' || !('hint' in details)) {
    return undefined;
  }

  const hint = (details as { hint?: unknown }).hint;
  return typeof hint === 'string' ? hint : undefined;
}
