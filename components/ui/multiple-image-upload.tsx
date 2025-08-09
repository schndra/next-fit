"use client";

import { Button } from "@/components/ui/button";
import { X, Upload, Move } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface MultipleImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  onRemove: (url: string) => void;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  value = [],
  onChange,
  disabled,
  onRemove,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      setIsUploading(true);
      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", "products");

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Failed to upload file");
          }

          const data = await response.json();
          return data.url;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        onChange([...value, ...uploadedUrls]);
      } catch (error) {
        console.error("Error uploading files:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
    disabled: disabled || isUploading,
  });

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (disabled) return;

    const newImages = [...value];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative rounded-lg overflow-hidden border">
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-2 right-2 flex gap-1">
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveImage(index, index - 1)}
                        disabled={disabled}
                      >
                        <Move className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onRemove(url)}
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              {index === 0 && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Main
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          }
          ${
            disabled || isUploading
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-primary hover:bg-primary/5"
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        {isUploading ? (
          <p className="text-sm text-muted-foreground">Uploading...</p>
        ) : (
          <>
            <p className="text-sm font-medium mb-2">
              {isDragActive
                ? "Drop the images here..."
                : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, WEBP up to 10MB each
            </p>
          </>
        )}
      </div>
    </div>
  );
};
