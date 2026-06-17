import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appConfig } from '../config/env';

GoogleSignin.configure({
  webClientId: appConfig.GOOGLE_WEB_CLIENT_ID,
  iosClientId: appConfig.IOS_CLIENT_ID,
  offlineAccess: false
});

export async function registerWithEmail(name: string, email: string, password: string) {
  const credential = await auth().createUserWithEmailAndPassword(email.trim(), password);
  await credential.user.updateProfile({ displayName: name.trim() });
  await credential.user.sendEmailVerification();
  return credential.user;
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await auth().signInWithEmailAndPassword(email.trim(), password);
  return credential.user;
}

export async function loginWithGoogle() {
  if (!appConfig.GOOGLE_WEB_CLIENT_ID) {
    throw new Error('Google Sign-In is not configured. Add a real GOOGLE_WEB_CLIENT_ID in your mobile environment.');
  }

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const result = await GoogleSignin.signIn();
  const googleResult = result as unknown as { data?: { idToken?: string }; idToken?: string };
  const idToken = googleResult.data?.idToken ?? googleResult.idToken;

  if (!idToken) {
    throw new Error('Google Sign-In did not return an ID token');
  }

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const credential = await auth().signInWithCredential(googleCredential);
  return credential.user;
}

export async function sendPasswordReset(email: string) {
  await auth().sendPasswordResetEmail(email.trim());
}

export async function resendVerificationEmail() {
  const user = auth().currentUser;
  if (!user) throw new Error('No signed-in Firebase user');
  await user.sendEmailVerification();
}

export async function getFreshFirebaseIdToken() {
  const user = auth().currentUser;
  if (!user) throw new Error('No signed-in Firebase user');
  return user.getIdToken(true);
}

export async function logoutFirebase() {
  await Promise.allSettled([auth().signOut(), GoogleSignin.signOut()]);
}
