export type StockUpload = {
  stockId: string;
  purchaseValue: number;
  qty: number;
  exchange?: string;
  sector?: string;
};