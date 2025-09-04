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
import { PackageReviewGetOne } from "@/modules/reviews/types";
import { IconFolder } from "@tabler/icons-react";
import { PackageReviewForm } from "../forms/package-review-form";

interface PackageReviewsManagerProps {
  packageId: string;
}

export function PackageReviewsManager({
  packageId,
}: PackageReviewsManagerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackageReviewGetOne | null>(
    null
  );
  const [deletingItem, setDeletingItem] = useState<PackageReviewGetOne | null>(
    null
  );

  const trpc = useTRPC();
  const { data: highlights = [], refetch } = useSuspenseQuery(
    trpc.packageReviews.getByPackageId.queryOptions({
      packageId: Number(packageId),
    })
  );

  const deleteMutation = useMutation(
    trpc.packageReviews.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("Review deleted successfully");
        refetch();
        setDeletingItem(null);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const handleEdit = (item: PackageReviewGetOne) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: PackageReviewGetOne) => {
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

  const columns: ColumnDef<PackageReviewGetOne>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="font-medium">{item.title}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="font-medium">{item.comment}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "userName",
      header: "userName",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="font-medium">{item.userName}</span>
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
            <CardTitle>Package Reviews</CardTitle>
            <CardDescription>
              Key highlights and features of this package
            </CardDescription>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Review
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable<PackageReviewGetOne>
          data={highlights}
          columns={columns}
          enableDragAndDrop={false}
          enableColumnVisibility={false}
          enablePagination={false}
          getRowId={(row) => {
            if (!row?.id) throw new Error("Row is missing an id");
            return row.id.toString();
          }}
          emptyStateMessage="No Package Review found."
          emptyStateIcon={
            <IconFolder className="size-10 text-muted-foreground" />
          }
        />
      </CardContent>

      <PackageReviewForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        packageId={packageId}
        review={editingItem}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDialog
        open={!!deletingItem}
        onOpenChange={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
        title="Delete Review"
        description="Are you sure you want to delete this highlight? This action cannot be undone."
      />
    </Card>
  );
}
