"use client";

import React, { useState } from "react";
import { IconCategory, IconFolder } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useConfirm } from "@/components/ConfirmDialog";
import { DataTable } from "@/components/data-table";
import { createCategoryColumns } from "./columns";
import { CategoryForm } from "./category-form";
import { CategoryGetOne } from "@/modules/category/types";

export function CategoryPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Item",
    "Are you sure you want to delete this item? This action cannot be undone."
  );

  const { data } = useSuspenseQuery(trpc.categories.getAll.queryOptions());
  
  const removeCategory = useMutation(
    trpc.categories.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.categories.getAll.queryOptions()
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    CategoryGetOne | undefined
  >();

  const handleAddCategory = () => {
    setEditingCategory(undefined);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: CategoryGetOne) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (id: number) => {
    const confirmed = await confirm();
    if (!confirmed) return;
    await removeCategory.mutateAsync({ id: id });
  };

  const handleSubmitCategory = async () => {
    setIsModalOpen(false);
  };

  const columns = createCategoryColumns({
    handleEditCategory,
    handleDeleteCategory,
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(undefined);
  };

  return (
    <>
      <ConfirmDialog />
      <div className="container mx-auto py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
              <p className="text-muted-foreground mt-2">
                Organize your content with custom categories
              </p>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddCategory} className="gap-2">
                  <IconPlus className="h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Edit Category" : "Create New Category"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCategory
                      ? "Update the category details below."
                      : "Add a new category to organize your content."}
                  </DialogDescription>
                </DialogHeader>
                <CategoryForm
                  intialValues={editingCategory}
                  onSubmit={handleSubmitCategory}
                  onCancel={handleCloseModal}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {!data.length ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <IconCategory className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No categories found
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Get started by creating your first category
              </p>
            </CardContent>
          </Card>
        ) : (
          <DataTable<CategoryGetOne>
            data={data}
            columns={columns}
            enableDragAndDrop={false}
            enableColumnVisibility={false}
            enablePagination={true}
            getRowId={(row) => row.id.toString()}
            emptyStateMessage="No categories found."
            emptyStateIcon={
              <IconFolder className="size-10 text-muted-foreground" />
            }
          />
        )}
      </div>
    </>
  );
}
