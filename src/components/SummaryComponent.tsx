"use client";

import React, { useState } from "react";
import { groupBy } from "lodash";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  PieChart as PieChartIcon,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Frown,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Stock } from "@/types/stock";

interface Props {
  data: Stock[];
}

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#a78bfa"];

const SummaryComponent: React.FC<Props> = ({ data }) => {
  const [expandedSectors, setExpandedSectors] = useState<string[]>([]);

  // Group by sector
  const grouped = groupBy(data, "sector");

  // Sector summary for pie chart
  const chartData = Object.entries(grouped).map(([sector, stocks]) => {
    const totalInvestment = stocks.reduce((acc, s) => acc + s.investment, 0);
    const totalPresentValue = stocks.reduce(
      (acc, s) => acc + s.presentValue,
      0
    );
    return {
      name: sector,
      investment: totalInvestment,
      presentValue: totalPresentValue,
    };
  });

  // Totals across portfolio
  const totalInvestment = data.reduce((acc, s) => acc + s.investment, 0);
  const totalPresentValue = data.reduce((acc, s) => acc + s.presentValue, 0);
  const totalShares = data.length;

  const toggleSector = (sector: string) => {
    setExpandedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  };

  return (
    <div className="space-y-8">
      {/* Top-level portfolio summary */}
      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-xl border bg-background shadow-md p-6 flex flex-col">
          <span className="text-sm text-foreground/70">Total Investment</span>
          <span className="text-xl font-semibold">
            ₹{totalInvestment.toLocaleString()}
          </span>
        </div>
        <div className="rounded-xl border bg-background shadow-md p-6 flex flex-col gap-2">
          <span className="text-sm text-foreground/70">Present Value</span>

          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold">
              ₹{totalPresentValue.toLocaleString()}
            </span>

            {totalInvestment !== 0 && (
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
                  totalPresentValue >= totalInvestment
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {totalPresentValue >= totalInvestment ? "▲" : "▼"}{" "}
                {(
                  ((totalPresentValue - totalInvestment) / totalInvestment) *
                  100
                ).toFixed(2)}
                %
              </span>
            )}
          </div>
        </div>

        <div className="rounded-xl border bg-background shadow-md p-6 flex flex-col">
          <span className="text-sm text-foreground/70">Total Stocks</span>
          <span className="text-xl font-semibold">{totalShares}</span>
        </div>
      </div>
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-foreground/70">
          <Frown className="w-10 h-10 text-foreground/50" />
          <p className="text-base font-medium">No stocks found</p>
        </div>
      ) : (
        <div>
          {/* Overall Sector Distribution */}
          <div className="rounded-xl border bg-background shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-foreground/70" />
              Sector Allocation
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="presentValue"
                    nameKey="name"
                    outerRadius={100}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `₹${value.toLocaleString()}`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sector-wise details with expandable cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Object.entries(grouped).map(([sector, stocks], idx) => {
              const inv = stocks.reduce((acc, s) => acc + s.investment, 0);
              const pv = stocks.reduce((acc, s) => acc + s.presentValue, 0);
              const gl = pv - inv;
              const percentChange = ((gl / inv) * 100).toFixed(2);
              const color = COLORS[idx % COLORS.length];
              const isExpanded = expandedSectors.includes(sector);

              return (
                <div
                  key={sector}
                  className="rounded-xl border bg-background shadow-md"
                >
                  <button
                    className="w-full text-left p-6 flex items-center justify-between"
                    onClick={() => toggleSector(sector)}
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" style={{ color }} />
                      <div>
                        <h3 className="font-semibold">{sector}</h3>
                        <p className="text-xs text-foreground/70">
                          {stocks.length} Stocks
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-foreground/60" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-foreground/60" />
                    )}
                  </button>

                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-2 px-6 pb-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-foreground/70">Investment</span>
                      <span>₹{inv.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-foreground/70">Value</span>
                      <span>₹{pv.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-foreground/70">Gain/Loss</span>
                      <span
                        className={`flex items-center gap-1 font-semibold ${
                          gl >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {gl >= 0 ? (
                          <ArrowUpCircle className="h-4 w-4" />
                        ) : (
                          <ArrowDownCircle className="h-4 w-4" />
                        )}
                        {percentChange}%
                      </span>
                    </div>
                  </div>

                  {/* Expanded stock details */}
                  {isExpanded && (
                    <div className="border-t px-6 py-4 space-y-2 bg-muted/30 max-h-64 overflow-y-auto">
                      {stocks.map((s) => {
                        const stockGl = s.presentValue - s.investment;
                        const stockPercent = (
                          (stockGl / s.investment) *
                          100
                        ).toFixed(2);

                        return (
                          <div
                            key={s.name}
                            className="flex justify-between text-sm rounded-lg bg-background shadow-sm p-3"
                          >
                            <span className="font-medium">{s.name}</span>
                            <span className="text-foreground/70">
                              Inv: ₹{s.investment.toLocaleString()}
                            </span>
                            <span className="text-foreground/70">
                              Val: ₹{s.presentValue.toLocaleString()}
                            </span>
                            <span
                              className={`${
                                stockGl >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {stockPercent}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryComponent;
