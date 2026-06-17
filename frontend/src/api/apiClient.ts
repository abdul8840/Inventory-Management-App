import axios from 'axios';
import type { ApiErrorShape } from '../types/api';
import { getStoredSession } from '../services/secureStorage';
import { appConfig } from '../config/env';

export const API_URL = appConfig.API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 20000,
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
    const normalized: ApiErrorShape = {
      message: error.response?.data?.message || error.message || 'Something went wrong',
      details: error.response?.data?.details,
      status: error.response?.status
    };
    return Promise.reject(normalized);
  }
);
