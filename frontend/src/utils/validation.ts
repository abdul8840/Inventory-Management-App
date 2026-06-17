import { z } from 'zod';
import { productCategories } from '../types/product';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Name is required')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address')
});

export const productFormSchema = z.object({
  title: z.string().min(2, 'Product title is required'),
  description: z.string().max(3000).default(''),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  qrCode: z.string().optional(),
  category: z.enum(productCategories),
  images: z.array(
    z.object({
      url: z.string().url(),
      publicId: z.string(),
      width: z.number().optional(),
      height: z.number().optional(),
      format: z.string().optional(),
      bytes: z.number().optional(),
      isPrimary: z.boolean().optional()
    })
  ),
  stockAvailable: z.coerce.number().int().min(0),
  stockSold: z.coerce.number().int().min(0),
  purchasePrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),
  lowStockAlertThreshold: z.coerce.number().int().min(0),
  supplierName: z.string().max(160).default(''),
  supplierContact: z.string().max(160).default(''),
  status: z.enum(['active', 'inactive', 'out_of_stock', 'discontinued']),
  notes: z.string().max(5000).default('')
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
