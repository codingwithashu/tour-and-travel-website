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

interface BulkPackageInclusionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: string;
  onSuccess: () => void;
}

export function BulkPackageInclusionForm({
  open,
  onOpenChange,
  packageId,
  onSuccess,
}: BulkPackageInclusionFormProps) {
  const [bulkText, setBulkText] = useState("");

  const trpc = useTRPC();

  const bulkCreateMutation = useMutation(
    trpc.packageInclusions.bulkCreate.mutationOptions({
      onSuccess: async () => {
        toast.success("Inclusions added successfully");
        onSuccess();
        setBulkText("");
        onOpenChange(false);
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const inclusions = bulkText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (inclusions.length === 0) {
      toast.error("Please enter at least one inclusion.");
      return;
    }

    bulkCreateMutation.mutate({
      inclusions: inclusions.map((inc) => ({
        packageId: Number(packageId),
        inclusion: inc,
      })),
    });
  };

  const isLoading = bulkCreateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Bulk Add Inclusions</DialogTitle>
          <DialogDescription>
            Enter one inclusion per line. Each line will be added separately.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="bulkInclusions">Inclusions</Label>
              <Textarea
                id="bulkInclusions"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`e.g.\nAirport transfers included\nBreakfast included\nCity tour`}
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
