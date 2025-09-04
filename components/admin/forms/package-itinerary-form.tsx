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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PackageItineraryGetOne } from "@/modules/itinerary/types";

interface PackageItineraryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: string;
  itineraryItem?: PackageItineraryGetOne | null;
  onSuccess: () => void;
}

export function PackageItineraryForm({
  open,
  onOpenChange,
  packageId,
  itineraryItem,
  onSuccess,
}: PackageItineraryFormProps) {
  const [formData, setFormData] = useState({
    dayNumber: "",
    title: "",
    description: "",
  });

  const trpc = useTRPC();

  const createMutation = useMutation(
    trpc.packageItinerary.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Itinerary item created successfully");
        onSuccess();
        resetForm();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const updateMutation = useMutation(
    trpc.packageItinerary.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Itinerary item updated successfully");
        onSuccess();
        resetForm();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const resetForm = () => {
    setFormData({
      dayNumber: "",
      title: "",
      description: "",
    });
  };

  useEffect(() => {
    if (itineraryItem) {
      setFormData({
        dayNumber: itineraryItem.dayNumber.toString(),
        title: itineraryItem.title || "",
        description: itineraryItem.description || "",
      });
    } else {
      resetForm();
    }
  }, [itineraryItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      packageId: Number.parseInt(packageId),
      dayNumber: Number.parseInt(formData.dayNumber),
      title: formData.title,
      description: formData.description,
    };

    if (itineraryItem) {
      updateMutation.mutate({
        id: itineraryItem.id,
        ...submitData,
      });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {itineraryItem ? "Edit Itinerary Item" : "Add Itinerary Item"}
          </DialogTitle>
          <DialogDescription>
            {itineraryItem
              ? "Update the itinerary item details."
              : "Add a new day to the package itinerary."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dayNumber">Day Number</Label>
              <Input
                id="dayNumber"
                type="number"
                value={formData.dayNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dayNumber: e.target.value,
                  }))
                }
                placeholder="1"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g., Arrival in Paris"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Overview of the day's activities"
                rows={4}
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
              {itineraryItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
