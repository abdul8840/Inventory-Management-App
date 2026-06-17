declare module 'react-native-config' {
  export interface NativeConfig {
    API_URL?: string;
    GOOGLE_WEB_CLIENT_ID?: string;
    IOS_CLIENT_ID?: string;
    ANDROID_CLIENT_ID?: string;
  }

  const Config: NativeConfig;
  export default Config;
}
