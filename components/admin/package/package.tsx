"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useTRPC } from "@/trpc/client";
import { DataTable } from "@/components/data-table";
import { PackagesGetOne } from "@/modules/packages/types";
import { useConfirm } from "@/components/ConfirmDialog";
import { createPackagesColumns } from "./columns";
import { PackageForm } from "./package-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconCategory, IconFolder, IconPlus } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";

export function PackagesScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<
    PackagesGetOne | undefined
  >();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Item",
    "Are you sure you want to delete this item? This action cannot be undone."
  );

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: packages = [], refetch } = useSuspenseQuery(
    trpc.packages.getAll.queryOptions()
  );

  const deleteMutation = useMutation(
    trpc.packages.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("Package deleted successfully");
        await queryClient.invalidateQueries(
          trpc.packages.getAll.queryOptions()
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const handleAddPackages = () => {
    setEditingPackage(undefined);
    setIsModalOpen(true);
  };

  const handleEditPackages = (pkg: PackagesGetOne) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleDeletePackages = async (id: number) => {
    const confirmed = await confirm();
    if (!confirmed) return;
    await deleteMutation.mutate({ id });
  };

  const handleSubmitPackages = async () => {
    setIsModalOpen(false);
  };

  const columns = createPackagesColumns({
    handleEditPackages,
    handleDeletePackages,
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPackage(undefined);
  };

  return (
    <>
      <ConfirmDialog />
      <div className="container mx-auto py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance">Packages</h1>
              <p className="text-muted-foreground">
                Manage your travel packages
              </p>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddPackages} className="gap-2">
                  <IconPlus className="h-4 w-4" />
                  Add Packages
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingPackage ? "Edit Packages" : "Create New Packages"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPackage
                      ? "Update the Packages details below."
                      : "Add a new Packages to organize your content."}
                  </DialogDescription>
                </DialogHeader>
                <PackageForm
                  package={editingPackage}
                  onSubmit={handleSubmitPackages}
                  onCancel={handleCloseModal}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {!packages.length ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <IconCategory className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Packages found</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Get started by creating your first Destination
              </p>
            </CardContent>
          </Card>
        ) : (
          <DataTable<PackagesGetOne>
            data={packages}
            columns={columns}
            enableDragAndDrop={false}
            enableColumnVisibility={false}
            enablePagination={true}
            getRowId={(row) => {
              if (!row?.id) throw new Error("Row is missing an id");
              return row.id.toString();
            }}
            emptyStateMessage="No Packages found."
            emptyStateIcon={
              <IconFolder className="size-10 text-muted-foreground" />
            }
          />
        )}
      </div>
    </>
  );
}
