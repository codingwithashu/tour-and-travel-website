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
import { FileUpload } from "@/components/ui/upload";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { uploadToSupabase } from "@/lib/storage/upload";
import { PackageGalleryGetOne } from "@/modules/gallery/types";

interface PackageGalleryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: string;
  galleryItem?: PackageGalleryGetOne | null;
  onSuccess: () => void;
}

export function PackageGalleryForm({
  open,
  onOpenChange,
  packageId,
  galleryItem,
  onSuccess,
}: PackageGalleryFormProps) {
  const [formData, setFormData] = useState({
    imageUrl: "",
  });

  const trpc = useTRPC();

  const createMutation = useMutation(
    trpc.packageGallery.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Gallery item created successfully");
        onSuccess();
        resetForm();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const updateMutation = useMutation(
    trpc.packageGallery.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Gallery item updated successfully");
        onSuccess();
        resetForm();
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const resetForm = () => {
    setFormData({
      imageUrl: "",
    });
  };

  useEffect(() => {
    if (galleryItem) {
      setFormData({
        imageUrl: galleryItem.imageUrl,
      });
    } else {
      resetForm();
    }
  }, [galleryItem]);

  const handleFileUpload = async (files: File[]) => {
    return await uploadToSupabase(files);
  };

  const handleImageUrlsChange = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData((prev) => ({ ...prev, imageUrl: urls[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      packageId: Number.parseInt(packageId),
      imageUrl: formData.imageUrl,
    };

    if (galleryItem) {
      updateMutation.mutate({
        id: galleryItem.id,
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
            {galleryItem ? "Edit Gallery Item" : "Add Gallery Item"}
          </DialogTitle>
          <DialogDescription>
            {galleryItem
              ? "Update the gallery item details."
              : "Add a new image to the package gallery."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Upload Image</Label>
              <FileUpload
                onUpload={handleFileUpload}
                onUrlsChange={handleImageUrlsChange}
                maxFiles={1}
                multiple={false}
                existingUrls={formData.imageUrl ? [formData.imageUrl] : []}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Or enter Image URL manually</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                }
                placeholder="https://example.com/image.jpg"
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
              {galleryItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
