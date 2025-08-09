"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useStoreCategories } from "../hooks/use-store-categories";
import { useState } from "react";

interface CategoryFilterProps {
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
  priceRange?: [number, number];
  onPriceChange?: (range: [number, number]) => void;
  featured?: boolean;
  onFeaturedChange?: (featured: boolean) => void;
  onSale?: boolean;
  onSaleChange?: (onSale: boolean) => void;
}

export function CategoryFilter({
  selectedCategories = [],
  onCategoryChange,
  priceRange = [0, 1000],
  onPriceChange,
  featured,
  onFeaturedChange,
  onSale,
  onSaleChange,
}: CategoryFilterProps) {
  const { data: categories, isLoading } = useStoreCategories();
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const handleCategoryToggle = (categorySlug: string) => {
    const newCategories = selectedCategories.includes(categorySlug)
      ? selectedCategories.filter((c) => c !== categorySlug)
      : [...selectedCategories, categorySlug];
    onCategoryChange?.(newCategories);
  };

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setLocalPriceRange(newRange);
    onPriceChange?.(newRange);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-2 animate-pulse"
              >
                <div className="h-4 w-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded flex-1" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categories Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories?.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.slug}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => handleCategoryToggle(category.slug)}
              />
              <label
                htmlFor={category.slug}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
              >
                {category.title}
              </label>
              <Badge variant="secondary" className="text-xs">
                {category._count.products}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={localPriceRange}
            onValueChange={handlePriceChange}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${localPriceRange[0]}</span>
            <span>${localPriceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Featured Products Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Product Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={featured || false}
              onCheckedChange={(checked) => onFeaturedChange?.(!!checked)}
            />
            <label
              htmlFor="featured"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Featured Products Only
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sale"
              checked={onSale || false}
              onCheckedChange={(checked) => onSaleChange?.(!!checked)}
            />
            <label
              htmlFor="sale"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              On Sale
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
