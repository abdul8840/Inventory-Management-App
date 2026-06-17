import type admin from 'firebase-admin';
import { UserModel } from '../models/User';
import { SettingsModel } from '../models/Settings';

export async function upsertUserFromFirebase(decodedToken: admin.auth.DecodedIdToken) {
  const email = decodedToken.email?.toLowerCase();

  if (!email) {
    throw new Error('Firebase account does not include an email address');
  }

  const user = await UserModel.findOneAndUpdate(
    { firebaseUid: decodedToken.uid },
    {
      $set: {
        name: decodedToken.name || email.split('@')[0],
        email,
        profileImage: decodedToken.picture,
        emailVerified: decodedToken.email_verified ?? false,
        lastLogin: new Date()
      },
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

  await SettingsModel.updateOne(
    { owner: user._id },
    {
      $setOnInsert: {
        owner: user._id
      }
    },
    { upsert: true }
  );

  return user;
}
