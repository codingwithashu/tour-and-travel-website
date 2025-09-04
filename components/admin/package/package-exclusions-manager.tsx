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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Edit, Trash2, X } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTRPC } from "@/trpc/client";
import { PackageExclusionForm } from "../forms/package-exclusion-form";
import { PackageExclusionGetOne } from "@/modules/exclusions/types";
import { DataTable } from "@/components/data-table";
import { IconFolder } from "@tabler/icons-react";
import { BulkPackageExclusionForm } from "../forms/bulk-package-exclusion-form";

interface PackageExclusionsManagerProps {
  packageId: string;
}

export function PackageExclusionsManager({
  packageId,
}: PackageExclusionsManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackageExclusionGetOne | null>(
    null
  );
  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);

  const [deletingItem, setDeletingItem] =
    useState<PackageExclusionGetOne | null>(null);

  // Updated to use new tRPC pattern
  const trpc = useTRPC();
  const { data: exclusions = [], refetch } = useSuspenseQuery(
    trpc.packageExclusions.getByPackageId.queryOptions({
      packageId: Number(packageId),
    })
  );

  const deleteMutation = useMutation(
    trpc.packageExclusions.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("Exclusion deleted successfully");
        refetch();
        setDeletingItem(null);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const handleEdit = (item: PackageExclusionGetOne) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: PackageExclusionGetOne) => {
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

  const columns: ColumnDef<PackageExclusionGetOne>[] = [
    {
      // Updated to use exclusion field from schema
      accessorKey: "exclusion",
      header: "Exclusion",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <X className="h-4 w-4 text-red-600" />
            <span className="font-medium">{item.exclusion}</span>
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
                <TooltipContent>Edit exclusion</TooltipContent>
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
                <TooltipContent>Delete exclusion</TooltipContent>
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
            <CardTitle>Package Exclusions</CardTitle>
            <CardDescription>
              What's not included in this package
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsBulkFormOpen(true)} variant="secondary">
              <Plus className="mr-2 h-4 w-4" />
              Bulk Add
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Exclusion
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable<PackageExclusionGetOne>
          data={exclusions}
          columns={columns}
          enableDragAndDrop={false}
          enableColumnVisibility={false}
          enablePagination={false}
          getRowId={(row) => {
            if (!row?.id) throw new Error("Row is missing an id");
            return row.id.toString();
          }}
          emptyStateMessage="No Package Exclusion found."
          emptyStateIcon={
            <IconFolder className="size-10 text-muted-foreground" />
          }
        />
      </CardContent>

      <PackageExclusionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        packageId={packageId}
        exclusion={editingItem}
        onSuccess={handleFormSuccess}
      />

      <BulkPackageExclusionForm
        open={isBulkFormOpen}
        onOpenChange={setIsBulkFormOpen}
        packageId={packageId}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDialog
        open={!!deletingItem}
        onOpenChange={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
        title="Delete Exclusion"
        description="Are you sure you want to delete this exclusion? This action cannot be undone."
      />
    </Card>
  );
}
