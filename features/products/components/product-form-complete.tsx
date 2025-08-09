"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Info, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createProduct, updateProduct } from "../actions/products.actions";
import { MultipleImageUpload } from "./multiple-image-upload";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useColors } from "@/features/colors/hooks/use-colors";
import { useSizes } from "@/features/sizes/hooks/use-sizes";

interface ImageData {
  url: string;
  alt?: string | null;
  sort_order: number;
}

interface ProductFormCompleteProps {
  initialData?: any;
}

export function ProductFormComplete({ initialData }: ProductFormCompleteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data using React Query hooks
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const { data: colors = [], isLoading: colorsLoading } = useColors();
  const { data: sizes = [], isLoading: sizesLoading } = useSizes();

  const isDataLoading = categoriesLoading || colorsLoading || sizesLoading;

  const [formData, setFormData] = useState({
    // Basic Information
    title: initialData?.title || "",
    desc: initialData?.desc || "",
    category_id: initialData?.category_id || "",

    // Pricing
    price: initialData?.price?.toString() || "",
    compare_price: initialData?.compare_price?.toString() || "",
    cost_price: initialData?.cost_price?.toString() || "",

    // Inventory
    sku: initialData?.sku || "",
    barcode: initialData?.barcode || "",
    track_quantity: initialData?.track_quantity ?? true,
    quantity: initialData?.quantity || 0,
    low_stock_threshold: initialData?.low_stock_threshold || 10,

    // Product Status
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured || false,
    is_digital: initialData?.is_digital || false,

    // SEO
    meta_title: initialData?.meta_title || "",
    meta_description: initialData?.meta_description || "",

    // Physical Properties
    weight: initialData?.weight?.toString() || "",
    dimensions: initialData?.dimensions || "",

    // Relations
    sizes: initialData?.sizes?.map((s: any) => s.id) || [],
    colors: initialData?.colors?.map((c: any) => c.id) || [],
    images:
      initialData?.images?.map((img: any, index: number) => ({
        url: img.url,
        alt: img.alt || "",
        sort_order: img.sort_order || index,
      })) || ([] as ImageData[]),
  });

  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      toast.error("Product title is required");
      return;
    }

    if (!formData.desc.trim()) {
      toast.error("Product description is required");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid product price is required");
      return;
    }

    if (!formData.category_id) {
      toast.error("Please select a category");
      return;
    }

    if (formData.sizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }

    if (formData.colors.length === 0) {
      toast.error("Please select at least one color");
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

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
        cost_price: formData.cost_price
          ? parseFloat(formData.cost_price)
          : undefined,
        sku: formData.sku || undefined,
        barcode: formData.barcode || undefined,
        track_quantity: formData.track_quantity,
        quantity: formData.track_quantity
          ? parseInt(formData.quantity.toString()) || 0
          : 0,
        low_stock_threshold:
          parseInt(formData.low_stock_threshold.toString()) || 10,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        is_digital: formData.is_digital,
        meta_title: formData.meta_title || undefined,
        meta_description: formData.meta_description || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        dimensions: formData.dimensions || undefined,
        category_id: formData.category_id,
        sizes: formData.sizes,
        colors: formData.colors,
        images: formData.images,
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

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (images: ImageData[]) => {
    updateField("images", images);
  };

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      {/* Loading State */}
      {isDataLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading form data...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">
            {isEditing ? "Edit Product" : "Create Product"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Update product information"
              : "Add a new product to your catalog"}
          </p>
        </div>
      </div>

      {/* Required Fields Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900">Required Information</h3>
            <p className="text-sm text-blue-700 mt-1">
              Fields marked with{" "}
              <span className="text-red-500 font-medium">*</span> are required.
              Make sure to fill in the product title, description, price,
              category, at least one size, one color, and upload at least one
              product image.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label
                htmlFor="title"
                className="flex items-center gap-1 text-sm font-medium"
              >
                Product Title
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Enter product title"
                required
                className={
                  !formData.title.trim()
                    ? "border-red-200 focus:border-red-300 focus:ring-red-300"
                    : "focus:border-blue-300 focus:ring-blue-300"
                }
              />
              {!formData.title.trim() ? (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  Product title is required
                </p>
              ) : formData.title.length < 3 ? (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  Title must be at least 3 characters
                </p>
              ) : (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                  Title looks good
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="desc"
                className="flex items-center gap-1 text-sm font-medium"
              >
                Description
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="desc"
                value={formData.desc}
                onChange={(e) => updateField("desc", e.target.value)}
                placeholder="Product description"
                className={`min-h-[100px] ${
                  !formData.desc.trim()
                    ? "border-red-200 focus:border-red-300 focus:ring-red-300"
                    : "focus:border-blue-300 focus:ring-blue-300"
                }`}
                required
              />
              {!formData.desc.trim() ? (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  Product description is required
                </p>
              ) : formData.desc.length < 10 ? (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  Description must be at least 10 characters
                </p>
              ) : (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                  Description looks good
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formData.desc.length}/2000 characters
              </p>
            </div>

            <div>
              <Label
                htmlFor="category"
                className="flex items-center gap-1 text-sm font-medium"
              >
                Category
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => updateField("category_id", value)}
                required
              >
                <SelectTrigger
                  className={!formData.category_id ? "border-red-200" : ""}
                >
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
              {!formData.category_id ? (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  Please select a category
                </p>
              ) : (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                  Category selected
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1">
              Product Images
              <span className="text-red-500">*</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Upload at least one product image
            </p>
          </CardHeader>
          <CardContent>
            <MultipleImageUpload
              value={formData.images}
              onChange={handleImageChange}
              disabled={isLoading}
              folder="products"
              maxImages={10}
            />
            {formData.images.length === 0 && (
              <p className="text-xs text-red-500 mt-2">
                At least one product image is required
              </p>
            )}
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
                <Label
                  htmlFor="price"
                  className="flex items-center gap-1 text-sm font-medium"
                >
                  Selling Price (LKR)
                  <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-1">
                  Current price customers pay
                </p>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="0.00"
                  required
                  className={
                    !formData.price || parseFloat(formData.price) <= 0
                      ? "border-red-200 focus:border-red-300 focus:ring-red-300"
                      : "focus:border-blue-300 focus:ring-blue-300"
                  }
                />
                {!formData.price || parseFloat(formData.price) <= 0 ? (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    Valid price is required
                  </p>
                ) : (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                    LKR{" "}
                    {parseFloat(formData.price).toLocaleString("en-LK", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="compare_price">
                  Compare at Price (LKR)
                  <span className="text-xs text-muted-foreground block">
                    Original price (shows discount)
                  </span>
                </Label>
                <Input
                  id="compare_price"
                  type="number"
                  step="0.01"
                  value={formData.compare_price}
                  onChange={(e) => updateField("compare_price", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cost_price">
                Cost per Item (LKR)
                <span className="text-xs text-muted-foreground block">
                  What you paid for this item (for profit calculations)
                </span>
              </Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => updateField("cost_price", e.target.value)}
                placeholder="0.00"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inventory Management */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => updateField("sku", e.target.value)}
                  placeholder="Enter SKU"
                />
              </div>
              <div>
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => updateField("barcode", e.target.value)}
                  placeholder="Enter barcode"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">Track Quantity</Label>
                <p className="text-xs text-muted-foreground">
                  Enable inventory tracking for this product
                </p>
              </div>
              <Switch
                checked={formData.track_quantity}
                onCheckedChange={(checked) =>
                  updateField("track_quantity", checked)
                }
              />
            </div>

            {formData.track_quantity && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Stock Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      updateField("quantity", parseInt(e.target.value) || 0)
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="low_stock_threshold">Low Stock Alert</Label>
                  <Input
                    id="low_stock_threshold"
                    type="number"
                    value={formData.low_stock_threshold}
                    onChange={(e) =>
                      updateField(
                        "low_stock_threshold",
                        parseInt(e.target.value) || 10
                      )
                    }
                    placeholder="10"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Product Variants</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select sizes and colors available for this product
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="flex items-center gap-1">
                Available Sizes
                <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                Select all sizes available for this product
              </p>
              {sizesLoading ? (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading sizes...</span>
                </div>
              ) : sizes.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  No sizes available. Add sizes in the admin panel first.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {sizes.map((size) => (
                    <div key={size.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`size-${size.id}`}
                        checked={formData.sizes.includes(size.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateField("sizes", [...formData.sizes, size.id]);
                          } else {
                            updateField(
                              "sizes",
                              formData.sizes.filter(
                                (id: string) => id !== size.id
                              )
                            );
                          }
                        }}
                        className="rounded"
                      />
                      <Label
                        htmlFor={`size-${size.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {size.name} ({size.value})
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              {formData.sizes.length === 0 && sizes.length > 0 && (
                <p className="text-xs text-red-500 mt-2">
                  Please select at least one size
                </p>
              )}
              {formData.sizes.length > 0 && (
                <p className="text-xs text-green-600 mt-2">
                  ✓ {formData.sizes.length} size(s) selected
                </p>
              )}
            </div>

            <div>
              <Label className="flex items-center gap-1">
                Available Colors
                <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                Select all colors available for this product
              </p>
              {colorsLoading ? (
                <div className="flex items-center gap-2 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Loading colors...</span>
                </div>
              ) : colors.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  No colors available. Add colors in the admin panel first.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {colors.map((color) => (
                    <div key={color.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`color-${color.id}`}
                        checked={formData.colors.includes(color.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateField("colors", [
                              ...formData.colors,
                              color.id,
                            ]);
                          } else {
                            updateField(
                              "colors",
                              formData.colors.filter(
                                (id: string) => id !== color.id
                              )
                            );
                          }
                        }}
                        className="rounded"
                      />
                      <Label
                        htmlFor={`color-${color.id}`}
                        className="text-sm flex items-center gap-2 cursor-pointer"
                      >
                        <div
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ backgroundColor: color.value }}
                          title={color.value}
                        />
                        {color.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              {formData.colors.length === 0 && colors.length > 0 && (
                <p className="text-xs text-red-500 mt-2">
                  Please select at least one color
                </p>
              )}
              {formData.colors.length > 0 && (
                <p className="text-xs text-green-600 mt-2">
                  ✓ {formData.colors.length} color(s) selected
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Physical Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Physical Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => updateField("dimensions", e.target.value)}
                  placeholder="L x W x H (cm)"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Status */}
        <Card>
          <CardHeader>
            <CardTitle>Product Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">Active</Label>
                <p className="text-xs text-muted-foreground">
                  Product is visible and available for purchase
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => updateField("is_active", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">Featured</Label>
                <p className="text-xs text-muted-foreground">
                  Show in featured sections and homepage
                </p>
              </div>
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) =>
                  updateField("is_featured", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base">Digital Product</Label>
                <p className="text-xs text-muted-foreground">
                  No shipping required for this product
                </p>
              </div>
              <Switch
                checked={formData.is_digital}
                onCheckedChange={(checked) =>
                  updateField("is_digital", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => updateField("meta_title", e.target.value)}
                placeholder="SEO title for search engines"
              />
            </div>
            <div>
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) =>
                  updateField("meta_description", e.target.value)
                }
                placeholder="SEO description for search engines"
                className="min-h-[80px]"
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
