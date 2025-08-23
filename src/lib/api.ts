// frontend/src/lib/api.ts

import { StockRequest, StockData } from "@/types";

const API_URL = "http://localhost:4000/api/portfolio"; // Adjust if you deploy

export async function fetchPortfolio(stocks: StockRequest[]): Promise<StockData[]> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stocks }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch portfolio data");
  }

  const json = await response.json();
  return json.data as StockData[];
}
