import * as Keychain from 'react-native-keychain';
import type { AuthSession } from '../types/user';

const SERVICE = 'inventory_pro_session';

export async function saveSession(session: AuthSession) {
  await Keychain.setGenericPassword('session', JSON.stringify(session), {
    service: SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY
  });
}

export async function getStoredSession(): Promise<AuthSession | null> {
  const credentials = await Keychain.getGenericPassword({ service: SERVICE });
  if (!credentials) return null;

  try {
    return JSON.parse(credentials.password) as AuthSession;
  } catch {
    await clearSession();
    return null;
  }
}

export async function clearSession() {
  await Keychain.resetGenericPassword({ service: SERVICE });
}
