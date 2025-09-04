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
import { Plus, Edit, Trash2, Star } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PackageHighlightForm } from "../forms/package-highlight-form";
import { PackageHighlightGetOne } from "@/modules/highlights/types";
import { IconFolder } from "@tabler/icons-react";

interface PackageHighlightsManagerProps {
  packageId: string;
}

export function PackageHighlightsManager({
  packageId,
}: PackageHighlightsManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackageHighlightGetOne | null>(
    null
  );
  const [deletingItem, setDeletingItem] =
    useState<PackageHighlightGetOne | null>(null);

  const trpc = useTRPC();
  const { data: highlights = [], refetch } = useSuspenseQuery(
    trpc.packageHighlights.getByPackageId.queryOptions({
      packageId: Number(packageId),
    })
  );

  const deleteMutation = useMutation(
    trpc.packageHighlights.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("Highlight deleted successfully");
        refetch();
        setDeletingItem(null);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const handleEdit = (item: PackageHighlightGetOne) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: PackageHighlightGetOne) => {
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

  const columns: ColumnDef<PackageHighlightGetOne>[] = [
    {
      accessorKey: "highlight",
      header: "Highlight",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="font-medium">{item.highlight}</span>
          </div>
        );
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
                <TooltipContent>Edit highlight</TooltipContent>
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
                <TooltipContent>Delete highlight</TooltipContent>
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
            <CardTitle>Package Highlights</CardTitle>
            <CardDescription>
              Key highlights and features of this package
            </CardDescription>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Highlight
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable<PackageHighlightGetOne>
          data={highlights}
          columns={columns}
          enableDragAndDrop={false}
          enableColumnVisibility={false}
          enablePagination={false}
          getRowId={(row) => {
            if (!row?.id) throw new Error("Row is missing an id");
            return row.id.toString();
          }}
          emptyStateMessage="No Package Highlight found."
          emptyStateIcon={
            <IconFolder className="size-10 text-muted-foreground" />
          }
        />
      </CardContent>

      <PackageHighlightForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        packageId={packageId}
        highlight={editingItem}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDialog
        open={!!deletingItem}
        onOpenChange={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
        title="Delete Highlight"
        description="Are you sure you want to delete this highlight? This action cannot be undone."
      />
    </Card>
  );
}
