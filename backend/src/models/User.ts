import { Schema, model, type InferSchemaType } from 'mongoose';
import { USER_ROLES } from '../constants/roles';

const userSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    profileImage: { type: String, trim: true },
    role: { type: String, enum: USER_ROLES, default: 'owner', index: true },
    emailVerified: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: unknown };

export const UserModel = model('User', userSchema);
