"use client";

import React, { useState } from "react";
import {
  IconFolder,
  IconLayoutGrid,
  IconList,
  IconFilter,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useConfirm } from "@/components/ConfirmDialog";
import { DataTable } from "@/components/data-table";
import { BookingsGetOne } from "@/modules/bookings/types";
import { createBookingsColumns } from "./columns";
import { BookingsCards } from "./BookingsCards";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { BookingStatus } from "@/types";

type ViewMode = "cards" | "list";
type StatusFilter = "all" | BookingStatus;

export function BookingsPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Booking",
    "Are you sure you want to delete this booking? This action cannot be undone."
  );

  // View state management
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allData } = useSuspenseQuery(
    trpc.bookings.getAll.queryOptions()
  );

  // Filter and search logic
  const filteredData = React.useMemo(() => {
    let filtered = allData || [];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (booking) =>
          booking.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.fullName?.toLowerCase().includes(searchLower) ||
          booking.id?.toString().includes(searchLower)
      );
    }

    return filtered;
  }, [allData, statusFilter, searchTerm]);

  const removeBookings = useMutation(
    trpc.bookings.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.bookings.getAll.queryOptions()
        );
        toast.success("Booking deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  // Status update mutation (you'll need to implement this in your TRPC router)
  const updateBookingStatus = useMutation(
    trpc.bookings.updateStatus.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.bookings.getAll.queryOptions()
        );
        toast.success("Booking status updated successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleDeleteBookings = async (id: number) => {
    const confirmed = await confirm();
    if (!confirmed) return;
    await removeBookings.mutateAsync({ id });
  };

  const handleStatusChange = async (id: number, status: BookingStatus) => {
    await updateBookingStatus.mutateAsync({ id, status });
  };

  const columns = createBookingsColumns({
    handleDeleteBookings,
    onStatusChange: handleStatusChange,
  });

  // Get status counts for filter badges
  const statusCounts = React.useMemo(() => {
    const counts = {
      all: allData?.length || 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    allData?.forEach((booking) => {
      const status = booking.status?.toLowerCase() as keyof typeof counts;
      if (status && status in counts) {
        counts[status]++;
      }
    });

    return counts;
  }, [allData]);

  const getStatusVariant = (status: StatusFilter) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
        return "default";
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <>
      <ConfirmDialog />
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-6">
            {/* Title and Stats */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Bookings Management
                </h1>
                <p className="text-muted-foreground mt-2">
                  View and manage customer bookings • {filteredData.length} of{" "}
                  {allData?.length || 0} bookings
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  Total: {statusCounts.all}
                </Badge>
                {statusCounts.pending > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    Pending: {statusCounts.pending}
                  </Badge>
                )}
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg border">
              {/* Left side - Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <IconFilter className="h-4 w-4" />
                      Status:{" "}
                      {statusFilter === "all"
                        ? "All"
                        : statusFilter.charAt(0).toUpperCase() +
                          statusFilter.slice(1)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(statusCounts).map(([status, count]) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => setStatusFilter(status as StatusFilter)}
                        className="flex items-center justify-between"
                      >
                        <span className="capitalize">{status}</span>
                        <Badge
                          variant={getStatusVariant(status as StatusFilter)}
                          className="ml-2"
                        >
                          {count}
                        </Badge>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Right side - View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-background rounded-md border">
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="gap-2"
                >
                  <IconLayoutGrid className="h-4 w-4" />
                  Cards
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="gap-2"
                >
                  <IconList className="h-4 w-4" />
                  List
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {!filteredData.length ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <IconFolder className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm || statusFilter !== "all"
                  ? "No bookings match your filters"
                  : "No bookings found"}
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search terms or filters to find what you're looking for."
                  : "Bookings will appear here once customers start making reservations."}
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <div className="flex gap-2">
                  {searchTerm && (
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Clear search
                    </Button>
                  )}
                  {statusFilter !== "all" && (
                    <Button
                      variant="outline"
                      onClick={() => setStatusFilter("all")}
                    >
                      Clear filter
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="gap-y-4">
            {/* View Mode Content */}
            {viewMode === "cards" ? (
              <BookingsCards
                data={filteredData}
                onDelete={handleDeleteBookings}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <DataTable
                data={filteredData}
                columns={columns}
                enableDragAndDrop={false}
                enableColumnVisibility={false}
                enablePagination={true}
                getRowId={(row) => {
                  if (!row?.id) throw new Error("Row is missing an id");
                  return row.id.toString();
                }}
                emptyStateMessage="No bookings found."
                emptyStateIcon={
                  <IconFolder className="size-10 text-muted-foreground" />
                }
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
