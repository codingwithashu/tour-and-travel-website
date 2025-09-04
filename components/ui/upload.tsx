"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileImage, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<string[]>;
  onUrlsChange: (urls: string[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  className?: string;
  multiple?: boolean;
  existingUrls?: string[];
}

interface UploadingFile {
  file: File;
  progress: number;
  error?: string;
  url?: string;
}

export function FileUpload({
  onUpload,
  onUrlsChange,
  accept = { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  multiple = true,
  existingUrls = [],
}: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(existingUrls);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      // Check file size
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > maxSize
      );
      if (oversizedFiles.length > 0) {
        toast.error(
          `Some files are too large. Maximum size is ${maxSize / 1024 / 1024}MB`
        );
        return;
      }

      // Check total file count
      if (uploadedUrls.length + acceptedFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Initialize uploading state
      const newUploadingFiles: UploadingFile[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
      }));

      setUploadingFiles(newUploadingFiles);

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadingFiles((prev) =>
            prev.map((f) => ({
              ...f,
              progress: Math.min(f.progress + Math.random() * 30, 90),
            }))
          );
        }, 500);

        // Perform actual upload
        const urls = await onUpload(acceptedFiles);

        clearInterval(progressInterval);

        // Update with final results
        setUploadingFiles((prev) =>
          prev.map((f, index) => ({
            ...f,
            progress: 100,
            url: urls[index],
          }))
        );

        // Add to uploaded URLs
        const newUrls = [...uploadedUrls, ...urls];
        setUploadedUrls(newUrls);
        onUrlsChange(newUrls);

        // Clear uploading state after a delay
        setTimeout(() => {
          setUploadingFiles([]);
        }, 1000);

        toast.success(`${acceptedFiles.length} file(s) uploaded successfully`);
      } catch (error) {
        setUploadingFiles((prev) =>
          prev.map((f) => ({
            ...f,
            progress: 0,
            error: error instanceof Error ? error.message : "Upload failed",
          }))
        );
        toast.error("Upload failed");
      }
    },
    [maxFiles, maxSize, onUpload, onUrlsChange, uploadedUrls]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    disabled: uploadingFiles.length > 0,
  });

  const removeUploadedFile = (index: number) => {
    const newUrls = uploadedUrls.filter((_, i) => i !== index);
    setUploadedUrls(newUrls);
    onUrlsChange(newUrls);
  };

  const removeUploadingFile = (index: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25",
              uploadingFiles.length > 0 && "pointer-events-none opacity-50"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isDragActive
                  ? "Drop files here"
                  : "Drag & drop files here, or click to select"}
              </p>
              <p className="text-xs text-muted-foreground">
                {Object.keys(accept).join(", ")} up to {maxSize / 1024 / 1024}MB
                each
              </p>
              <p className="text-xs text-muted-foreground">
                {uploadedUrls.length}/{maxFiles} files uploaded
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploading...</h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileImage className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        {uploadingFile.file.name}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeUploadingFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    {uploadingFile.error ? (
                      <div className="flex items-center gap-1 text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        <p className="text-xs">{uploadingFile.error}</p>
                      </div>
                    ) : (
                      <Progress
                        value={uploadingFile.progress}
                        className="h-1"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedUrls.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {uploadedUrls.map((url, index) => (
              <Card key={index}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={url || "/placeholder.svg"}
                      alt=""
                      className="h-12 w-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {url.split("/").pop()}
                      </p>
                      <p className="text-xs text-muted-foreground">Uploaded</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeUploadedFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
