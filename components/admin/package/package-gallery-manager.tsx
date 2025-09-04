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
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { ImageIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PackageGalleryForm } from "../forms/package-gallery-form";
import { PackageGalleryGetOne } from "@/modules/gallery/types";
import { IconFolder } from "@tabler/icons-react";
import { DataTable } from "@/components/data-table";

interface PackageGalleryManagerProps {
  packageId: string;
}

export function PackageGalleryManager({
  packageId,
}: PackageGalleryManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackageGalleryGetOne | null>(
    null
  );
  const [deletingItem, setDeletingItem] = useState<PackageGalleryGetOne | null>(
    null
  );

  const trpc = useTRPC();
  const { data: galleryItems = [], refetch } = useSuspenseQuery(
    trpc.packageGallery.getByPackageId.queryOptions({
      packageId: Number(packageId),
    })
  );

  const deleteMutation = useMutation(
    trpc.packageGallery.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("Gallery item deleted successfully");
        refetch();
        setDeletingItem(null);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const handleEdit = (item: PackageGalleryGetOne) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: PackageGalleryGetOne) => {
    setDeletingItem(item);
  };

  const confirmDelete = () => {
    if (deletingItem) {
      deleteMutation.mutate({ id: Number(deletingItem.id) });
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

  const columns: ColumnDef<PackageGalleryGetOne>[] = [
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <img
              src={item.imageUrl || "/placeholder.svg"}
              alt="Package image"
              className="h-12 w-12 object-cover rounded"
            />
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
                <TooltipContent>Edit gallery item</TooltipContent>
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
                <TooltipContent>Delete gallery item</TooltipContent>
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
            <CardTitle>Package Gallery</CardTitle>
            <CardDescription>Manage images for this package</CardDescription>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Image
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable<PackageGalleryGetOne>
          data={galleryItems}
          columns={columns}
          enableDragAndDrop={false}
          enableColumnVisibility={false}
          enablePagination={false}
          getRowId={(row) => {
            if (!row?.id) throw new Error("Row is missing an id");
            return row.id.toString();
          }}
          emptyStateMessage="No Package Gallery found."
          emptyStateIcon={
            <IconFolder className="size-10 text-muted-foreground" />
          }
        />
      </CardContent>

      <PackageGalleryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        packageId={packageId}
        galleryItem={editingItem}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDialog
        open={!!deletingItem}
        onOpenChange={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
        title="Delete Gallery Item"
        description="Are you sure you want to delete this image? This action cannot be undone."
      />
    </Card>
  );
}
