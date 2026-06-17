import { z } from 'zod';
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from '../constants/categories';
import { booleanQuerySchema, mongoIdSchema } from './shared.schemas';

const productImageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
  width: z.number().optional(),
  height: z.number().optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
  isPrimary: z.boolean().default(false)
});

const productBaseSchema = z.object({
  title: z.string().min(2).max(180),
  description: z.string().max(3000).default(''),
  sku: z.string().min(3).max(80).optional(),
  barcode: z.string().max(120).optional(),
  qrCode: z.string().max(200).optional(),
  category: z.enum(PRODUCT_CATEGORIES),
  images: z.array(productImageSchema).default([]),
  stockAvailable: z.coerce.number().int().min(0).default(0),
  stockSold: z.coerce.number().int().min(0).default(0),
  purchasePrice: z.coerce.number().min(0).default(0),
  sellingPrice: z.coerce.number().min(0).default(0),
  lowStockAlertThreshold: z.coerce.number().int().min(0).default(5),
  supplierName: z.string().max(160).default(''),
  supplierContact: z.string().max(160).default(''),
  status: z.enum(PRODUCT_STATUSES).default('active'),
  notes: z.string().max(5000).default('')
});

export const createProductSchema = z.object({
  body: productBaseSchema
});

export const updateProductSchema = z.object({
  params: z.object({ id: mongoIdSchema }),
  body: productBaseSchema.partial().refine((value) => Object.keys(value).length > 0, 'No updates provided')
});

export const getProductSchema = z.object({
  params: z.object({ id: mongoIdSchema })
});

export const listProductsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().trim().optional(),
    category: z.enum(PRODUCT_CATEGORIES).optional(),
    status: z.enum(PRODUCT_STATUSES).optional(),
    lowStock: booleanQuerySchema.optional(),
    sortBy: z
      .enum(['title', 'category', 'stockAvailable', 'stockSold', 'totalStock', 'profitAmount', 'createdAt', 'updatedAt'])
      .default('updatedAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
  })
});

export const adjustStockSchema = z.object({
  params: z.object({ id: mongoIdSchema }),
  body: z.object({
    mode: z.enum(['increment_available', 'decrement_available', 'record_sale', 'restock']),
    quantity: z.coerce.number().int().positive(),
    note: z.string().max(1000).optional()
  })
});

export const bulkProductSchema = z.object({
  body: z.object({
    productIds: z.array(mongoIdSchema).min(1).max(100),
    action: z.enum(['delete', 'set_status', 'set_category']),
    status: z.enum(PRODUCT_STATUSES).optional(),
    category: z.enum(PRODUCT_CATEGORIES).optional()
  }).superRefine((value, ctx) => {
    if (value.action === 'set_status' && !value.status) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['status'], message: 'status is required for set_status' });
    }

    if (value.action === 'set_category' && !value.category) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['category'], message: 'category is required for set_category' });
    }
  })
});

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
export type ListProductsQuery = z.infer<typeof listProductsSchema>['query'];
export type AdjustStockInput = z.infer<typeof adjustStockSchema>['body'];
