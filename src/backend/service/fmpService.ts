import axios from "axios";

// Simple in-memory cache (per instance)
const cache = new Map<string, { value:any; expiry: number }>();

// Cache duration (e.g., 10 minutes)
const CACHE_TTL = 10 * 60 * 1000;

// Simple rate limit: max 5 requests per second
const MAX_REQUESTS = 5;
let requestTimestamps: number[] = [];

export type FmpRatios = {
  peRatio: number | null;
  earnings: string;
};

export class FMService {
  private apiKey: string = process.env.FMP_API_KEY || "";
  private baseUrl: string = "https://financialmodelingprep.com/api/v3";

    private rateLimit() {
    const now = Date.now();
    requestTimestamps = requestTimestamps.filter(
      (ts) => now - ts < 1000 // keep only last 1s
    );
    if (requestTimestamps.length >= MAX_REQUESTS) {
      throw new Error("Rate limit exceeded. Try again later.");
    }
    requestTimestamps.push(now);
  }

  
//Fetch PE ratio and EPS with caching + rate limiting
    async getRatios(symbol: string): Promise<FmpRatios> {
    const cacheKey = `fmp-${symbol}`;
    const cached = cache.get(cacheKey);

    if (cached && cached.expiry > Date.now()) {
      return cached.value;
    }

    this.rateLimit();

    try {
      const fmpsymbol = symbol.toUpperCase();

      const [peRes, earningsRes] = await Promise.all([
        axios.get(
          `${this.baseUrl}/ratios-ttm/${fmpsymbol}?apikey=${this.apiKey}`
        ),
        axios.get(
          `${this.baseUrl}/income-statement/${fmpsymbol}?limit=1&apikey=${this.apiKey}`
        ),
      ]);

      const peRatio =
        Array.isArray(peRes.data) && peRes.data[0]?.peRatioTTM
          ? peRes.data[0].peRatioTTM
          : null;

      const earnings =
        Array.isArray(earningsRes.data) && earningsRes.data[0]?.eps
          ? earningsRes.data[0].eps
          : "N/A";

      const result: FmpRatios = { peRatio, earnings };

      // Save to cache
      cache.set(cacheKey, { value: result, expiry: Date.now() + CACHE_TTL });

      return result;
    } catch (error) {
      console.error(`FMP fetch error for ${symbol}:`, error);
      return { peRatio: null, earnings: "N/A" };
    }
  }
}


export default function getFmpService(): FMService {
  return new FMService();
}