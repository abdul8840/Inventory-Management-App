import { apiClient } from './apiClient';
import type { ApiEnvelope } from '../types/api';
import type { Product, ProductFormValues, ProductImage, ProductListQuery, ProductListResponse, StockAdjustmentMode } from '../types/product';

export async function fetchProducts(query: ProductListQuery = {}) {
  const { data } = await apiClient.get<ApiEnvelope<ProductListResponse>>('/products', { params: query });
  return data.data;
}

export async function fetchProduct(productId: string) {
  const { data } = await apiClient.get<ApiEnvelope<Product>>(`/products/${productId}`);
  return data.data;
}

export async function createProduct(payload: ProductFormValues) {
  const { data } = await apiClient.post<ApiEnvelope<Product>>('/products', payload);
  return data.data;
}

export async function updateProduct(productId: string, payload: Partial<ProductFormValues>) {
  const { data } = await apiClient.patch<ApiEnvelope<Product>>(`/products/${productId}`, payload);
  return data.data;
}

export async function deleteProduct(productId: string) {
  await apiClient.delete(`/products/${productId}`);
}

export async function adjustProductStock(productId: string, payload: { mode: StockAdjustmentMode; quantity: number; note?: string }) {
  const { data } = await apiClient.post<ApiEnvelope<Product>>(`/products/${productId}/stock`, payload);
  return data.data;
}

export async function uploadProductImage(uri: string, fileName = 'product.jpg', type = 'image/jpeg') {
  const formData = new FormData();
  formData.append('image', {
    uri,
    name: fileName,
    type
  } as unknown as Blob);

  const { data } = await apiClient.post<ApiEnvelope<ProductImage>>('/uploads/product-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return data.data;
}
