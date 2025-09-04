import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Trash2 } from "lucide-react";
import { DestinationGetOne } from "@/modules/destination/types";
import { IconCategory } from "@tabler/icons-react";
import { SortableHeader } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";

interface DestinationColumnsProps {
  handleEditDestination: (Destination: DestinationGetOne) => void;
  handleDeleteDestination: (id: number) => void;
}

export const createDestinationColumns = ({
  handleEditDestination,
  handleDeleteDestination,
}: DestinationColumnsProps): ColumnDef<DestinationGetOne>[] => [
  {
    accessorKey: "name" as keyof DestinationGetOne,
    header: "Destination Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary">
            <IconCategory className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.original?.name}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <SortableHeader column={column}>Location</SortableHeader>
    ),
    cell: ({ row }) => {
      const destination = row.original!;
      return (
        <div>
          <div>{destination.country}</div>
          {destination.region && (
            <div className="text-sm text-muted-foreground">
              {destination.region}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original?.category;
      return category ? (
        <Badge variant="secondary">{category}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "packageCount",
    header: ({ column }) => (
      <SortableHeader column={column}>Packages</SortableHeader>
    ),
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("packageCount")}</Badge>
    ),
  },
  {
    accessorKey: "startingPrice",
    header: ({ column }) => (
      <SortableHeader column={column}>Starting Price</SortableHeader>
    ),
    cell: ({ row }) => {
      const price = row.getValue("startingPrice") as string;
      return price ? `$${price}` : "-";
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <SortableHeader column={column}>Rating</SortableHeader>
    ),
    cell: ({ row }) => {
      const rating = row.getValue("rating") as string;
      const reviewCount = row.original?.reviewCount;
      return rating ? (
        <div className="flex items-center space-x-1">
          <span>⭐ {rating}</span>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>
      ) : (
        "-"
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const Destination = row.original;
      return (
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditDestination(Destination)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Destination</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (Destination?.id !== undefined) {
                      handleDeleteDestination(Destination.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Destination</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },
];
