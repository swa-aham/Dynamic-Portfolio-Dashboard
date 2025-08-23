export interface StockRequest {
  symbol: string;
  exchange: string;
}

export interface StockData {
  symbol: string;
  name: string;
  cmp: number;
  peRatio?: number | null;
  earnings?: string;
}