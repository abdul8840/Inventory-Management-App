import type { ProductFormValues } from '../types/product';

export function calculateDraftMetrics(values: Partial<ProductFormValues>) {
  const stockAvailable = Number(values.stockAvailable || 0);
  const stockSold = Number(values.stockSold || 0);
  const purchasePrice = Number(values.purchasePrice || 0);
  const sellingPrice = Number(values.sellingPrice || 0);
  const totalStock = stockAvailable + stockSold;
  const totalPurchaseValue = totalStock * purchasePrice;
  const totalSalesValue = stockSold * sellingPrice;
  const profitAmount = stockSold * (sellingPrice - purchasePrice);
  const profitMargin = sellingPrice > 0 ? ((sellingPrice - purchasePrice) / sellingPrice) * 100 : 0;

  return {
    totalStock,
    totalPurchaseValue,
    totalSalesValue,
    profitAmount,
    profitMargin
  };
}
