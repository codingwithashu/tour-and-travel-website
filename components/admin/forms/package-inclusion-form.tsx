"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PackageInclusionGetOne } from "@/modules/inculsions/types";

interface PackageInclusionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: string;
  inclusion?: PackageInclusionGetOne | null;
  onSuccess: () => void;
}

export function PackageInclusionForm({
  open,
  onOpenChange,
  packageId,
  inclusion,
  onSuccess,
}: PackageInclusionFormProps) {
  const [formData, setFormData] = useState({
    inclusion: "",
  });

  const trpc = useTRPC();

  const createMutation = useMutation(
    trpc.packageInclusions.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Package inclusion created successfully");
        onSuccess();
        resetForm();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const updateMutation = useMutation(
    trpc.packageInclusions.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Package inclusion updated successfully");
        onSuccess();
        resetForm();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const resetForm = () => {
    setFormData({
      inclusion: "",
    });
  };

  useEffect(() => {
    if (inclusion) {
      setFormData({
        inclusion: inclusion.inclusion,
      });
    } else {
      resetForm();
    }
  }, [inclusion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      packageId: Number.parseInt(packageId),
      inclusion: formData.inclusion,
    };

    if (inclusion) {
      updateMutation.mutate({
        id: inclusion.id,
        ...submitData,
      });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {inclusion ? "Edit Inclusion" : "Add Inclusion"}
          </DialogTitle>
          <DialogDescription>
            {inclusion
              ? "Update the inclusion details."
              : "Add what's included in this package."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="inclusion">Inclusion</Label>
              <Textarea
                id="inclusion"
                value={formData.inclusion}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    inclusion: e.target.value,
                  }))
                }
                placeholder="e.g., Airport transfers included"
                required
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {inclusion ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
