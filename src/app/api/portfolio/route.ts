import getStockService from "@/backend/service/stockService";
import { NextResponse } from "next/server";
import  getPortfolioService from "@/backend/service/portfolioService";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "CSV file is required" },
        { status: 400 }
      );
    }

    const text = await file.text();
    const PortfolioService = getPortfolioService();
    const stocks = PortfolioService.updatePortfolio(text);
    return NextResponse.json({ stocks });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to process CSV" },
      { status: 500 }
    );
  }
}



export async function GET() {
  const stockService = getStockService();
  try {
    const stockData = await stockService.getStockData();
    // Simulating stock data for demonstration uncomment the above line to fetch real data and comment the below line
    // const stockData = [ { name: "Reliance", purchasePrice: 2200, quantity: 10, investment: 22000, portfolioWeight: 15, exchange: "NSE", cmp: 2500, presentValue: 25000, gainLoss: 3000, peRatio: 25.4, latestEarnings: "₹18,000 Cr", sector: "Energy", }, { name: "TCS", purchasePrice: 3200, quantity: 5, investment: 16000, portfolioWeight: 12, exchange: "BSE", cmp: 3100, presentValue: 15500, gainLoss: -500, peRatio: 28.7, latestEarnings: "₹11,000 Cr", sector: "Technology", }, { name: "HDFC Bank", purchasePrice: 1500, quantity: 20, investment: 30000, portfolioWeight: 20, exchange: "NSE", cmp: 1700, presentValue: 34000, gainLoss: 4000, peRatio: 22.1, latestEarnings: "₹9,000 Cr", sector: "Financials", }, { name: "Infosys", purchasePrice: 1450, quantity: 15, investment: 21750, portfolioWeight: 10, exchange: "BSE", cmp: 1350, presentValue: 20250, gainLoss: -1500, peRatio: 27.5, latestEarnings: "₹6,800 Cr", sector: "Technology", }, { name: "ITC", purchasePrice: 350, quantity: 100, investment: 35000, portfolioWeight: 8, exchange: "NSE", cmp: 420, presentValue: 42000, gainLoss: 7000, peRatio: 21.2, latestEarnings: "₹4,500 Cr", sector: "FMCG", }, { name: "Maruti Suzuki", purchasePrice: 8500, quantity: 3, investment: 25500, portfolioWeight: 6, exchange: "BSE", cmp: 9100, presentValue: 27300, gainLoss: 1800, peRatio: 30.1, latestEarnings: "₹2,200 Cr", sector: "Automobile", }, { name: "Adani Ports", purchasePrice: 650, quantity: 30, investment: 19500, portfolioWeight: 5, exchange: "NSE", cmp: 620, presentValue: 18600, gainLoss: -900, peRatio: 35.6, latestEarnings: "₹1,100 Cr", sector: "Infrastructure", }, { name: "Sun Pharma", purchasePrice: 950, quantity: 25, investment: 23750, portfolioWeight: 8, exchange: "BSE", cmp: 1120, presentValue: 28000, gainLoss: 4250, peRatio: 24.9, latestEarnings: "₹1,700 Cr", sector: "Healthcare", }, { name: "Asian Paints", purchasePrice: 2800, quantity: 7, investment: 19600, portfolioWeight: 6, exchange: "NSE", cmp: 2900, presentValue: 20300, gainLoss: 700, peRatio: 40.3, latestEarnings: "₹950 Cr", sector: "Consumer Goods", }, { name: "Coal India", purchasePrice: 240, quantity: 80, investment: 19200, portfolioWeight: 5, exchange: "BSE", cmp: 210, presentValue: 16800, gainLoss: -2400, peRatio: 12.8, latestEarnings: "₹5,200 Cr", sector: "Energy", }, ];
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      data: stockData,
    });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
