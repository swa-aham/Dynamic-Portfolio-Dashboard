"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import Button from "../ui/Button";
import { Sparkles, Rows, SearchX, Frown } from "lucide-react"; // icons

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [highlightRows, setHighlightRows] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <div className="flex justify-end">
        <Button
          variant={highlightRows ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2 transition-all duration-200"
          onClick={() => setHighlightRows(!highlightRows)}
        >
          {highlightRows ? (
            <>
              <Sparkles className="w-4 h-4" />
              Highlight Gain/Loss
            </>
          ) : (
            <>
              <Rows className="w-4 h-4" />
              Highlight Whole Row
            </>
          )}
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto">
        <table className="w-full bg-background text-foreground">
          <thead className="bg-background/50 backdrop-blur">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-foreground/80 hover:text-foreground cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() === "asc"
                      ? " 🔼"
                      : header.column.getIsSorted() === "desc"
                      ? " 🔽"
                      : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const gainLoss = row.getValue("gainLoss") as number;

                // Row background colors
                const rowColor =
                  gainLoss > 0
                    ? "bg-green-50 dark:bg-green-900/30"
                    : gainLoss < 0
                    ? "bg-red-50 dark:bg-red-900/30"
                    : "bg-background";

                return (
                  <tr
                    key={row.id}
                    className={`border-t border-foreground/20 transition-colors duration-200 ${
                      highlightRows ? rowColor : ""
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (cell.column.id === "gainLoss") {
                        const value = cell.getValue() as number;
                        const textColor =
                          value > 0
                            ? "text-green-600 dark:text-green-400"
                            : value < 0
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-600 dark:text-gray-400";

                        return (
                          <td
                            key={cell.id}
                            className={`px-4 py-2 text-sm font-medium ${
                              highlightRows ? "text-foreground" : textColor
                            }`}
                          >
                            ₹{value.toLocaleString()}
                          </td>
                        );
                      }

                      return (
                        <td
                          key={cell.id}
                          className="px-4 py-2 text-sm text-foreground"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-10 text-center text-foreground/70"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Frown className="w-10 h-10 text-foreground/50" />
                    <p className="text-base font-medium">No results found</p>
                    <p className="text-sm text-foreground/50">
                      Looks like there’s nothing here yet.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
