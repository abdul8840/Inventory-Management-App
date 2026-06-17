import { productCategories } from '../types/product';

export const categoryOptions = productCategories.map((category) => ({
  label: category,
  value: category
}));
