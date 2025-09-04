"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  SortableHeader,
  RowActions,
} from "@/components/ui/data-table";
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
import { Edit, Trash2 } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Destination } from "@/types";

interface DestinationsTableProps {
  onEdit: (destination: Destination) => void;
  onAdd: () => void;
}

export function DestinationsTable({ onEdit, onAdd }: DestinationsTableProps) {
  const trpc = useTRPC();

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: destinations = [], refetch } = useSuspenseQuery(
    trpc.destinations.getAll.queryOptions()
  );

  const deleteMutation = useMutation(
    trpc.destinations.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("destinations delete successfully");
        refetch();
        setDeleteId(null);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync({ id });
  };

  const columns: ColumnDef<Destination>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortableHeader column={column}>Name</SortableHeader>
      ),
      cell: ({ row }) => {
        const destination = row.original;
        return (
          <div className="flex items-center space-x-2">
            {destination.image && (
              <img
                src={destination.image}
                alt={destination.name}
                className="h-8 w-8 rounded object-cover"
              />
            )}
            <div>
              <div className="font-medium">{destination.name}</div>
              <div className="text-sm text-muted-foreground">
                {destination.slug}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "country",
      header: ({ column }) => (
        <SortableHeader column={column}>Location</SortableHeader>
      ),
      cell: ({ row }) => {
        const destination = row.original;
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
        const category = row.original.category;
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
        const reviewCount = row.original.reviewCount;
        return rating ? (
          <div className="flex items-center space-x-1">
            <span>⭐ {rating}</span>
            <span className="text-sm text-muted-foreground">
              ({reviewCount})
            </span>
          </div>
        ) : (
          "-"
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const destination = row.original;
        return (
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(destination)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit destination</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(Number(destination.id))}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete destination</TooltipContent>
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
        <h2 className="text-2xl font-bold tracking-tight">Destinations</h2>
        <Button onClick={onAdd}>Add Destination</Button>
      </div>

      <DataTable
        columns={columns}
        data={destinations}
        searchKey="name"
        searchPlaceholder="Search destinations..."
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
              destination and all associated data.
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
