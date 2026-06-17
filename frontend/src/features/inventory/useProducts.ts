import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  adjustProductStock,
  createProduct,
  deleteProduct,
  fetchProduct,
  fetchProducts,
  updateProduct
} from '../../api/productApi';
import type { ProductFormValues, ProductListQuery } from '../../types/product';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (query: ProductListQuery) => [...productKeys.lists(), query] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const
};

export function useProducts(query: ProductListQuery) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => fetchProducts(query)
  });
}

export function useProduct(productId?: string) {
  return useQuery({
    queryKey: productKeys.detail(productId || ''),
    queryFn: () => fetchProduct(productId as string),
    enabled: Boolean(productId)
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductFormValues) => createProduct(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all })
  });
}

export function useUpdateProduct(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ProductFormValues>) => updateProduct(productId, payload),
    onSuccess: (product) => {
      queryClient.setQueryData(productKeys.detail(productId), product);
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    }
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all })
  });
}

export function useAdjustStock(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adjustProductStock.bind(null, productId),
    onSuccess: (product) => {
      queryClient.setQueryData(productKeys.detail(productId), product);
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });
}
