import { Schema, model, type InferSchemaType } from 'mongoose';

const notificationSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['low_stock', 'system', 'export_ready', 'account', 'inventory'],
      required: true,
      index: true
    },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    body: { type: String, required: true, trim: true, maxlength: 1000 },
    data: { type: Schema.Types.Mixed, default: {} },
    readAt: { type: Date }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false
  }
);

notificationSchema.index({ owner: 1, readAt: 1, createdAt: -1 });

export type NotificationDocument = InferSchemaType<typeof notificationSchema> & { _id: unknown };

export const NotificationModel = model('Notification', notificationSchema);
