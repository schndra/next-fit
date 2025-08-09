"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductOptionsProps {
  sizes: Array<{
    id: string;
    name: string;
    value: string;
  }>;
  colors: Array<{
    id: string;
    name: string;
    value: string;
  }>;
  selectedSize?: string;
  setSelectedSize: (size: string | undefined) => void;
  selectedColor?: string;
  setSelectedColor: (color: string | undefined) => void;
}

export function ProductOptions({
  sizes,
  colors,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
}: ProductOptionsProps) {
  return (
    <div className="space-y-6">
      {/* Size Selection */}
      {sizes && sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size.id}
                variant={selectedSize === size.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSize(size.value)}
                className="min-w-[3rem]"
              >
                {size.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {colors && colors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Color</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.value)}
                className={cn(
                  "relative w-8 h-8 rounded-full border-2 transition-all",
                  selectedColor === color.value
                    ? "border-primary shadow-lg scale-110"
                    : "border-gray-300 hover:border-gray-400"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {selectedColor === color.value && (
                  <div className="absolute inset-0 rounded-full border-2 border-white" />
                )}
              </button>
            ))}
          </div>
          {selectedColor && (
            <p className="text-sm text-muted-foreground mt-2">
              Selected: {colors.find((c) => c.value === selectedColor)?.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
