"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PackageItineraryForm } from "../forms/package-itinerary-form";
import { PackageItineraryGetOne } from "@/modules/itinerary/types";
import { IconFolder } from "@tabler/icons-react";

interface PackageItineraryManagerProps {
  packageId: string;
}

export function PackageItineraryManager({
  packageId,
}: PackageItineraryManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackageItineraryGetOne | null>(
    null
  );
  const [deletingItem, setDeletingItem] =
    useState<PackageItineraryGetOne | null>(null);

  const trpc = useTRPC();
  const { data: itinerary = [], refetch } = useSuspenseQuery(
    trpc.packageItinerary.getByPackageId.queryOptions({
      packageId: Number(packageId),
    })
  );

  const deleteMutation = useMutation(
    trpc.packageItinerary.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("Itinerary item deleted successfully");
        refetch();
        setDeletingItem(null);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const handleEdit = (item: PackageItineraryGetOne) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: PackageItineraryGetOne) => {
    setDeletingItem(item);
  };

  const confirmDelete = () => {
    if (deletingItem) {
      deleteMutation.mutate({ id: deletingItem.id });
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleFormSuccess = () => {
    refetch();
    handleFormClose();
  };

  const columns: ColumnDef<PackageItineraryGetOne>[] = [
    {
      accessorKey: "dayNumber",
      header: "Day",
      cell: ({ row }) => {
        const dayNumber = row.getValue("dayNumber") as number;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="font-medium">Day {dayNumber}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const title = row.getValue("title") as string;
        return <span className="font-medium">{title}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit itinerary item</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete itinerary item</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        );
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Package Itinerary</CardTitle>
            <CardDescription>
              Day-by-day itinerary for this package
            </CardDescription>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Day
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable<PackageItineraryGetOne>
          data={itinerary}
          columns={columns}
          enableDragAndDrop={false}
          enableColumnVisibility={false}
          enablePagination={false}
          getRowId={(row) => {
            if (!row?.id) throw new Error("Row is missing an id");
            return row.id.toString();
          }}
          emptyStateMessage="No Package Itinerary found."
          emptyStateIcon={
            <IconFolder className="size-10 text-muted-foreground" />
          }
        />
      </CardContent>

      <PackageItineraryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        packageId={packageId}
        itineraryItem={editingItem}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDialog
        open={!!deletingItem}
        onOpenChange={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
        title="Delete Itinerary Item"
        description={`Are you sure you want to delete Day ${deletingItem?.dayNumber}? This action cannot be undone.`}
      />
    </Card>
  );
}
