import React, { useMemo, useState } from "react";

import { MoreHorizontal } from "lucide-react";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { DownloadIcon, Trash2, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { DateToUTCDate } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/ui/SkeletonWrapper";
import { DataTableViewOptions } from "@/components/datatable/ColumnToggle";
import { DataTableColumnHeader } from "@/components/datatable/ColumnHeader";
import { DataTableFacetedFilter } from "@/components/datatable/FacetedFilters";
import { GetTransetTransactionsHistoryResponseType } from "@/app/api/transactions-history/route";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import DeleteTransactionDialog from "./DeleteTransactionDialog";

type Props = { from: Date; to: Date; range: boolean };
type TransactionHistoryRow = GetTransetTransactionsHistoryResponseType[0];

const RowActions = ({
  transaction,
}: {
  transaction: TransactionHistoryRow;
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  return (
    <>
      <DeleteTransactionDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        id={transaction.id}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2"
            onSelect={() => {
              setShowDeleteDialog((prev) => !prev);
            }}
          >
            <Trash2 className="text-muted-foreground" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<TransactionHistoryRow>[] = [
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className="flex gap-2 capitalize">
        {row.original.categoryIcon}
        <div className="capitalize"> {row.original.category}</div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 capitalize">
        <div className="capitalize"> {row.original.description}</div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const formattedDate = date.toLocaleDateString("default", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      return (
        <div className="flex gap-2 capitalize">
          <div className="text-muted-foreground"> {formattedDate}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 capitalize">
        <div
          className={cn(
            "capitalize rounded-lg text-center p-2 flex gap-2",
            row.original.type === "income"
              ? "bg-emerald-400/10 text-emerald-500"
              : "bg-red-400/10 text-red-500"
          )}
        >
          {row.original.type === "income" ? <TrendingUp /> : <TrendingDown />}
          {row.original.type}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 capitalize">
        <div className="text-md rounded-lg bg-gray-400/5 p-2 text-center font-medium">
          {row.original.formattedAmount}
        </div>
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <RowActions transaction={row.original}></RowActions>,
  },
];

const csvConfig = mkConfig({
  useKeysAsHeaders: true,
  fieldSeparator: ",",
  decimalSeparator: ".",
  filename: "Transactions-history",
  title: "Transactions History",
  showTitle: true,
});
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const emptyData: any[] = [];

const TransactionsTable = ({ from, to, range }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilter] = useState<ColumnFiltersState>([]);
  const api: string = range
    ? `/api/transactions-history?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
        to
      )}`
    : `/api/transactions-history`;
  const history = useQuery<GetTransetTransactionsHistoryResponseType>({
    queryKey: ["transactions", "history", from, to, range],
    queryFn: () => fetch(api).then((res) => res.json()),
  });
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const handleExportToCSV = (data: any[]) => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const table = useReactTable({
    data: history.data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const categoriesOptions = useMemo(() => {
    const categoriesMap = new Map();
    history.data?.forEach((t) => {
      categoriesMap.set(t.category, {
        value: t.category,
        label: `${t.categoryIcon} ${t.category}`,
      });
    });

    const uniqueCategories = new Set(categoriesMap.values());
    return Array.from(uniqueCategories);
  }, [history.data]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-end justify-between gap-2 py-4">
        <div className="flex gap-2">
          {table.getColumn("category") && (
            <DataTableFacetedFilter
              title="Category"
              column={table.getColumn("category")}
              options={categoriesOptions}
            />
          )}
          {table.getColumn("type") && (
            <DataTableFacetedFilter
              title="Type"
              column={table.getColumn("type")}
              options={[
                { label: "Income", value: "income" },
                { label: "Expense", value: "expense" },
              ]}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={"outline"}
            className="ml-auto h-8 lg:flex"
            onClick={() => {
              const data = table.getFilteredRowModel().rows.map((row) => ({
                category: row.original.category,
                categoryIcon: row.original.categoryIcon,
                description: row.original.description,
                type: row.original.type,
                amount: row.original.amount,
                formattedAmount: row.original.formattedAmount,
                date: row.original.date,
              }));
              handleExportToCSV(data);
            }}
          >
            <DownloadIcon /> Export to CSV
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-2 py-4"></div>
      <SkeletonWrapper fullWidth isLoading={history.isFetching}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </SkeletonWrapper>
    </div>
  );
};

export default TransactionsTable;
