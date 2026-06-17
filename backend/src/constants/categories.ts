export const PRODUCT_CATEGORIES = [
  'Clothes',
  'Shoes',
  'Electronics',
  'Grocery',
  'Furniture',
  'Beauty',
  'Accessories',
  'Sports',
  'Books',
  'Others'
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_STATUSES = ['active', 'inactive', 'out_of_stock', 'discontinued'] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
