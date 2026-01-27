"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useArboretum } from "../lib/ArboretumProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import FilterChip from "@/components/ui/custom/filterchip";

import { Plus, Check } from "iconoir-react";

export function FilterCard() {
  const {
    filterConfig,
    computeConfig,
    families,
    species,
    statistics,
    setFilter,
    setCompute,
  } = useArboretum();

  const [speciesInput, setSpeciesInput] = useState("");
  const [activeTab, setActiveTab] = useState("none");
  const handleComputeChange = (metric: string) => {
    setCompute({
      metric: metric as
        | "ALL"
        | "FAMILY"
        | "SPECIES"
        | "Z-SCORE"
        | "Z-SCORE-UNIQUE"
        | "DIVERSITY"
        | "PERCENTAGE",
    });
  };

  const handleFilterChange = (
    type: "ALL" | "FAMILY" | "SPECIES",
    value: string = ""
  ) => {
    setFilter({ type, value });
    if (type === "ALL") {
      setActiveTab("none");
    }
  };

  const handleSpeciesSubmit = () => {
    if (speciesInput.trim()) {
      handleFilterChange("SPECIES", speciesInput.trim());
    }
  };

  return (
    <div className="flex flex-col rounded border bg-bg-card p-2">
      <div className="flex px-2">
        <h3 className="text-lg">Data</h3>
      </div>
      <Dialog>
        <div className="flex px-2">
          <span>Filter by:</span>

          <DialogTrigger>
            {/* <Button variant="tertiary" size="sm">Family <Plus/></Button> */}
            <div>
              Family <Plus />
            </div>
          </DialogTrigger>
          <DialogTrigger>
            {/* <Button variant="tertiary" size="sm">Species <Plus/></Button> */}
            <div>
              Species <Plus />
            </div>
          </DialogTrigger>
          <SelectionDialogContent setSpeciesInput={setSpeciesInput} />
        </div>
      </Dialog>
      <div className="flex flex-col gap-2 bg-bg-secondary px-4 py-3 font-mono">
        <div className="flex">
          <div className="flex grow flex-col">
            <p className="text-lg text-tx-body">
              {statistics.totalAccessions.toLocaleString()}
            </p>
            <p className="text-sm text-tx-tertiary">Accessions</p>
          </div>
          <div className="flex grow flex-col">
            <p className="text-lg text-tx-body">{statistics.filledCells}</p>
            <p className="text-sm text-tx-tertiary">Filled cells</p>
          </div>
        </div>
        <div className="flex">
          <div className="flex grow flex-col">
            <p className="text-lg text-tx-body">
              {statistics.meanA.toFixed(1)}
            </p>
            <p className="text-sm text-tx-tertiary">Unique Species</p>
          </div>
          <div className="flex grow flex-col">
            <p className="text-lg text-tx-body">
              {statistics.stdDevA.toFixed(2)}
            </p>
            <p className="text-sm text-tx-tertiary">Standard deviation</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Species type for the table
type Species = {
  id: string;
  name: string;
  family: string;
};

// Species columns definition
const speciesColumns: ColumnDef<Species>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Species Name
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "family",
    header: "Family",
    cell: ({ row }) => (
      <div className="text-tx-tertiary">{row.getValue("family")}</div>
    ),
  },
];

export function SelectionDialogContent({
  setSpeciesInput,
}: {
  setSpeciesInput: (value: string) => void;
}) {
  const {
    filterConfig,
    computeConfig,
    families,
    species,
    statistics,
    setFilter,
    setCompute,
  } = useArboretum();

  // Create species data for the table
  const speciesData: Species[] = React.useMemo(() => {
    return species
      .filter((speciesName) => speciesName && speciesName.trim() !== "")
      .map((speciesName, index) => ({
        id: `species-${index}`,
        name: speciesName,
        family: "Unknown", // You could enhance this by creating a species->family lookup
      }));
  }, [species]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: speciesData,
    columns: speciesColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <DialogContent className="bg-bg-card p-4">
      <DialogHeader>
        <div className="flex gap-2">
          <DialogTitle className="grow">Species list</DialogTitle>
          <Button variant="tertiary" size="sm">
            Cancel
          </Button>
          <Button size="sm">
            Confirm <Check />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <p className="mr-2">Filter by:</p>
          <FilterChip>Family</FilterChip>
          <FilterChip isActive={true}>Species</FilterChip>
        </div>

        <div className="max-h-64 overflow-y-auto">
          <Table className="max-w-lg">
            <TableHeader className="rounded border border-bd-primary bg-bg-primary p-2">
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
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setSpeciesInput(row.original.name)}
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
                    colSpan={speciesColumns.length}
                    className="h-24 text-center"
                  >
                    No species found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* <div className="max-h-64 overflow-y-auto">
            <ul>
              <li className="flex flex-row font-medium border-b">
                <p className="text-sm basis-2/3">Species name</p>
                <p className="text-sm basis-1/3 text-tx-tertiary">Family</p>
              </li>
              {species.filter(speciesName => speciesName && speciesName.trim() !== '').map((speciesName) => {
                // Find the family for this species from the data
                const family = 'Unknown'; // You could enhance this by creating a species->family lookup
                return (
                  <li key={speciesName} className="flex flex-row py-1 text-xs cursor-pointer hover:bg-gray-100" 
                      onClick={() => setSpeciesInput(speciesName)}>
                    <p className="basis-2/3">{speciesName}</p>
                    <p className="basis-1/3 text-tx-tertiary">{family}</p>
                  </li>
                );
              })}
            </ul>
          </div> */}
      </DialogHeader>
    </DialogContent>
  );
}
