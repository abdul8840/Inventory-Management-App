export const productCategories = [
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

export type ProductCategory = (typeof productCategories)[number];
export type ProductStatus = 'active' | 'inactive' | 'out_of_stock' | 'discontinued';

export interface ProductImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  isPrimary?: boolean;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  sku: string;
  barcode?: string;
  qrCode?: string;
  category: ProductCategory;
  images: ProductImage[];
  stockAvailable: number;
  stockSold: number;
  purchasePrice: number;
  sellingPrice: number;
  totalStock: number;
  totalPurchaseValue: number;
  totalSalesValue: number;
  profitAmount: number;
  profitMargin: number;
  lowStockAlertThreshold: number;
  supplierName: string;
  supplierContact: string;
  status: ProductStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: ProductCategory;
  status?: ProductStatus;
  lowStock?: boolean;
  sortBy?: 'title' | 'category' | 'stockAvailable' | 'stockSold' | 'totalStock' | 'profitAmount' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductListResponse {
  items: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ProductFormValues = Omit<
  Product,
  '_id' | 'sku' | 'totalStock' | 'totalPurchaseValue' | 'totalSalesValue' | 'profitAmount' | 'profitMargin' | 'createdAt' | 'updatedAt'
> & {
  sku?: string;
};

export type StockAdjustmentMode = 'increment_available' | 'decrement_available' | 'record_sale' | 'restock';
