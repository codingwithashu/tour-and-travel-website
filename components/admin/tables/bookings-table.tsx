"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2, Calendar, Users, Phone, Mail } from "lucide-react";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type Booking = {
  id: number;
  package_id: number;
  full_name: string;
  email: string;
  phone: string;
  departure_date: string;
  return_date: string;
  travelers: number;
  room_type: string;
  status: string;
  created_at: string;
  packages?: { title: string };
};

interface BookingsTableProps {
  onEdit: (booking: Booking) => void;
  onAdd: () => void;
}

export function BookingsTable({ onEdit, onAdd }: BookingsTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const trpc = useTRPC();

  const { data: bookings = [], refetch } = useSuspenseQuery(
    trpc.bookings.getAll.queryOptions()
  );

  const deleteMutation = useMutation(
    trpc.bookings.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("bookings delete successfully");
        refetch();
        setDeleteId(null);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync({ id });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <SortableHeader column={column}>Customer</SortableHeader>
      ),
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div>
            <div className="font-medium">{booking.full_name}</div>
            <div className="text-sm text-muted-foreground flex items-center mt-1">
              <Mail className="h-3 w-3 mr-1" />
              {booking.email}
            </div>
            <div className="text-sm text-muted-foreground flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              {booking.phone}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "packages.title",
      header: "Package",
      cell: ({ row }) => {
        const packageTitle = row.original.packages?.title;
        return packageTitle ? (
          <Badge variant="outline">{packageTitle}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "departure_date",
      header: ({ column }) => (
        <SortableHeader column={column}>Travel Dates</SortableHeader>
      ),
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="text-sm">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="font-medium">Departure:</span>
            </div>
            <div className="ml-4">{booking.departure_date}</div>
            <div className="flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="font-medium">Return:</span>
            </div>
            <div className="ml-4">{booking.return_date}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "travelers",
      header: "Details",
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="text-sm">
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{booking.travelers} travelers</span>
            </div>
            <div className="text-muted-foreground mt-1">
              Room: {booking.room_type}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <SortableHeader column={column}>Status</SortableHeader>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <SortableHeader column={column}>Booked On</SortableHeader>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at") as string);
        return <div className="text-sm">{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(booking)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit booking</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(booking.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete booking</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
        <Button onClick={onAdd}>Add Booking</Button>
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        searchKey="full_name"
        searchPlaceholder="Search bookings..."
      />

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              booking.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
