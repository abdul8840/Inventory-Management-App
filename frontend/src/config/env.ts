import { NativeModules, Platform } from 'react-native';

export interface AppConfig {
  API_URL: string;
  GOOGLE_WEB_CLIENT_ID?: string;
  IOS_CLIENT_ID?: string;
  ANDROID_CLIENT_ID?: string;
}

type NativeConfigModule = {
  getConstants?: () => Partial<AppConfig>;
  getConfig?: () => { config?: Partial<AppConfig> } | Partial<AppConfig>;
};

const productionApiUrl = 'https://inventory-management-app-n8s2.onrender.com/api/v1';
const localApiUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api/v1' : 'http://localhost:5000/api/v1';
const fallbackApiUrl = __DEV__ ? localApiUrl : productionApiUrl;

function readNativeConfig(): Partial<AppConfig> {
  const configModule = NativeModules.RNCConfigModule as NativeConfigModule | undefined;

  if (!configModule) {
    return {};
  }

  try {
    const constants = configModule.getConstants?.() ?? {};
    const result = configModule.getConfig?.() ?? {};
    const config = 'config' in result ? result.config ?? {} : result;

    return {
      ...constants,
      ...config
    };
  } catch {
    return {};
  }
}

function clean(value: string | undefined, fallback?: string) {
  if (!value || value.startsWith('your-')) {
    return fallback;
  }

  return value;
}

const nativeConfig = readNativeConfig();

export const appConfig: AppConfig = {
  API_URL: clean(nativeConfig.API_URL, fallbackApiUrl) ?? fallbackApiUrl,
  GOOGLE_WEB_CLIENT_ID: clean(nativeConfig.GOOGLE_WEB_CLIENT_ID),
  IOS_CLIENT_ID: clean(nativeConfig.IOS_CLIENT_ID),
  ANDROID_CLIENT_ID: clean(nativeConfig.ANDROID_CLIENT_ID)
};
