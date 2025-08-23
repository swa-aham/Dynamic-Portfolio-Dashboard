import { StockUpload } from "../type/portfolioUpload";
import { Stock } from "../type/stock";
import getFmpService from "./fmpService";
import getYahooService from "./yahooService";
import { supabaseAdmin } from "../lib/supabaseClient";
import { fromDbStockUpload } from "./adapter/stockUploadAdapter";

class StockService {
  // ✅ Get saved portfolio from Supabase
  private async fetchPortfolioData(): Promise<StockUpload[]> {
    const { data, error } = await supabaseAdmin
      .from("portfolio")
      .select("*");

    if (error) {
      console.error("Error fetching portfolio:", error.message);
      throw error;
    }
    const adaptedData = (data || []).map(fromDbStockUpload);
    return (adaptedData || []) as StockUpload[];
  }

  async getStockData(): Promise<Stock[]> {
    try {
      const stockData = await this.fetchPortfolioData();

      const stockPromises = stockData.map((stock) =>
        this.fetchStockDataFromApi(stock.stockId)
      );

      const stockResults = await Promise.all(stockPromises);

      return stockResults.map((result, index) => {
        const portfolio = stockData[index];
        const investment = portfolio.purchaseValue * portfolio.qty;
        const presentValue = result.price * portfolio.qty;

        return {
          ...result,
          name: result.stockId,
          purchasePrice: portfolio.purchaseValue,
          quantity: portfolio.qty,
          investment: parseFloat(investment.toFixed(2)),
          portfolioWeight: 0, // Placeholder, will be calculated later
          exchange: portfolio.exchange || "N/A",
          cmp: result.price,
          presentValue: parseFloat(presentValue.toFixed(2)),
          gainLoss: parseFloat((presentValue - investment).toFixed(2)),
          peRatio: typeof result.peRatio === "number" ? result.peRatio : -1,
          latestEarnings: result.eps,
          sector: portfolio.sector || "N/A",
        } as Stock;
      });
    } catch (error) {
      console.error("Error fetching stock data:", error);
      throw error;
    }
  }

  // ✅ Fetch latest stock data from APIs
  async fetchStockDataFromApi(symbol: string): Promise<{
    stockId: string;
    price: number;
    peRatio: string | number;
    eps: string;
  }> {
    try {
      const yahooService = getYahooService();
      const fmpService = getFmpService();

      const pricePromise = yahooService.getPrice(symbol);
      const ratiosPromise = fmpService.getRatios(symbol);

      const [price, ratios] = await Promise.all([pricePromise, ratiosPromise]);

      return {
        stockId: symbol,
        price,
        peRatio: ratios.peRatio !== null ? ratios.peRatio : "N/A",
        eps: ratios.earnings,
      };
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      throw error;
    }
  }
}

export default function getStockService(): StockService {
  return new StockService();
}
