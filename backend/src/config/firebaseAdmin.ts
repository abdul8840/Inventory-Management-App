import admin from 'firebase-admin';
import { env, firebasePrivateKey } from './env';
import { ApiError } from '../utils/apiError';

interface FirebaseServiceAccount {
  project_id?: string;
  client_email?: string;
  private_key?: string;
}

function buildCredential(): admin.credential.Credential {
  if (env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const json = Buffer.from(env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
    const serviceAccount = JSON.parse(json) as FirebaseServiceAccount;
    assertServiceAccountProject(serviceAccount.project_id, 'FIREBASE_SERVICE_ACCOUNT_BASE64');
    return admin.credential.cert(toAdminServiceAccount(serviceAccount, 'FIREBASE_SERVICE_ACCOUNT_BASE64'));
  }

  if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && firebasePrivateKey) {
    assertServiceAccountProject(env.FIREBASE_PROJECT_ID, 'FIREBASE_PROJECT_ID');
    return admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: firebasePrivateKey
    });
  }

  return admin.credential.applicationDefault();
}

export function getFirebaseAdmin(): admin.app.App {
  if (admin.apps.length) {
    return admin.app();
  }

  return admin.initializeApp({
    credential: buildCredential()
  });
}

export async function verifyFirebaseIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  try {
    return await getFirebaseAdmin().auth().verifyIdToken(idToken, true);
  } catch (error) {
    throw normalizeFirebaseAdminError(error);
  }
}

function assertServiceAccountProject(serviceAccountProjectId: string | undefined, source: string) {
  if (!env.FIREBASE_PROJECT_ID || !serviceAccountProjectId || serviceAccountProjectId === env.FIREBASE_PROJECT_ID) {
    return;
  }

  throw new ApiError(500, 'Firebase Admin project mismatch', {
    expectedProjectId: env.FIREBASE_PROJECT_ID,
    serviceAccountProjectId,
    source
  });
}

function toAdminServiceAccount(serviceAccount: FirebaseServiceAccount, source: string): admin.ServiceAccount {
  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new ApiError(500, 'Firebase Admin service account is incomplete', { source });
  }

  return {
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key
  };
}

function normalizeFirebaseAdminError(error: unknown) {
  if (error instanceof ApiError) {
    return error;
  }

  const firebaseError = error as { code?: string; message?: string };
  const message = firebaseError.message ?? 'Firebase token verification failed';

  if (message.includes('incorrect "aud"') || firebaseError.code === 'auth/argument-error') {
    return new ApiError(401, 'Firebase token was issued by a different Firebase project', {
      expectedProjectId: env.FIREBASE_PROJECT_ID,
      hint: 'Use the same Firebase project in the mobile app google-services.json and backend Firebase Admin service account.'
    });
  }

  if (
    firebaseError.code === 'auth/id-token-expired' ||
    firebaseError.code === 'auth/id-token-revoked' ||
    firebaseError.code === 'auth/invalid-id-token'
  ) {
    return new ApiError(401, 'Invalid or expired Firebase session');
  }

  return error instanceof Error ? error : new Error(message);
}
