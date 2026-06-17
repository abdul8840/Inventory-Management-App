import { Types, type SortOrder } from 'mongoose';
import { ProductModel } from '../models/Product';
import type { AdjustStockInput, CreateProductInput, ListProductsQuery, UpdateProductInput } from '../schemas/product.schemas';
import { ApiError } from '../utils/apiError';
import { createSku } from '../utils/sku';
import { createInventoryLog } from './inventoryLog.service';
import { createLowStockNotification } from './notification.service';

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function resolveSku(owner: string, category: string, suppliedSku?: string) {
  if (suppliedSku) {
    const normalized = suppliedSku.toUpperCase();
    const exists = await ProductModel.exists({ owner, sku: normalized });
    if (exists) {
      throw new ApiError(409, 'A product with this SKU already exists');
    }
    return normalized;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const sku = createSku(category);
    const exists = await ProductModel.exists({ owner, sku });
    if (!exists) {
      return sku;
    }
  }

  throw new ApiError(500, 'Unable to generate a unique SKU');
}

export async function createProduct(owner: string, actor: string, payload: CreateProductInput) {
  const sku = await resolveSku(owner, payload.category, payload.sku);
  const product = await ProductModel.create({
    owner,
    ...payload,
    sku
  });

  await createInventoryLog({
    owner,
    product: product._id,
    actor,
    action: 'created',
    quantityDelta: product.stockAvailable,
    stockAvailableAfter: product.stockAvailable,
    stockSoldAfter: product.stockSold,
    metadata: { sku: product.sku }
  });

  if (product.stockAvailable <= product.lowStockAlertThreshold) {
    await createLowStockNotification(owner, product);
  }

  return product;
}

export async function listProducts(owner: string, query: ListProductsQuery) {
  const filter: Record<string, unknown> = { owner: new Types.ObjectId(owner) };

  if (query.search) {
    const search = new RegExp(escapeRegex(query.search), 'i');
    filter.$or = [{ title: search }, { description: search }, { sku: search }, { barcode: search }, { supplierName: search }];
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.lowStock) {
    filter.$expr = { $lte: ['$stockAvailable', '$lowStockAlertThreshold'] };
  }

  const skip = (query.page - 1) * query.limit;
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1;
  const sort: Record<string, SortOrder> = { [query.sortBy]: sortDirection };

  const [items, total] = await Promise.all([
    ProductModel.find(filter).sort(sort).skip(skip).limit(query.limit).lean(),
    ProductModel.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit)
    }
  };
}

export async function getProductById(owner: string, productId: string) {
  const product = await ProductModel.findOne({ _id: productId, owner });
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return product;
}

export async function updateProduct(owner: string, actor: string, productId: string, payload: UpdateProductInput) {
  const product = await getProductById(owner, productId);
  const before = {
    stockAvailable: product.stockAvailable,
    stockSold: product.stockSold
  };

  if (payload.sku && payload.sku.toUpperCase() !== product.sku) {
    await resolveSku(owner, payload.category || product.category, payload.sku);
    product.sku = payload.sku.toUpperCase();
  }

  Object.assign(product, { ...payload, sku: product.sku });
  await product.save();

  await createInventoryLog({
    owner,
    product: product._id,
    actor,
    action: 'updated',
    stockAvailableBefore: before.stockAvailable,
    stockAvailableAfter: product.stockAvailable,
    stockSoldBefore: before.stockSold,
    stockSoldAfter: product.stockSold,
    metadata: { changedFields: Object.keys(payload) }
  });

  if (product.stockAvailable <= product.lowStockAlertThreshold) {
    await createLowStockNotification(owner, product);
  }

  return product;
}

export async function deleteProduct(owner: string, actor: string, productId: string) {
  const product = await getProductById(owner, productId);
  await product.deleteOne();

  await createInventoryLog({
    owner,
    product: product._id,
    actor,
    action: 'deleted',
    stockAvailableBefore: product.stockAvailable,
    stockSoldBefore: product.stockSold,
    metadata: { sku: product.sku, title: product.title }
  });
}

export async function adjustStock(owner: string, actor: string, productId: string, payload: AdjustStockInput) {
  const product = await getProductById(owner, productId);
  const before = {
    stockAvailable: product.stockAvailable,
    stockSold: product.stockSold
  };

  if (payload.mode === 'record_sale') {
    if (product.stockAvailable < payload.quantity) {
      throw new ApiError(409, 'Not enough available stock to record this sale');
    }
    product.stockAvailable -= payload.quantity;
    product.stockSold += payload.quantity;
  }

  if (payload.mode === 'decrement_available') {
    if (product.stockAvailable < payload.quantity) {
      throw new ApiError(409, 'Stock available cannot be negative');
    }
    product.stockAvailable -= payload.quantity;
  }

  if (payload.mode === 'increment_available' || payload.mode === 'restock') {
    product.stockAvailable += payload.quantity;
  }

  await product.save();

  await createInventoryLog({
    owner,
    product: product._id,
    actor,
    action: payload.mode === 'record_sale' ? 'sale_recorded' : payload.mode === 'restock' ? 'restocked' : 'stock_adjusted',
    quantityDelta: payload.mode === 'record_sale' || payload.mode === 'decrement_available' ? -payload.quantity : payload.quantity,
    stockAvailableBefore: before.stockAvailable,
    stockAvailableAfter: product.stockAvailable,
    stockSoldBefore: before.stockSold,
    stockSoldAfter: product.stockSold,
    note: payload.note
  });

  if (product.stockAvailable <= product.lowStockAlertThreshold) {
    await createLowStockNotification(owner, product);
  }

  return product;
}

export async function bulkUpdateProducts(owner: string, actor: string, input: {
  productIds: string[];
  action: 'delete' | 'set_status' | 'set_category';
  status?: string;
  category?: string;
}) {
  const filter = { owner, _id: { $in: input.productIds } };

  if (input.action === 'delete') {
    const result = await ProductModel.deleteMany(filter);
    await createInventoryLog({
      owner,
      actor,
      action: 'bulk_updated',
      metadata: { action: input.action, count: result.deletedCount, productIds: input.productIds }
    });
    return { affected: result.deletedCount };
  }

  const update: Record<string, string | undefined> = {};
  if (input.action === 'set_status') update.status = input.status;
  if (input.action === 'set_category') update.category = input.category;

  const result = await ProductModel.updateMany(filter, { $set: update });
  await createInventoryLog({
    owner,
    actor,
    action: 'bulk_updated',
    metadata: { action: input.action, update, count: result.modifiedCount, productIds: input.productIds }
  });

  return { affected: result.modifiedCount };
}

export function serializeProduct(product: { toJSON: () => unknown }) {
  return product.toJSON();
}
