import { Router } from 'express';
import {
  adjustStockHandler,
  bulkProductHandler,
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  listProductsHandler,
  updateProductHandler
} from '../controllers/product.controller';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  adjustStockSchema,
  bulkProductSchema,
  createProductSchema,
  getProductSchema,
  listProductsSchema,
  updateProductSchema
} from '../schemas/product.schemas';

export const productRouter = Router();

productRouter.use(requireAuth);
productRouter.get('/', validate(listProductsSchema), listProductsHandler);
productRouter.post('/', validate(createProductSchema), createProductHandler);
productRouter.post('/bulk', validate(bulkProductSchema), bulkProductHandler);
productRouter.get('/:id', validate(getProductSchema), getProductHandler);
productRouter.patch('/:id', validate(updateProductSchema), updateProductHandler);
productRouter.delete('/:id', validate(getProductSchema), deleteProductHandler);
productRouter.post('/:id/stock', validate(adjustStockSchema), adjustStockHandler);
