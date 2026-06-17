import type { Request, Response } from 'express';
import { ApiError } from '../utils/apiError';
import { asyncHandler } from '../utils/asyncHandler';
import {
  adjustStock,
  bulkUpdateProducts,
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  serializeProduct,
  updateProduct
} from '../services/product.service';

function requireUser(req: Request) {
  if (!req.auth) throw new ApiError(401, 'Authentication required');
  return req.auth;
}

export const createProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const auth = requireUser(req);
  const product = await createProduct(auth.userId, auth.userId, req.validated?.body);
  res.status(201).json({ success: true, data: serializeProduct(product) });
});

export const listProductsHandler = asyncHandler(async (req: Request, res: Response) => {
  const auth = requireUser(req);
  const data = await listProducts(auth.userId, req.validated?.query);
  res.json({ success: true, data });
});

export const getProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const auth = requireUser(req);
  const product = await getProductById(auth.userId, req.validated?.params.id);
  res.json({ success: true, data: serializeProduct(product) });
});

export const updateProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const auth = requireUser(req);
  const product = await updateProduct(auth.userId, auth.userId, req.validated?.params.id, req.validated?.body);
  res.json({ success: true, data: serializeProduct(product) });
});

export const deleteProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const auth = requireUser(req);
  await deleteProduct(auth.userId, auth.userId, req.validated?.params.id);
  res.status(204).send();
});

export const adjustStockHandler = asyncHandler(async (req: Request, res: Response) => {
  const auth = requireUser(req);
  const product = await adjustStock(auth.userId, auth.userId, req.validated?.params.id, req.validated?.body);
  res.json({ success: true, data: serializeProduct(product) });
});

export const bulkProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const auth = requireUser(req);
  const data = await bulkUpdateProducts(auth.userId, auth.userId, req.validated?.body);
  res.json({ success: true, data });
});
