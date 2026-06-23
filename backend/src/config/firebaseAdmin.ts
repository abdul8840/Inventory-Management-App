import {
  applicationDefault,
  cert,
  getApp,
  getApps,
  initializeApp,
  type App,
  type AppOptions,
  type Credential,
  type ServiceAccount
} from 'firebase-admin/app';
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth';
import { env, firebasePrivateKey } from './env';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

interface FirebaseServiceAccount {
  project_id?: string;
  client_email?: string;
  private_key?: string;
}

let hasFirebaseAdminCredential = false;

function buildCredential(): Credential | undefined {
  if (env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const serviceAccount = parseServiceAccountBase64(env.FIREBASE_SERVICE_ACCOUNT_BASE64);
    warnWhenServiceAccountProjectDiffers(serviceAccount.project_id, 'FIREBASE_SERVICE_ACCOUNT_BASE64');
    hasFirebaseAdminCredential = true;
    return cert(toAdminServiceAccount(serviceAccount, 'FIREBASE_SERVICE_ACCOUNT_BASE64'));
  }

  if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && firebasePrivateKey) {
    hasFirebaseAdminCredential = true;
    return cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: firebasePrivateKey
    });
  }

  if (env.NODE_ENV !== 'production') {
    hasFirebaseAdminCredential = true;
    return applicationDefault();
  }

  hasFirebaseAdminCredential = false;
  return undefined;
}

export function getFirebaseAdmin(): App {
  if (getApps().length) {
    return getApp();
  }

  const credential = buildCredential();
  const options: AppOptions = {
    ...(credential ? { credential } : {}),
    ...(env.FIREBASE_PROJECT_ID ? { projectId: env.FIREBASE_PROJECT_ID } : {})
  };

  if (!options.projectId && !credential) {
    throw new ApiError(500, 'Firebase Admin is not configured on the backend', {
      hint: 'Set FIREBASE_PROJECT_ID and FIREBASE_SERVICE_ACCOUNT_BASE64 on Render, then redeploy.'
    });
  }

  return initializeApp(options);
}

export async function verifyFirebaseIdToken(idToken: string): Promise<DecodedIdToken> {
  const authClient = getAuth(getFirebaseAdmin());

  try {
    return await authClient.verifyIdToken(idToken, hasFirebaseAdminCredential);
  } catch (error) {
    if (hasFirebaseAdminCredential && shouldRetryWithoutRevocationCheck(error)) {
      logger.warn({ error }, 'Firebase token revocation check failed; retrying signature verification only');
      try {
        return await authClient.verifyIdToken(idToken, false);
      } catch (retryError) {
        throw normalizeFirebaseAdminError(retryError);
      }
    }

    throw normalizeFirebaseAdminError(error);
  }
}

function parseServiceAccountBase64(encoded: string): FirebaseServiceAccount {
  try {
    const json = Buffer.from(encoded, 'base64').toString('utf8');
    return JSON.parse(json) as FirebaseServiceAccount;
  } catch {
    throw new ApiError(500, 'Firebase Admin service account is not valid base64 JSON', {
      source: 'FIREBASE_SERVICE_ACCOUNT_BASE64',
      hint: 'Download a fresh Firebase service account JSON file, base64 encode the full JSON, and update the Render environment variable.'
    });
  }
}

function warnWhenServiceAccountProjectDiffers(serviceAccountProjectId: string | undefined, source: string) {
  if (!env.FIREBASE_PROJECT_ID || !serviceAccountProjectId || serviceAccountProjectId === env.FIREBASE_PROJECT_ID) {
    return;
  }

  logger.warn(
    {
      expectedProjectId: env.FIREBASE_PROJECT_ID,
      serviceAccountProjectId,
      source
    },
    'Firebase Admin service account project differs from configured Firebase project'
  );
}

function toAdminServiceAccount(serviceAccount: FirebaseServiceAccount, source: string): ServiceAccount {
  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new ApiError(500, 'Firebase Admin service account is incomplete', {
      source,
      hint: 'The service account JSON must include project_id, client_email, and private_key.'
    });
  }

  return {
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key
  };
}

function shouldRetryWithoutRevocationCheck(error: unknown) {
  const firebaseError = error as { code?: string; message?: string };
  const message = firebaseError.message ?? '';
  const normalized = message.toLowerCase();

  return (
    isFirebaseCredentialError(message, firebaseError.code) ||
    firebaseError.code === 'auth/insufficient-permission' ||
    normalized.includes('insufficient permission') ||
    normalized.includes('permission denied') ||
    normalized.includes('access token')
  );
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
      hint: 'Set Render FIREBASE_PROJECT_ID to the same project_id used in frontend/android/app/google-services.json, then redeploy.'
    });
  }

  if (
    firebaseError.code === 'auth/id-token-expired' ||
    firebaseError.code === 'auth/id-token-revoked' ||
    firebaseError.code === 'auth/invalid-id-token'
  ) {
    return new ApiError(401, 'Invalid or expired Firebase session');
  }

  if (isFirebaseCredentialError(message, firebaseError.code)) {
    return new ApiError(500, 'Firebase Admin credentials are invalid on the backend', {
      code: firebaseError.code,
      hint: 'Update Render FIREBASE_SERVICE_ACCOUNT_BASE64 using a service account from the same Firebase project as the mobile app.'
    });
  }

  return new ApiError(500, 'Firebase Admin could not verify the session token', {
    code: firebaseError.code,
    hint: 'Check the Firebase Admin environment variables on Render and redeploy.'
  });
}

function isFirebaseCredentialError(message: string, code?: string) {
  const normalized = message.toLowerCase();

  return (
    code === 'app/invalid-credential' ||
    normalized.includes('could not load the default credentials') ||
    normalized.includes('failed to parse private key') ||
    normalized.includes('invalid credential') ||
    normalized.includes('client_email') ||
    normalized.includes('private_key') ||
    normalized.includes('decoder routines')
  );
}
