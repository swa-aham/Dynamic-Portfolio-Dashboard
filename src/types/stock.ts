export type Stock = {
  name: string;             // Stock Name
  purchasePrice: number;    // Purchase Price
  quantity: number;         // Qty
  investment: number;       // PurchasePrice × Qty
  portfolioWeight: number;  // %
  exchange: "NSE" | "BSE";  // Exchange
  cmp: number;              // Current Market Price
  presentValue: number;     // CMP × Qty
  gainLoss: number;         // PresentValue - Investment
  peRatio: number;          // From Google Finance
  latestEarnings: string;   // From Google Finance
  sector: string; // NEW
};
