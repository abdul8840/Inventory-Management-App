import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

export const INVENTORY_ACTIONS = [
  'created',
  'updated',
  'deleted',
  'stock_adjusted',
  'sale_recorded',
  'restocked',
  'bulk_updated',
  'image_uploaded'
] as const;

const inventoryLogSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', index: true },
    actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: INVENTORY_ACTIONS, required: true, index: true },
    quantityDelta: { type: Number, default: 0 },
    stockAvailableBefore: Number,
    stockAvailableAfter: Number,
    stockSoldBefore: Number,
    stockSoldAfter: Number,
    note: { type: String, trim: true, maxlength: 1000, default: '' },
    metadata: { type: Schema.Types.Mixed, default: {} }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false
  }
);

inventoryLogSchema.index({ owner: 1, createdAt: -1 });

export type InventoryLogDocument = InferSchemaType<typeof inventoryLogSchema> & {
  _id: Types.ObjectId;
};

export const InventoryLogModel = model('InventoryLog', inventoryLogSchema);
