import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Bed, Calendar, Edit, Trash2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { BookingsGetOne } from "@/modules/bookings/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingStatus } from "@/types";

interface BookingsColumnsProps {
  handleDeleteBookings: (id: number) => void;
  onStatusChange: (id: number, status: BookingStatus) => void;
}

export const createBookingsColumns = ({
  handleDeleteBookings,
  onStatusChange,
}: BookingsColumnsProps): ColumnDef<BookingsGetOne>[] => [
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const { fullName, email, phone } = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{fullName}</span>
          <span className="text-xs text-muted-foreground">{email}</span>
          <span className="text-xs text-muted-foreground">{phone}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "packageTitle",
    header: "Package",
    cell: ({ row }) => (
      <div className="max-w-48">
        <span className="font-medium text-sm truncate block">
          {row.original.packageTitle || (
            <span className="text-muted-foreground italic">
              No package selected
            </span>
          )}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "dates",
    header: "Travel Date",
    cell: ({ row }) => {
      const { departureDate, returnDate } = row.original;
      const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });
      };

      return (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-sm">
            <span className="text-green-600 font-medium">
              {formatDate(departureDate)}
            </span>
            <span className="mx-2 text-muted-foreground">→</span>
            <span className="text-orange-600 font-medium">
              {formatDate(returnDate)}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {Math.ceil(
              (new Date(returnDate).getTime() -
                new Date(departureDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "travelers",
    header: "Travelers",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <Users className="mr-1 h-3 w-3" />
          {row.original.travelers}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "roomType",
    header: "Room",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Badge
          variant="secondary"
          className="bg-purple-50 text-purple-700 border-purple-200"
        >
          <Bed className="mr-1 h-3 w-3" />
          {row.original.roomType}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const booking = row.original;

      const getStatusConfig = (status: string) => {
        switch (status?.toLowerCase()) {
          case "confirmed":
            return {
              variant: "default" as const,
              className:
                "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
            };
          case "pending":
            return {
              variant: "secondary" as const,
              className:
                "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
            };
          case "completed":
            return {
              variant: "outline" as const,
              className:
                "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
            };
          case "cancelled":
            return {
              variant: "destructive" as const,
              className:
                "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
            };
          default:
            return {
              variant: "outline" as const,
              className: "bg-gray-100 text-gray-800 border-gray-200",
            };
        }
      };

      const statusConfig = getStatusConfig(status ?? "");

      return (
        <Select
          value={status ?? ""}
          onValueChange={(newStatus) =>
            onStatusChange(booking.id, newStatus as BookingStatus)
          }
        >
          <SelectTrigger className={`w-32 h-8 border-1 focus:ring-0`}>
            <SelectValue>
              {status
                ? status.charAt(0).toUpperCase() + status.slice(1)
                : "N/A"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                Pending
              </div>
            </SelectItem>
            <SelectItem value="confirmed">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Confirmed
              </div>
            </SelectItem>
            <SelectItem value="completed">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Completed
              </div>
            </SelectItem>
            <SelectItem value="cancelled">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                Cancelled
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const createdDate = new Date(row.original.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {createdDate.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "2-digit",
            })}
          </span>
          <span className="text-xs text-muted-foreground">
            {diffDays === 1
              ? "Today"
              : diffDays === 2
              ? "Yesterday"
              : `${diffDays - 1} days ago`}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
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
                  onClick={() => handleDeleteBookings(booking.id)}
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
