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
import { DestinationGetOne } from "@/modules/destination/types";
import { DestinationForm } from "./destination-form";
import { createDestinationColumns } from "./columns";

export function DestinationPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Item",
    "Are you sure you want to delete this item? This action cannot be undone."
  );

  const { data } = useSuspenseQuery(trpc.destinations.getAll.queryOptions());
  const removeDestination = useMutation(
    trpc.destinations.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.destinations.getAll.queryOptions()
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<
    DestinationGetOne | undefined
  >();

  const handleAddDestination = () => {
    setEditingDestination(undefined);
    setIsModalOpen(true);
  };

  const handleEditDestination = (Destination: DestinationGetOne) => {
    console.log(Destination);
    setEditingDestination(Destination);
    setIsModalOpen(true);
  };

  const handleDeleteDestination = async (id: number) => {
    const confirmed = await confirm();
    if (!confirmed) return;
    await removeDestination.mutateAsync({ id: id });
  };

  const handleSubmitDestination = async () => {
    setIsModalOpen(false);
  };

  const columns = createDestinationColumns({
    handleEditDestination,
    handleDeleteDestination,
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDestination(undefined);
  };

  return (
    <>
      <ConfirmDialog />
      <div className="container mx-auto py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Destination</h1>
              <p className="text-muted-foreground mt-2">
                Organize your content with custom Destination
              </p>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleAddDestination} className="gap-2">
                  <IconPlus className="h-4 w-4" />
                  Add Destination
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingDestination
                      ? "Edit Destination"
                      : "Create New Destination"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingDestination
                      ? "Update the Destination details below."
                      : "Add a new Destination to organize your content."}
                  </DialogDescription>
                </DialogHeader>
                <DestinationForm
                  intialValues={editingDestination}
                  onSubmit={handleSubmitDestination}
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
                No destination found
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Get started by creating your first Destination
              </p>
            </CardContent>
          </Card>
        ) : (
          <DataTable<DestinationGetOne>
            data={data}
            columns={columns}
            enableDragAndDrop={false}
            enableColumnVisibility={false}
            enablePagination={true}
            getRowId={(row) => {
              if (!row?.id) throw new Error("Row is missing an id");
              return row.id.toString();
            }}
            emptyStateMessage="No destinations found."
            emptyStateIcon={
              <IconFolder className="size-10 text-muted-foreground" />
            }
          />
        )}
      </div>
    </>
  );
}
