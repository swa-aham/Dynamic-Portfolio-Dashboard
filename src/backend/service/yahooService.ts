// services/YahooFinanceService.ts
import yahooFinance from "yahoo-finance2";
// import { getCached, setCache } from "../utils/cache";

export class YahooFinanceService {
  private RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  private RATE_LIMIT_COUNT = 50; // max 50 requests per minute
  private requestTimestamps: number[] = [];

  /**
   * Rate limiter: ensures we don't exceed API request limits
   */
  private enforceRateLimit() {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(
      (ts) => now - ts < this.RATE_LIMIT_WINDOW
    );

    if (this.requestTimestamps.length >= this.RATE_LIMIT_COUNT) {
      throw new Error("Yahoo Finance rate limit exceeded. Try again later.");
    }

    this.requestTimestamps.push(now);
  }

  /**
   * Fetch the current market price of a stock
   */
async getPrice(symbol: string): Promise<number> {
    const cacheKey = `yahoo-${symbol}`;
    // const cached = getCached(cacheKey);
    // if (cached) return cached;

    this.enforceRateLimit();

    try {
      const result = await yahooFinance.quote(symbol);
        console.log(`Fetched price for ${symbol}:`, result);
      const price = result.regularMarketPrice;
      if (price === undefined) {
        throw new Error(`No market price available for ${symbol}`);
      }

    //   setCache(cacheKey, price, 60); // cache for 60 seconds
      return price;
    } catch (error) {
      console.error(`Error fetching Yahoo Finance data for ${symbol}:`, error);
      throw new Error("Yahoo Finance fetch failed");
    }
  }
}


export default function getYahooService(): YahooFinanceService {
  return new YahooFinanceService();
}