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
import { Plus, Edit, Trash2, Check } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PackageInclusionForm } from "../forms/package-inclusion-form";
import { PackageInclusionGetOne } from "@/modules/inculsions/types";
import { IconFolder } from "@tabler/icons-react";
import { BulkPackageInclusionForm } from "../forms/bulk-package-inclusion-form";

interface PackageInclusionsManagerProps {
  packageId: string;
}

export function PackageInclusionsManager({
  packageId,
}: PackageInclusionsManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackageInclusionGetOne | null>(
    null
  );
  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);

  const [deletingItem, setDeletingItem] =
    useState<PackageInclusionGetOne | null>(null);

  const trpc = useTRPC();
  const { data: inclusions = [], refetch } = useSuspenseQuery(
    trpc.packageInclusions.getByPackageId.queryOptions({
      packageId: Number(packageId),
    })
  );

  const deleteMutation = useMutation(
    trpc.packageInclusions.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("Inclusion deleted successfully");
        refetch();
        setDeletingItem(null);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const handleEdit = (item: PackageInclusionGetOne) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: PackageInclusionGetOne) => {
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

  const columns: ColumnDef<PackageInclusionGetOne>[] = [
    {
      accessorKey: "inclusion",
      header: "Inclusion",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="font-medium">{item.inclusion}</span>
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
                <TooltipContent>Edit inclusion</TooltipContent>
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
                <TooltipContent>Delete inclusion</TooltipContent>
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
            <CardTitle>Package Inclusions</CardTitle>
            <CardDescription>What's included in this package</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsBulkFormOpen(true)} variant="secondary">
              <Plus className="mr-2 h-4 w-4" />
              Bulk Add
            </Button>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Inclusion
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable<PackageInclusionGetOne>
          columns={columns}
          enableDragAndDrop={false}
          enableColumnVisibility={false}
          enablePagination={false}
          getRowId={(row) => {
            if (!row?.id) throw new Error("Row is missing an id");
            return row.id.toString();
          }}
          emptyStateMessage="No Package Inclusion found."
          emptyStateIcon={
            <IconFolder className="size-10 text-muted-foreground" />
          }
          data={inclusions}
        />
      </CardContent>

      <PackageInclusionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        packageId={packageId}
        inclusion={editingItem}
        onSuccess={handleFormSuccess}
      />
      <BulkPackageInclusionForm
        open={isBulkFormOpen}
        onOpenChange={setIsBulkFormOpen}
        packageId={packageId}
        onSuccess={handleFormSuccess}
      />
      <ConfirmDialog
        open={!!deletingItem}
        onOpenChange={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
        title="Delete Inclusion"
        description="Are you sure you want to delete this inclusion? This action cannot be undone."
      />
    </Card>
  );
}
