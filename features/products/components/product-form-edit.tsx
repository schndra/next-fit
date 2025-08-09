"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";
import { useCreateProduct, useUpdateProduct } from "../hooks/use-products";
import {
  createProductSchema,
  updateProductSchema,
} from "../schema/product.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Product, Category, Color, Size } from "@prisma/client";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

type ProductFormEditProps = {
  initialData?: Product & {
    images: { id: string; url: string }[];
    category: Category;
    colors: Color[];
    sizes: Size[];
  };
  categories: Category[];
  colors: Color[];
  sizes: Size[];
};

export function ProductFormEdit({
  initialData,
  categories,
  colors,
  sizes,
}: ProductFormEditProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const isEditing = !!initialData;
  const title = isEditing ? "Edit Product" : "Create Product";
  const description = isEditing ? "Edit product details" : "Add a new product";
  const action = isEditing ? "Save changes" : "Create product";

  // Form setup
  const form = useForm({
    resolver: zodResolver(
      isEditing ? updateProductSchema : createProductSchema
    ),
    defaultValues: {
      title: initialData?.title || "",
      desc: initialData?.desc || "",
      price: initialData?.price || 0,
      compare_price: initialData?.compare_price || null,
      cost_price: initialData?.cost_price || null,
      sku: initialData?.sku || "",
      barcode: initialData?.barcode || "",
      track_quantity: initialData?.track_quantity || true,
      quantity: initialData?.quantity || 0,
      low_stock_threshold: initialData?.low_stock_threshold || 10,
      is_active: initialData?.is_active ?? true,
      is_featured: initialData?.is_featured || false,
      is_digital: initialData?.is_digital || false,
      meta_title: initialData?.meta_title || "",
      meta_description: initialData?.meta_description || "",
      weight: initialData?.weight || null,
      dimensions: initialData?.dimensions || "",
      category_id: initialData?.category_id || "",
      sizes: initialData?.sizes?.map((s: any) => s.id) || [],
      colors: initialData?.colors?.map((c: any) => c.id) || [],
      images:
        initialData?.images?.map((img: any) => ({
          url: img.url,
          alt: img.alt || "",
          sort_order: img.sort_order || 0,
        })) || [],
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateProduct.mutateAsync({
          id: initialData.id,
          ...data,
        });
        toast.success("Product updated successfully");
      } else {
        await createProduct.mutateAsync(data);
        toast.success("Product created successfully");
      }
      router.push("/admin/products");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onImageUpload = (urls: string[]) => {
    form.setValue("images", urls);
  };

  const onImageRemove = (url: string) => {
    const currentImages = form.getValues("images");
    form.setValue(
      "images",
      currentImages.filter((img) => img !== url)
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MultipleImageUpload
                        value={field.value}
                        onChange={onImageUpload}
                        onRemove={onImageRemove}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (LKR)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="compareAtPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compare at Price (LKR)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="costPerItem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost per Item (LKR)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter SKU" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="barcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter barcode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="trackQuantity"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Track Quantity
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Enable inventory tracking for this product
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("trackQuantity") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stockQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowBackorder"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Allow Backorder
                          </FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Allow sales when out of stock
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
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
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Product is visible and available for purchase
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Product will appear in featured sections
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : action}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
