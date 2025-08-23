import { StockUpload } from "@/backend/type/portfolioUpload";

export function toDbStockUpload(stock: StockUpload) {
  return {
    stockid: stock.stockId,
    purchasevalue   : stock.purchaseValue,
    qty: stock.qty,
    exchange: stock.exchange,
    sector: stock.sector,
  };
}


export function fromDbStockUpload(dbRow: any): StockUpload {
  return {
    stockId: dbRow.stockid,
    purchaseValue: parseFloat(dbRow.purchasevalue),
    qty: dbRow.qty,
    exchange: dbRow.exchange || undefined,
    sector: dbRow.sector || undefined,
  };
}