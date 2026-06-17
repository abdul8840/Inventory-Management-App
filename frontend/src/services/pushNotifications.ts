import messaging from '@react-native-firebase/messaging';

export async function registerForPushNotifications() {
  const status = await messaging().requestPermission();
  const enabled =
    status === messaging.AuthorizationStatus.AUTHORIZED || status === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    return null;
  }

  return messaging().getToken();
}
