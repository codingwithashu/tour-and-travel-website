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
import { Edit, Eye, Trash2 } from "lucide-react";
import { IconCategory } from "@tabler/icons-react";
import { SortableHeader } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { PackagesGetOne } from "@/modules/packages/types";
import Link from "next/link";

interface PackagesColumnsProps {
  handleEditPackages: (Packages: PackagesGetOne) => void;
  handleDeletePackages: (id: number) => void;
}

export const createPackagesColumns = ({
  handleEditPackages,
  handleDeletePackages,
}: PackagesColumnsProps): ColumnDef<PackagesGetOne>[] => [
  {
    accessorKey: "name" as keyof PackagesGetOne,
    header: "Package Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary">
            <IconCategory className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.original?.title}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "categoryName",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original?.categoryName;
      return category ? (
        <Badge variant="secondary">{category}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "destinationName",
    header: "Destination",
    cell: ({ row }) => {
      const destination = row.original?.destinationName;
      return destination ? (
        <Badge variant="outline">{destination}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as string;
      return duration || "-";
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as string;
      const originalPrice = row.original?.originalPrice;
      return (
        <div>
          <div className="font-medium">${price}</div>
          {originalPrice && (
            <div className="text-sm text-muted-foreground line-through">
              ${originalPrice}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as string;
      const reviewCount = row.original?.reviewCount;
      return rating ? (
        <div className="flex items-center space-x-1">
          <span>⭐ {rating}</span>
          <span className="text-sm text-muted-foreground">
            ({reviewCount || 0})
          </span>
        </div>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      const featured = row.getValue("featured") as boolean;
      return (
        <Badge variant={featured ? "default" : "secondary"}>
          {featured ? "Yes" : "No"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const Packages = row.original;
      return (
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/packages/${Packages?.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View details</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditPackages(Packages)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit package</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (Packages?.id !== undefined) {
                      handleDeletePackages(Packages.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete package</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      );
    },
  },
];
