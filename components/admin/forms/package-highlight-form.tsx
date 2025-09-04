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
import { PackageHighlightGetOne } from "@/modules/highlights/types";

interface PackageHighlightFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: string;
  highlight?: PackageHighlightGetOne | null;
  onSuccess: () => void;
}

export function PackageHighlightForm({
  open,
  onOpenChange,
  packageId,
  highlight,
  onSuccess,
}: PackageHighlightFormProps) {
  const [formData, setFormData] = useState({
    highlight: "",
  });

  const trpc = useTRPC();

  const createMutation = useMutation(
    trpc.packageHighlights.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Package highlight created successfully");
        onSuccess();
        resetForm();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const updateMutation = useMutation(
    trpc.packageHighlights.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Package highlight updated successfully");
        onSuccess();
        resetForm();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const resetForm = () => {
    setFormData({
      highlight: "",
    });
  };

  useEffect(() => {
    if (highlight) {
      setFormData({
        highlight: highlight.highlight,
      });
    } else {
      resetForm();
    }
  }, [highlight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      packageId: Number.parseInt(packageId),
      highlight: formData.highlight,
    };

    if (highlight) {
      updateMutation.mutate({
        id: highlight.id,
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
            {highlight ? "Edit Highlight" : "Add Highlight"}
          </DialogTitle>
          <DialogDescription>
            {highlight
              ? "Update the highlight details."
              : "Add a key highlight for this package."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="highlight">Highlight</Label>
              <Textarea
                id="highlight"
                value={formData.highlight}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    highlight: e.target.value,
                  }))
                }
                placeholder="e.g., Scenic mountain views and wildlife spotting"
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
              {highlight ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
