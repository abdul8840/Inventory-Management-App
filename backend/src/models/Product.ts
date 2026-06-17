import { Schema, model, type InferSchemaType, type Types } from 'mongoose';
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from '../constants/categories';
import { calculateProductMetrics } from '../utils/calculations';

const productImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    width: Number,
    height: Number,
    format: String,
    bytes: Number,
    isPrimary: { type: Boolean, default: false }
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 180 },
    description: { type: String, trim: true, maxlength: 3000, default: '' },
    sku: { type: String, required: true, trim: true, uppercase: true },
    barcode: { type: String, trim: true, index: true },
    qrCode: { type: String, trim: true },
    category: { type: String, enum: PRODUCT_CATEGORIES, required: true, index: true },
    images: { type: [productImageSchema], default: [] },
    stockAvailable: { type: Number, required: true, min: 0, default: 0 },
    stockSold: { type: Number, required: true, min: 0, default: 0 },
    purchasePrice: { type: Number, required: true, min: 0, default: 0 },
    sellingPrice: { type: Number, required: true, min: 0, default: 0 },
    totalStock: { type: Number, default: 0 },
    totalPurchaseValue: { type: Number, default: 0 },
    totalSalesValue: { type: Number, default: 0 },
    profitAmount: { type: Number, default: 0 },
    profitMargin: { type: Number, default: 0 },
    lowStockAlertThreshold: { type: Number, required: true, min: 0, default: 5 },
    supplierName: { type: String, trim: true, maxlength: 160, default: '' },
    supplierContact: { type: String, trim: true, maxlength: 160, default: '' },
    status: { type: String, enum: PRODUCT_STATUSES, default: 'active', index: true },
    notes: { type: String, trim: true, maxlength: 5000, default: '' }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.index({ owner: 1, sku: 1 }, { unique: true });
productSchema.index({ owner: 1, category: 1, status: 1 });
productSchema.index({ owner: 1, title: 'text', description: 'text', sku: 'text', barcode: 'text', supplierName: 'text' });

productSchema.pre('validate', function calculateMetrics(next) {
  const metrics = calculateProductMetrics({
    stockAvailable: this.stockAvailable,
    stockSold: this.stockSold,
    purchasePrice: this.purchasePrice,
    sellingPrice: this.sellingPrice
  });

  this.totalStock = metrics.totalStock;
  this.totalPurchaseValue = metrics.totalPurchaseValue;
  this.totalSalesValue = metrics.totalSalesValue;
  this.profitAmount = metrics.profitAmount;
  this.profitMargin = metrics.profitMargin;

  if (this.stockAvailable === 0) {
    this.status = 'out_of_stock';
  } else if (this.status === 'out_of_stock') {
    this.status = 'active';
  }

  next();
});

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
};

export const ProductModel = model('Product', productSchema);
