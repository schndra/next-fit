"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  folder?: string;
  label?: string;
  description?: string;
}

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  folder = "categories",
  label = "Image",
  description = "Upload an image or enter a URL",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        const imageUrl = result.url;
        setPreview(imageUrl);
        onChange(imageUrl);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUrlChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      {/* Preview */}
      {preview && (
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              onError={() => {
                setPreview("");
                onChange("");
                toast.error("Failed to load image");
              }}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Upload Section */}
      <div className="grid grid-cols-1 gap-4">
        {/* File Upload */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={disabled || isUploading}
          />
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <Label htmlFor="image-url" className="text-sm text-muted-foreground">
            Or enter image URL
          </Label>
          <Input
            id="image-url"
            placeholder="https://example.com/image.jpg"
            value={preview}
            onChange={(e) => handleUrlChange(e.target.value)}
            disabled={disabled || isUploading}
          />
        </div>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
