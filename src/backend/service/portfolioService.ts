import { StockUpload } from "../type/portfolioUpload";
import { supabaseAdmin } from "../lib/supabaseClient";
import { toDbStockUpload } from "./adapter/stockUploadAdapter";
class PortfolioService {
  private parseCSV(csvText: string): StockUpload[] {
    const lines = csvText.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    if (
      headers[0] !== "STOCKID" ||
      headers[1] !== "PURCHASE_VALUE" ||
      headers[2] !== "QTY" ||
      headers[3] !== "EXCHANGE" ||
      headers[4] !== "SECTOR"
    ) {
      throw new Error(
        "Invalid CSV format. Expected headers: STOCKID,PURCHASE_VALUE,QTY,EXCHANGE,SECTOR"
      );
    }

    return lines.slice(1).map((line) => {
      const [stockId, purchaseValue, qty, exchange, sector] = line
        .split(",")
        .map((v) => v.trim());

      return {
        stockId,
        purchaseValue: parseFloat(purchaseValue),
        qty: parseInt(qty, 10),
        exchange: exchange || null,
        sector: sector || null,
      };
    });
  }

  async updatePortfolio(csvText: string): Promise<StockUpload[]> {
    const stocks: StockUpload[] = this.parseCSV(csvText);
// create table if not exists portfolio (
//   id bigint generated always as identity primary key,
//   stockId text not null,
//   purchaseValue numeric not null,
//   qty int not null,
//   exchange text,
//   sector text,
//   created_at timestamptz default now()
// );
    const formattedStocks = stocks.map(toDbStockUpload);
    const { data, error } = await supabaseAdmin
      .from("portfolio")
      .insert(formattedStocks)
      .select(); // return inserted rows

    if (error) {
      console.error("Error inserting portfolio:", error.message);
      throw error;
    }

    return data as StockUpload[];
  }
}

export default function getPortfolioService(): PortfolioService {
  return new PortfolioService();
}
