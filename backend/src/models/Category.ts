import { Schema, model, type InferSchemaType } from 'mongoose';
import { PRODUCT_CATEGORIES } from '../constants/categories';

const categorySchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    isSystem: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

categorySchema.index({ owner: 1, slug: 1 }, { unique: true });

export type CategoryDocument = InferSchemaType<typeof categorySchema> & { _id: unknown };

export const CategoryModel = model('Category', categorySchema);

export const SYSTEM_CATEGORIES = PRODUCT_CATEGORIES.map((name, index) => ({
  name,
  slug: name.toLowerCase(),
  isSystem: true,
  active: true,
  displayOrder: index
}));
