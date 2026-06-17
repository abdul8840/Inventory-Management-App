import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-config', () => ({
  API_URL: 'http://localhost:5000/api/v1',
  GOOGLE_WEB_CLIENT_ID: 'test-web-client-id'
}));

jest.mock('react-native-chart-kit', () => ({
  LineChart: 'LineChart',
  PieChart: 'PieChart'
}));

jest.mock('react-native-blob-util', () => ({
  fs: { dirs: { DocumentDir: '/tmp' } },
  config: jest.fn(() => ({
    fetch: jest.fn(async () => ({ path: () => '/tmp/inventory-report.csv' }))
  }))
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn()
}));

jest.mock('react-native-vision-camera', () => ({
  Camera: 'Camera',
  useCameraDevice: jest.fn(() => null),
  useCodeScanner: jest.fn(() => null)
}));

jest.mock('@react-native-firebase/auth', () => () => ({
  currentUser: null,
  signOut: jest.fn()
}));

jest.mock('@react-native-firebase/messaging', () => () => ({
  requestPermission: jest.fn(),
  getToken: jest.fn()
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn()
  }
}));

jest.mock('react-native-keychain', () => ({
  ACCESSIBLE: { WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY' },
  getGenericPassword: jest.fn(async () => false),
  setGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn()
}));

it('renders the app shell', () => {
  renderer.create(<App />);
});
