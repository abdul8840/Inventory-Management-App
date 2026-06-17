import admin from 'firebase-admin';
import { env, firebasePrivateKey } from './env';

function buildCredential(): admin.credential.Credential {
  if (env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const json = Buffer.from(env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
    return admin.credential.cert(JSON.parse(json));
  }

  if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && firebasePrivateKey) {
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
  return getFirebaseAdmin().auth().verifyIdToken(idToken, true);
}
