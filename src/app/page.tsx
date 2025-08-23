// "use client";

// import { useEffect, useState } from "react";
// import PortfolioTable from "@/components/PortfolioTable";
// import { StockData, StockRequest } from "@/types";
// import { fetchPortfolio } from "@/lib/api";

// const stocks: StockRequest[] = [
//   { symbol: "AAPL", exchange: "NASDAQ" },
//   { symbol: "GOOGL", exchange: "NASDAQ" },
//   { symbol: "TCS.NS", exchange: "NSE" },
//   { symbol: "INFY.NS", exchange: "NSE" },
// ];

// export default function Home() {
//   const [data, setData] = useState<StockData[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [isClient, setIsClient] = useState(false); // 👈 Add this

//   useEffect(() => {
//     setIsClient(true); // ✅ Hydration-safe rendering
//   }, []);

//   useEffect(() => {
//     if (!isClient) return;

//     async function loadPortfolio() {
//       try {
//         const result = await fetchPortfolio(stocks);
//         setData(result);
//         setError(null);
//       } catch (err: any) {
//         setError(err.message || "Unknown error");
//       }
//     }

//     loadPortfolio();
//     const interval = setInterval(loadPortfolio, 150000);
//     return () => clearInterval(interval);
//   }, [isClient]);

//   if (!isClient) return null; // Avoid rendering during SSR

//   return (
//     <main className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Dynamic Portfolio Dashboard</h1>
//       {error && <p className="text-red-600 mb-4">Error: {error}</p>}
//       <PortfolioTable data={data} />
//     </main>
//   );
// }

"use client";

import * as React from "react";
import axios from "axios";
import { DataTable } from "@/components/table/DataTable";
import { portfolioColumns } from "@/components/table/columns";
import { Stock } from "@/types/stock";
import ThemeToggle from "@/components/ThemeToggle";
import {
  LineChart,
  Info,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import SummaryComponent from "@/components/SummaryComponent";

const REFRESH_INTERVAL = 900000; // 15 minutes in ms

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = React.useState<"dashboard" | "summary">(
    "dashboard"
  );
  const [data, setData] = React.useState<Stock[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [nextRefresh, setNextRefresh] = React.useState(REFRESH_INTERVAL / 1000);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  // Format countdown (MM:SS)
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? `0${sec}` : sec}`;
  };

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/portfolio");
      const response = res.data;
      setData(response.data);
      setLastUpdated(response.timestamp ? new Date(response.timestamp) : null);
      setError(null);
      setNextRefresh(REFRESH_INTERVAL / 1000);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
      setError("Failed to load portfolio data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount + refresh every 15 min
  React.useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  React.useEffect(() => {
    if (!nextRefresh) return;
    const timer = setInterval(() => {
      setNextRefresh((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [nextRefresh]);

  return (
    <main className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LineChart className="w-7 h-7 text-primary" />
            Portfolio Holdings
          </h1>
          <p className="text-sm text-foreground/60 mt-1 flex items-center gap-1">
            <Info className="w-4 h-4 text-foreground/50" />
            Track your investments and monitor performance in real time.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "dashboard"
                  ? "bg-primary text-white shadow"
                  : "text-foreground/70 hover:bg-foreground/10"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === "summary"
                  ? "bg-primary text-white shadow"
                  : "text-foreground/70 hover:bg-foreground/10"
              }`}
            >
              Summary
            </button>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-foreground/20 bg-background shadow-sm p-6 flex flex-col items-center justify-center text-foreground/60">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-primary" />
          <span>Loading portfolio...</span>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 shadow-sm p-6 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-foreground/60 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Next auto-refresh in {formatTime(nextRefresh)}
            </span>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <span className="text-xs text-foreground/60">
                  Last updated:{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(lastUpdated)}
                </span>
              )}
              <button
                onClick={fetchPortfolio}
                className="text-xs flex items-center gap-1 text-primary hover:underline"
              >
                <RefreshCw className="w-3 h-3" /> Refresh Now
              </button>
            </div>
          </div>
          {activeTab === "dashboard" ? (
            <div className="rounded-xl border border-foreground/20 bg-background shadow-sm p-4">
              <DataTable columns={portfolioColumns} data={data} />
            </div>
          ) : (
            <div className="rounded-xl border border-foreground/20 bg-background shadow-sm p-4">
              <SummaryComponent data={data} />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
