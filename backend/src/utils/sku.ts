import type { ProductCategory } from '../constants/categories';

export function createSku(category: ProductCategory | string): string {
  const prefix = String(category || 'INV').slice(0, 3).toUpperCase();
  const time = Date.now().toString(36).toUpperCase();
  const entropy = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${time}-${entropy}`;
}
