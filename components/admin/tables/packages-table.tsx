"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
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
import { Edit, Trash2, Star } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Package } from "@/types";

interface PackagesTableProps {
  onEdit: (pkg: Package) => void;
  onAdd: () => void;
}

export function PackagesTable({ onEdit, onAdd }: PackagesTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const trpc = useTRPC();

  const { data: packages = [], refetch } = useSuspenseQuery(
    trpc.packages.getAll.queryOptions()
  );

  console.log(packages);

  const deleteMutation = useMutation(
    trpc.packages.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("categories delete successfully");
        refetch();
        setDeleteId(null);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync({ id });
  };

  const columns: ColumnDef<Package>[] = [
    {
      accessorKey: "title1",
      header: ({ column }) => (
        <SortableHeader column={column}>Package</SortableHeader>
      ),
      cell: ({ row }) => {
        const pkg = row.original;
        return (
          <div className="flex items-center space-x-2">
            {pkg.image && (
              <img
                src={pkg.image}
                alt={pkg.title}
                className="h-8 w-8 rounded object-cover"
              />
            )}
            <div>
              <div className="font-medium flex items-center space-x-2">
                <span>{pkg.title}</span>
                {pkg.featured && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
              <div className="text-sm text-muted-foreground">{pkg.slug} 11</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "destinationName",
      header: "Destination",
      cell: ({ row }) => {
        const destination = row.original.destinationName;
        return destination ? (
          <Badge variant="outline">{destination}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "categoryName",
      header: "Category1",
      cell: ({ row }) => {
        const category = row.original.categoryName;
        return category ? (
          <Badge variant="secondary">{category}</Badge>
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
      header: ({ column }) => (
        <SortableHeader column={column}>Price</SortableHeader>
      ),
      cell: ({ row }) => {
        const price = row.getValue("price") as string;
        const originalPrice = row.original.originalPrice;
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
      header: ({ column }) => (
        <SortableHeader column={column}>Rating</SortableHeader>
      ),
      cell: ({ row }) => {
        const rating = row.getValue("rating") as string;
        const reviewCount = row.original.reviewCount;
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
      enableHiding: false,
      cell: ({ row }) => {
        const pkg = row.original;
        return (
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(pkg)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit package</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(Number(pkg.id))}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete package</TooltipContent>
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
        <h2 className="text-2xl font-bold tracking-tight">Packages</h2>
        <Button onClick={onAdd}>Add Package</Button>
      </div>

      <DataTable
        columns={columns}
        data={packages}
        searchKey="title"
        searchPlaceholder="Search packages..."
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
              package and all associated data.
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
