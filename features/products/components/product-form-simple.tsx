"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct, updateProduct } from "../actions/products.actions";

interface ProductFormSimpleProps {
  initialData?: any;
  categories?: any[];
  colors?: any[];
  sizes?: any[];
}

export function ProductFormSimple({
  initialData,
  categories = [],
  colors = [],
  sizes = [],
}: ProductFormSimpleProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    desc: initialData?.desc || "",
    price: initialData?.price || "",
    compare_price: initialData?.compare_price || "",
    cost_per_item: initialData?.cost_per_item || "",
    sku: initialData?.sku || "",
    barcode: initialData?.barcode || "",
    track_quantity: initialData?.track_quantity || false,
    stock_quantity: initialData?.stock_quantity || 0,
    allow_backorder: initialData?.allow_backorder || false,
    weight: initialData?.weight || "",
    category_id: initialData?.category_id || "",
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured || false,
    meta_title: initialData?.meta_title || "",
    meta_description: initialData?.meta_description || "",
  });

  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        title: formData.title,
        desc: formData.desc,
        slug: formData.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        price: parseFloat(formData.price) || 0,
        compare_price: formData.compare_price
          ? parseFloat(formData.compare_price)
          : undefined,
        cost_per_item: formData.cost_per_item
          ? parseFloat(formData.cost_per_item)
          : undefined,
        sku: formData.sku || undefined,
        barcode: formData.barcode || undefined,
        track_quantity: formData.track_quantity,
        quantity: formData.track_quantity
          ? parseInt(formData.stock_quantity.toString()) || 0
          : 0,
        low_stock_threshold: 5,
        allow_backorder: formData.allow_backorder,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        category_id: formData.category_id,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        is_digital: false,
        meta_title: formData.meta_title || undefined,
        meta_description: formData.meta_description || undefined,
        sizes: [],
        colors: [],
        images: [],
        ...(isEditing && { id: initialData.id }),
      };

      let result;
      if (isEditing) {
        const updateData = { ...data, id: initialData.id };
        result = await updateProduct(updateData);
      } else {
        result = await createProduct(data);
      }

      if (result.success) {
        toast.success(
          isEditing
            ? "Product updated successfully"
            : "Product created successfully"
        );
        router.push("/admin/products");
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {isEditing ? "Edit Product" : "Create Product"}
        </h1>
        <p className="text-muted-foreground">
          {isEditing
            ? "Update product information"
            : "Add a new product to your catalog"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product Title *</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter product title"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.desc}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, desc: e.target.value }))
                }
                placeholder="Product description"
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Price (LKR) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Compare at Price (LKR)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.compare_price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      compare_price: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Cost per Item (LKR)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.cost_per_item}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cost_per_item: e.target.value,
                  }))
                }
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">SKU</label>
                <Input
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, sku: e.target.value }))
                  }
                  placeholder="Enter SKU"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Barcode</label>
                <Input
                  value={formData.barcode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      barcode: e.target.value,
                    }))
                  }
                  placeholder="Enter barcode"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <label className="text-sm font-medium">Track Quantity</label>
                <p className="text-xs text-muted-foreground">
                  Enable inventory tracking
                </p>
              </div>
              <Switch
                checked={formData.track_quantity}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, track_quantity: checked }))
                }
              />
            </div>

            {formData.track_quantity && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Stock Quantity</label>
                  <Input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stock_quantity: parseInt(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <label className="text-sm font-medium">
                      Allow Backorder
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Allow sales when out of stock
                    </p>
                  </div>
                  <Switch
                    checked={formData.allow_backorder}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        allow_backorder: checked,
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <label className="text-sm font-medium">Active</label>
                <p className="text-xs text-muted-foreground">
                  Product is visible and available
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <label className="text-sm font-medium">Featured</label>
                <p className="text-xs text-muted-foreground">
                  Show in featured sections
                </p>
              </div>
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_featured: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : isEditing
              ? "Update Product"
              : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
