import { Schema, model, type InferSchemaType } from 'mongoose';

const settingsSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    theme: { type: String, enum: ['system', 'light', 'dark'], default: 'system' },
    currency: { type: String, default: 'USD', uppercase: true, minlength: 3, maxlength: 3 },
    locale: { type: String, default: 'en-US' },
    lowStockAlertsEnabled: { type: Boolean, default: true },
    pushNotificationsEnabled: { type: Boolean, default: true },
    emailReportsEnabled: { type: Boolean, default: false },
    defaultLowStockThreshold: { type: Number, min: 0, default: 5 }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type SettingsDocument = InferSchemaType<typeof settingsSchema> & { _id: unknown };

export const SettingsModel = model('Settings', settingsSchema);
