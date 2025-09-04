"use client";

import type React from "react";
import { useState } from "react";
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

interface BulkPackageExclusionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: string;
  onSuccess: () => void;
}

export function BulkPackageExclusionForm({
  open,
  onOpenChange,
  packageId,
  onSuccess,
}: BulkPackageExclusionFormProps) {
  const [bulkText, setBulkText] = useState("");

  const trpc = useTRPC();

  const bulkCreateMutation = useMutation(
    trpc.packageExclusions.bulkCreate.mutationOptions({
      onSuccess: async () => {
        toast.success("Exclusions added successfully");
        onSuccess();
        setBulkText("");
        onOpenChange(false);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const exclusions = bulkText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (exclusions.length === 0) {
      toast.error("Please enter at least one exclusion.");
      return;
    }

    bulkCreateMutation.mutate({
      exclusions: exclusions.map((exc) => ({
        packageId: Number(packageId),
        exclusion: exc,
      })),
    });
  };

  const isLoading = bulkCreateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Add Exclusions</DialogTitle>
          <DialogDescription>
            Enter one exclusion per line. Each line will be added separately.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bulkExclusions">Exclusions</Label>
              <Textarea
                id="bulkExclusions"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`e.g.\nPersonal expenses not included\nLunch not included\nEntry tickets not included`}
                rows={6}
                required
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
              Add All
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
