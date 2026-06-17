import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appConfig } from '../config/env';

const firebaseSetupMessage =
  'Firebase is not configured yet. Replace frontend/android/app/google-services.json with the real file from Firebase Console for package com.inventorymobile, then rebuild the app.';

GoogleSignin.configure({
  webClientId: appConfig.GOOGLE_WEB_CLIENT_ID,
  iosClientId: appConfig.IOS_CLIENT_ID,
  offlineAccess: false
});

export async function registerWithEmail(name: string, email: string, password: string) {
  assertFirebaseAppConfigured();

  try {
    const credential = await auth().createUserWithEmailAndPassword(email.trim(), password);
    await credential.user.updateProfile({ displayName: name.trim() });
    await credential.user.sendEmailVerification();
    return credential.user;
  } catch (error) {
    throw normalizeFirebaseAuthError(error);
  }
}

export async function loginWithEmail(email: string, password: string) {
  assertFirebaseAppConfigured();

  try {
    const credential = await auth().signInWithEmailAndPassword(email.trim(), password);
    return credential.user;
  } catch (error) {
    throw normalizeFirebaseAuthError(error);
  }
}

export async function loginWithGoogle() {
  assertFirebaseAppConfigured();

  if (!appConfig.GOOGLE_WEB_CLIENT_ID) {
    throw new Error('Google Sign-In is not configured. Add a real GOOGLE_WEB_CLIENT_ID in frontend/.env and rebuild the app.');
  }

  try {
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
  } catch (error) {
    throw normalizeFirebaseAuthError(error);
  }
}

export async function sendPasswordReset(email: string) {
  assertFirebaseAppConfigured();

  try {
    await auth().sendPasswordResetEmail(email.trim());
  } catch (error) {
    throw normalizeFirebaseAuthError(error);
  }
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

function assertFirebaseAppConfigured() {
  const options = auth().app.options;
  const apiKey = String(options.apiKey ?? '');
  const projectId = String(options.projectId ?? '');
  const appId = String(options.appId ?? '');

  const hasPlaceholder =
    !apiKey ||
    !projectId ||
    !appId ||
    apiKey.includes('your-') ||
    projectId.includes('your-') ||
    appId.includes('000000000000');

  if (hasPlaceholder) {
    throw new Error(firebaseSetupMessage);
  }
}

function normalizeFirebaseAuthError(error: unknown) {
  const firebaseError = error as { code?: string; message?: string };
  const message = firebaseError.message ?? 'Authentication failed. Please try again.';
  const code = firebaseError.code ?? '';

  if (message.includes('API key not valid') || code === 'auth/invalid-api-key') {
    return new Error(firebaseSetupMessage);
  }

  if (code === 'auth/email-already-in-use') {
    return new Error('This email is already registered. Please sign in instead.');
  }

  if (code === 'auth/invalid-email') {
    return new Error('Please enter a valid email address.');
  }

  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return new Error('Invalid email or password.');
  }

  if (code === 'auth/weak-password') {
    return new Error('Password is too weak. Use at least 6 characters.');
  }

  if (code === 'auth/network-request-failed') {
    return new Error('Network error. Check internet connection and try again.');
  }

  return error instanceof Error ? error : new Error(message);
}
