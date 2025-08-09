"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  GripVertical,
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface ImageData {
  url: string;
  alt?: string | null;
  sort_order: number;
}

interface MultipleImageUploadProps {
  value: ImageData[];
  onChange: (value: ImageData[]) => void;
  disabled?: boolean;
  folder?: string;
  maxImages?: number;
}

export function MultipleImageUpload({
  value = [],
  onChange,
  disabled = false,
  folder = "products",
  maxImages = 10,
}: MultipleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (value.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          return {
            url: result.url,
            alt: "",
            sort_order: value.length,
          };
        } else {
          throw new Error(result.error || "Upload failed");
        }
      });

      const newImages = await Promise.all(uploadPromises);
      const updatedImages = [...value, ...newImages].map((img, index) => ({
        ...img,
        sort_order: index,
      }));

      onChange(updatedImages);
      toast.success(`${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload one or more images");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlAdd = (url: string) => {
    if (!url.trim()) return;

    if (value.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImage: ImageData = {
      url: url.trim(),
      alt: "",
      sort_order: value.length,
    };

    onChange([...value, newImage]);
  };

  const handleRemove = (index: number) => {
    const updatedImages = value
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, sort_order: i }));
    onChange(updatedImages);
  };

  const handleAltChange = (index: number, alt: string) => {
    const updatedImages = value.map((img, i) =>
      i === index ? { ...img, alt } : img
    );
    onChange(updatedImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const reorderedImages = [...value];
    const draggedImage = reorderedImages[draggedIndex];

    // Remove dragged item
    reorderedImages.splice(draggedIndex, 1);

    // Insert at new position
    reorderedImages.splice(dropIndex, 0, draggedImage);

    // Update sort_order
    const updatedImages = reorderedImages.map((img, index) => ({
      ...img,
      sort_order: index,
    }));

    onChange(updatedImages);
    setDraggedIndex(null);
  };

  const isValidUrl = (string: string) => {
    if (!string) return false;
    try {
      new URL(string);
      return true;
    } catch (_) {
      // Check if it's a relative path starting with /
      return string.startsWith("/");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label>Product Images</Label>
        <span className="text-xs text-muted-foreground">
          ({value.length}/{maxImages} images)
        </span>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium">Upload Files</Label>
          <div className="mt-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={disabled || isUploading || value.length >= maxImages}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading || value.length >= maxImages}
              className="w-full"
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {isUploading ? "Uploading..." : "Choose Files"}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Select multiple images (JPG, PNG, WebP)
            </p>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Add by URL</Label>
          <div className="mt-2">
            <Input
              placeholder="https://example.com/image.jpg"
              disabled={disabled || value.length >= maxImages}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  handleUrlAdd(input.value);
                  input.value = "";
                }
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Press Enter to add image URL
            </p>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      {value.length > 0 && (
        <div>
          <Label className="text-sm font-medium">
            Current Images {value.length > 1 && "(Drag to reorder)"}
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {value.map((image, index) => (
              <Card
                key={`${image.url}-${index}`}
                className={`relative ${
                  draggedIndex === index ? "opacity-50" : ""
                }`}
                draggable={!disabled}
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {/* Image Preview */}
                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {isValidUrl(image.url) ? (
                        <Image
                          src={image.url}
                          alt={image.alt || `Product image ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}

                      {/* Drag Handle */}
                      {value.length > 1 && (
                        <div className="absolute top-2 left-2 cursor-move">
                          <GripVertical className="h-4 w-4 text-white bg-black bg-opacity-50 rounded" />
                        </div>
                      )}

                      {/* Remove Button */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => handleRemove(index)}
                        disabled={disabled}
                      >
                        <X className="h-3 w-3" />
                      </Button>

                      {/* Sort Order Badge */}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        #{index + 1}
                      </div>
                    </div>

                    {/* Alt Text Input */}
                    <Input
                      placeholder="Alt text (optional)"
                      value={image.alt || ""}
                      onChange={(e) => handleAltChange(index, e.target.value)}
                      disabled={disabled}
                      className="text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {value.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No images uploaded yet</p>
          <p className="text-sm text-gray-400">
            Upload files or add image URLs to get started
          </p>
        </div>
      )}

      {/* Helper Text */}
      <div className="text-xs text-muted-foreground">
        <p>• First image will be used as the main product image</p>
        <p>• Drag and drop to reorder images</p>
        <p>• Recommended size: 800x800px or larger</p>
        <p>• Supported formats: JPG, PNG, WebP</p>
      </div>
    </div>
  );
}
