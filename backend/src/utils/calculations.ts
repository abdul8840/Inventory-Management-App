export interface ProductCalculationInput {
  stockAvailable: number;
  stockSold: number;
  purchasePrice: number;
  sellingPrice: number;
}

export function calculateProductMetrics(input: ProductCalculationInput) {
  const totalStock = input.stockAvailable + input.stockSold;
  const totalPurchaseValue = totalStock * input.purchasePrice;
  const totalSalesValue = input.stockSold * input.sellingPrice;
  const profitAmount = input.stockSold * (input.sellingPrice - input.purchasePrice);
  const profitMargin =
    input.sellingPrice > 0 ? ((input.sellingPrice - input.purchasePrice) / input.sellingPrice) * 100 : 0;

  return {
    totalStock,
    totalPurchaseValue,
    totalSalesValue,
    profitAmount,
    profitMargin: Number(profitMargin.toFixed(2))
  };
}
