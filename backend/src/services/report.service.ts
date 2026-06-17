import PDFDocument from 'pdfkit';
import { ProductModel } from '../models/Product';
import { toCsv } from '../utils/csv';

export async function buildInventoryCsv(owner: string) {
  const products = await ProductModel.find({ owner }).sort({ title: 1 }).lean();

  return toCsv(
    products.map((product) => ({
      sku: product.sku,
      title: product.title,
      category: product.category,
      stockAvailable: product.stockAvailable,
      stockSold: product.stockSold,
      totalStock: product.totalStock,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      totalPurchaseValue: product.totalPurchaseValue,
      totalSalesValue: product.totalSalesValue,
      profitAmount: product.profitAmount,
      profitMargin: product.profitMargin,
      status: product.status,
      supplierName: product.supplierName,
      updatedAt: product.updatedAt
    })),
    [
      'sku',
      'title',
      'category',
      'stockAvailable',
      'stockSold',
      'totalStock',
      'purchasePrice',
      'sellingPrice',
      'totalPurchaseValue',
      'totalSalesValue',
      'profitAmount',
      'profitMargin',
      'status',
      'supplierName',
      'updatedAt'
    ]
  );
}

export async function buildInventoryPdf(owner: string) {
  const products = await ProductModel.find({ owner }).sort({ title: 1 }).lean();
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  const chunks: Buffer[] = [];

  doc.on('data', (chunk) => chunks.push(chunk as Buffer));

  const finished = new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  doc.fontSize(20).text('Inventory Report', { align: 'left' });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor('#666').text(`Generated: ${new Date().toISOString()}`);
  doc.moveDown();
  doc.fillColor('#111');

  products.forEach((product, index) => {
    doc
      .fontSize(11)
      .text(`${index + 1}. ${product.title} (${product.sku})`, { continued: false })
      .fontSize(9)
      .fillColor('#555')
      .text(
        `Category: ${product.category} | Available: ${product.stockAvailable} | Sold: ${product.stockSold} | Profit: ${product.profitAmount.toFixed(2)}`
      )
      .fillColor('#111')
      .moveDown(0.4);
  });

  doc.end();
  return finished;
}
