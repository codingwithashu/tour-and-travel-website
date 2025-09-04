"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  onRemove: () => void;
  className?: string;
}

export function ImagePreview({
  src,
  alt = "Preview image",
  onRemove,
  className,
}: ImagePreviewProps) {
  if (!src) return null;

  return (
    <div className={`relative inline-block ${className || ""}`}>
      <div className="relative h-40 w-40 rounded-lg overflow-hidden border">
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>

      <Button
        type="button"
        size="icon"
        variant="destructive"
        className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-lg"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
