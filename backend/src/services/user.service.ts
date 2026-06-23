import type { DecodedIdToken } from 'firebase-admin/auth';
import { UserModel } from '../models/User';
import { SettingsModel } from '../models/Settings';
import { ApiError } from '../utils/apiError';

export async function upsertUserFromFirebase(decodedToken: DecodedIdToken) {
  const email = decodedToken.email?.toLowerCase();

  if (!email) {
    throw new ApiError(400, 'Firebase account does not include an email address');
  }

  const profile = buildUserProfile(decodedToken, email);

  try {
    const user = await UserModel.findOneAndUpdate(
      { firebaseUid: decodedToken.uid },
      {
        $set: profile,
        $setOnInsert: {
          firebaseUid: decodedToken.uid,
          role: 'owner'
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    await ensureUserSettings(user._id);
    return user;
  } catch (error) {
    if (isMongoDuplicateKeyError(error)) {
      return recoverExistingUserByEmail(decodedToken.uid, email, profile);
    }

    if (isMongoValidationError(error)) {
      throw new ApiError(400, 'Could not create your account profile', {
        hint: 'Check your Firebase display name and email, then try again.'
      });
    }

    throw error;
  }
}

function buildUserProfile(decodedToken: DecodedIdToken, email: string) {
  return {
    name: decodedToken.name || email.split('@')[0],
    email,
    profileImage: decodedToken.picture,
    emailVerified: decodedToken.email_verified ?? false,
    lastLogin: new Date()
  };
}

async function recoverExistingUserByEmail(firebaseUid: string, email: string, profile: ReturnType<typeof buildUserProfile>) {
  const user = await UserModel.findOneAndUpdate(
    { email },
    {
      $set: {
        ...profile,
        firebaseUid
      }
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(409, 'An account with this email already exists. Please sign in with the original provider.');
  }

  await ensureUserSettings(user._id);
  return user;
}

async function ensureUserSettings(owner: unknown) {
  await SettingsModel.updateOne(
    { owner },
    {
      $setOnInsert: {
        owner
      }
    },
    { upsert: true }
  );
}

function isMongoDuplicateKeyError(error: unknown): error is { code: number } {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code?: number }).code === 11000;
}

function isMongoValidationError(error: unknown): error is { name: string } {
  return typeof error === 'object' && error !== null && 'name' in error && (error as { name?: string }).name === 'ValidationError';
}
