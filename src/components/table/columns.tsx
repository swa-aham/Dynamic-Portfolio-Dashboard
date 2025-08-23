"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Stock } from "@/types/stock";

// Helper for Gain/Loss color classes with dark mode
const getGainLossClass = (value: number) => {
  if (value > 0)
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
  if (value < 0)
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
};

export const portfolioColumns: ColumnDef<Stock>[] = [
  {
    accessorKey: "name",
    header: "Particulars",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "purchasePrice",
    header: "Purchase Price",
    cell: ({ row }) => (
      <span className="">
        ₹{row.getValue("purchasePrice")}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Qty",
    cell: ({ row }) => (
      <span className="">
        {row.getValue("quantity")}
      </span>
    ),
  },
  {
    accessorKey: "investment",
    header: "Investment",
    cell: ({ row }) => (
      <span className="font-medium ">
        ₹{Number(row.getValue("investment")).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "portfolioWeight",
    header: "Portfolio (%)",
    cell: ({ row }) => (
      <span className="font-semibold text-blue-600 dark:text-blue-400">
        {row.getValue("portfolioWeight")}%
      </span>
    ),
  },
  {
    accessorKey: "exchange",
    header: "NSE / BSE",
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs uppercase dark:bg-gray-700 dark:text-gray-300">
        {row.getValue("exchange")}
      </span>
    ),
  },
  {
    accessorKey: "cmp",
    header: "CMP",
    cell: ({ row }) => (
      <span className="font-medium ">
        ₹{row.getValue("cmp")}
      </span>
    ),
  },
  {
    accessorKey: "presentValue",
    header: "Present Value",
    cell: ({ row }) => (
      <span className="font-semibold">
        ₹{Number(row.getValue("presentValue")).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "gainLoss",
    header: "Gain / Loss",
    cell: ({ row }) => {
      const value = row.getValue("gainLoss") as number;
      return (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${getGainLossClass(
            value
          )}`}
        >
          ₹{value.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "peRatio",
    header: "P/E Ratio",
    cell: ({ row }) => (
      <span className="">
        {row.getValue("peRatio")}
      </span>
    ),
  },
  {
    accessorKey: "latestEarnings",
    header: "Latest Earnings",
    cell: ({ row }) => (
      <span className="">
        {row.getValue("latestEarnings")}
      </span>
    ),
  },
];
