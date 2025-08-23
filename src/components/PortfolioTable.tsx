// frontend/src/components/PortfolioTable.tsx

"use client";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { StockData } from "@/types";

interface Props {
  data: StockData[];
}

export default function PortfolioTable({ data }: Props) {
  const columns: ColumnDef<StockData>[] = [
    {
      header: "Stock",
      accessorKey: "symbol",
    },
    {
      header: "CMP",
      accessorKey: "cmp",
      cell: (info) => `₹${info.getValue<number>().toFixed(2)}`,
    },
    {
      header: "P/E Ratio",
      accessorKey: "peRatio",
      cell: (info) =>
        info.getValue() !== null ? info.getValue() : "Not Available",
    },
    {
      header: "Latest Earnings",
      accessorKey: "earnings",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-800 text-white font-semibold">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 text-left font-semibold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
