import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import { CategoryGetOne } from "@/modules/category/types";
import {
  CategoryFormData,
  createCategorySchema,
} from "@/modules/category/schema";
interface CategoryFormProps {
  intialValues?: CategoryGetOne;
  onSubmit: () => void;
  onCancel: () => void;
}

export function CategoryForm({
  intialValues,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createCategory = useMutation(
    trpc.categories.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.categories.getAll.queryOptions()
        );

        onSubmit?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const updateCategory = useMutation(
    trpc.categories.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.categories.getAll.queryOptions()
        );
        if (intialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.categories.getById.queryOptions({ id: intialValues.id })
          );
        }

        onSubmit?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: intialValues?.name || "",
      description: intialValues?.description || "",
      slug: intialValues?.slug || "",
    },
    values: {
      name: intialValues?.name || "",
      description: intialValues?.description || "",
      slug: intialValues?.slug || "",
    },
  });

  const isEdit = !!intialValues?.id;
  const isLoading =
    form.formState.isSubmitting ||
    createCategory.isPending ||
    updateCategory.isPending;

  const handleSubmit = (data: CategoryFormData) => {
    if (isEdit) {
      updateCategory.mutate({
        ...data,
        id: intialValues.id,
      });
    } else {
      createCategory.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter category name"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A clear and descriptive name for your category
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what this category is about..."
                    className="min-h-[100px]"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a detailed description of what this category covers
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : isEdit
              ? "Update Category"
              : "Create Category"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
