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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { PackageExclusionGetOne } from "@/modules/exclusions/types";

interface PackageExclusionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: string;
  exclusion?: PackageExclusionGetOne | null;
  onSuccess: () => void;
}

export function PackageExclusionForm({
  open,
  onOpenChange,
  packageId,
  exclusion,
  onSuccess,
}: PackageExclusionFormProps) {
  const [formData, setFormData] = useState({
    exclusion: "",
  });

  const trpc = useTRPC();

  const createMutation = useMutation(
    trpc.packageExclusions.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Package exclusion created successfully");
        onSuccess();
        resetForm();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const updateMutation = useMutation(
    trpc.packageExclusions.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Package exclusion updated successfully");
        onSuccess();
        resetForm();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const resetForm = () => {
    setFormData({
      exclusion: "",
    });
  };

  useEffect(() => {
    if (exclusion) {
      setFormData({
        exclusion: exclusion.exclusion,
      });
    } else {
      resetForm();
    }
  }, [exclusion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      packageId: parseInt(packageId),
      exclusion: formData.exclusion,
    };

    if (exclusion) {
      updateMutation.mutate({
        id: exclusion.id,
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
            {exclusion ? "Edit Exclusion" : "Add Exclusion"}
          </DialogTitle>
          <DialogDescription>
            {exclusion
              ? "Update the exclusion details."
              : "Add what's not included in this package."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="exclusion">Exclusion</Label>
              <Textarea
                id="exclusion"
                value={formData.exclusion}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    exclusion: e.target.value,
                  }))
                }
                placeholder="e.g., Personal expenses not included"
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
              {exclusion ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
