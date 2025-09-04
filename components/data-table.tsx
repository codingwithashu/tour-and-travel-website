"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGripVertical,
  IconLayoutColumns,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Generic types for the reusable component
export interface DataTableTab {
  value: string;
  label: string;
  badge?: number;
  content?: React.ReactNode;
}

export interface DataTableAction {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?:
    | "default"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost"
    | "link";
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  // Optional features
  enableDragAndDrop?: boolean;
  enableSelection?: boolean;
  enablePagination?: boolean;
  enableColumnVisibility?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  // Customization
  tabs?: DataTableTab[];
  defaultTab?: string;
  actions?: DataTableAction[];
  pageSize?: number;
  pageSizeOptions?: number[];
  // Callbacks
  onDataChange?: (data: TData[]) => void;
  onSelectionChange?: (selectedRows: TData[]) => void;
  // Styling
  className?: string;
  tableClassName?: string;
  // Row identification
  getRowId?: (row: TData) => string;
  loading?: boolean; // ✅ New prop
  emptyStateIcon?: React.ReactNode; // ✅ Optional icon
  emptyStateMessage?: string; // ✅ Optional message
}

// Drag handle component for reordering
function DragHandle<TData>({
  row,
  getRowId,
}: {
  row: Row<TData>;
  getRowId?: (row: TData) => string;
}) {
  const id = getRowId ? getRowId(row.original) : row.id;
  const { attributes, listeners } = useSortable({ id });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

// Draggable row component
function DraggableRow<TData>({
  row,
  getRowId,
}: {
  row: Row<TData>;
  getRowId?: (row: TData) => string;
}) {
  const id = getRowId ? getRowId(row.original) : row.id;
  const { transform, transition, setNodeRef, isDragging } = useSortable({ id });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

// Helper function to create drag column
export function createDragColumn<TData>(
  getRowId?: (row: TData) => string
): ColumnDef<TData> {
  return {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle row={row} getRowId={getRowId} />,
    size: 40,
  };
}

// Helper function to create select column
export function createSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  };
}

export function DataTable<TData>({
  data: initialData,
  columns: initialColumns,
  enableDragAndDrop = false,
  enableSelection = false,
  enablePagination = true,
  enableColumnVisibility = true,
  enableSorting = true,
  enableFiltering = true,
  tabs,
  defaultTab,
  actions = [],
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  onDataChange,
  onSelectionChange,
  className,
  tableClassName,
  getRowId,
  loading,
  emptyStateIcon,
  emptyStateMessage
}: DataTableProps<TData>) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize,
  });

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // Build columns with optional drag and select columns
  const columns = React.useMemo(() => {
    const cols: ColumnDef<TData>[] = [];

    if (enableDragAndDrop) {
      cols.push(createDragColumn(getRowId));
    }

    if (enableSelection) {
      cols.push(createSelectColumn());
    }

    cols.push(...initialColumns);

    return cols;
  }, [initialColumns, enableDragAndDrop, enableSelection, getRowId]);

  // Generate sortable IDs for drag and drop
  const dataIds = React.useMemo<UniqueIdentifier[]>(() => {
    if (!enableDragAndDrop) return [];
    return (
      data?.map((item, index) =>
        getRowId ? getRowId(item) : index.toString()
      ) || []
    );
  }, [data, enableDragAndDrop, getRowId]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: enableSorting ? sorting : [],
      columnVisibility,
      rowSelection: enableSelection ? rowSelection : {},
      columnFilters: enableFiltering ? columnFilters : [],
      pagination: enablePagination
        ? pagination
        : { pageIndex: 0, pageSize: data.length },
    },
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    enableRowSelection: enableSelection,
    onRowSelectionChange: enableSelection ? setRowSelection : undefined,
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: enableFiltering ? setColumnFilters : undefined,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: enablePagination ? setPagination : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFacetedRowModel: enableFiltering ? getFacetedRowModel() : undefined,
    getFacetedUniqueValues: enableFiltering
      ? getFacetedUniqueValues()
      : undefined,
  });

  // Handle drag end for reordering
  function handleDragEnd(event: DragEndEvent) {
    if (!enableDragAndDrop) return;

    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((currentData) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        const newData = arrayMove(currentData, oldIndex, newIndex);
        onDataChange?.(newData);
        return newData;
      });
    }
  }

  // Handle selection changes
  React.useEffect(() => {
    if (enableSelection && onSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, enableSelection, onSelectionChange, table]);

  // Update data when initialData changes
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const TableContent = () => (
    <div className="relative flex flex-col gap-4 overflow-auto">
      <div
        className={`overflow-hidden rounded-lg border ${tableClassName || ""}`}
      >
        {enableDragAndDrop ? (
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {columns.map((_, j) => (
                        <TableCell key={j}>
                          <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows.length ? (
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
                    <TableCell colSpan={columns.length}>
                      <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                        {emptyStateIcon ?? (
                          <svg
                            className="size-10 text-muted"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 3v2.25M14.25 3v2.25M3.75 7.5h16.5m-1.5 0V18a2.25 
                2.25 0 01-2.25 2.25H7.5A2.25 2.25 0 
                015.25 18V7.5m13.5 0H5.25"
                            />
                          </svg>
                        )}
                        <p className="text-sm">
                          {emptyStateMessage ??
                            "No records found for your selection."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        ) : (
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
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
                  <TableCell colSpan={columns.length}>
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
                      {emptyStateIcon ?? (
                        <svg
                          className="size-10 text-muted"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 3v2.25M14.25 3v2.25M3.75 7.5h16.5m-1.5 0V18a2.25 
                2.25 0 01-2.25 2.25H7.5A2.25 2.25 0 
                015.25 18V7.5m13.5 0H5.25"
                          />
                        </svg>
                      )}
                      <p className="text-sm">
                        {emptyStateMessage ??
                          "No records found for your selection."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {enablePagination && (
        <div className="flex items-center justify-between px-4">
          {enableSelection && (
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          )}
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (tabs && tabs.length > 0) {
    return (
      <Tabs
        defaultValue={defaultTab || tabs[0].value}
        className={`w-full flex-col justify-start gap-6 ${className || ""}`}
      >
        <div className="flex items-center justify-between px-4 lg:px-6">
          {/* Mobile tab selector */}
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <Select defaultValue={defaultTab || tabs[0].value}>
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              {tabs.map((tab) => (
                <SelectItem key={tab.value} value={tab.value}>
                  {tab.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Desktop tab list */}
          <TabsList className="hidden @4xl/main:flex">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
                {tab.badge && <Badge variant="secondary">{tab.badge}</Badge>}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {enableColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <IconLayoutColumns />
                    <span className="hidden lg:inline">Customize Columns</span>
                    <span className="lg:hidden">Columns</span>
                    <IconChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {table
                    .getAllColumns()
                    .filter(
                      (column) =>
                        typeof column.accessorFn !== "undefined" &&
                        column.getCanHide()
                    )
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "outline"}
                size="sm"
                onClick={action.onClick}
              >
                {action.icon}
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.value === (defaultTab || tabs[0].value) ? (
              <TableContent />
            ) : (
              tab.content
            )}
          </TabsContent>
        ))}
      </Tabs>
    );
  }

  return (
    <div className={`w-full flex-col justify-start gap-6 ${className || ""}`}>
      {(enableColumnVisibility || actions.length > 0) && (
        <div className="flex items-center justify-end gap-2 px-4 lg:px-6">
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Customize Columns</span>
                  <span className="lg:hidden">Columns</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "outline"}
              size="sm"
              onClick={action.onClick}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}
      <TableContent />
    </div>
  );
}
