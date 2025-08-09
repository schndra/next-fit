"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Info, Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  createProduct,
  updateProduct,
  getProductById,
} from "../actions/products.actions";
import { MultipleImageUpload } from "./multiple-image-upload";
import { useCategories } from "@/features/categories/hooks/use-categories";
import { useColors } from "@/features/colors/hooks/use-colors";
import { useSizes } from "@/features/sizes/hooks/use-sizes";
import {
  CreateProductInput,
  UpdateProductInput,
  createProductSchema,
  updateProductSchema,
} from "../schema/product.schemas";

interface ProductFormReactHookFormProps {
  productId: string;
}

export function ProductFormReactHookForm({
  productId,
}: ProductFormReactHookFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const isNewProduct = productId === "new";

  // Fetch existing product data if editing
  const { data: product } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !isNewProduct,
  });

  // Fetch form data using React Query hooks
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const { data: colors = [], isLoading: colorsLoading } = useColors();
  const { data: sizes = [], isLoading: sizesLoading } = useSizes();

  const isDataLoading = categoriesLoading || colorsLoading || sizesLoading;

  const isEditMode = !isNewProduct && product;

  const toastErrorMsg = product ? "editing" : "creating";
  const toastSuccessMsg = product ? "updated" : "created";

  // React Hook Form setup following coupon pattern
  const form = useForm({
    resolver: zodResolver(createProductSchema),
    mode: "onChange", // Validate on every change
    defaultValues: isEditMode
      ? {
          title: product.title,
          desc: product.desc,
          slug: product.slug,
          price: Number(product.price),
          compare_price: product.compare_price
            ? Number(product.compare_price)
            : null,
          cost_price: product.cost_price ? Number(product.cost_price) : null,
          sku: product.sku,
          barcode: product.barcode,
          track_quantity: product.track_quantity,
          quantity: product.quantity,
          low_stock_threshold: product.low_stock_threshold,
          is_active: product.is_active,
          is_featured: product.is_featured,
          is_digital: product.is_digital,
          meta_title: product.meta_title,
          meta_description: product.meta_description,
          weight: product.weight ? Number(product.weight) : null,
          dimensions: product.dimensions,
          category_id: product.category_id,
          sizes: product.sizes?.map((s: any) => s.id) || [],
          colors: product.colors?.map((c: any) => c.id) || [],
          images:
            product.images?.map((img: any, index: number) => ({
              url: img.url,
              alt: img.alt || null,
              sort_order: img.sort_order || index,
            })) || [],
        }
      : {
          title: "",
          desc: "",
          slug: "",
          price: 0.01,
          compare_price: null,
          cost_price: null,
          sku: null,
          barcode: null,
          track_quantity: true,
          quantity: 0,
          low_stock_threshold: 10,
          is_active: true,
          is_featured: false,
          is_digital: false,
          meta_title: null,
          meta_description: null,
          weight: null,
          dimensions: null,
          category_id: "",
          sizes: [],
          colors: [],
          images: [],
        },
  });

  // Mutation for create/update following coupon pattern
  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateProductInput) => {
      if (product) {
        return updateProduct({
          ...values,
          id: productId,
        } as UpdateProductInput);
      } else {
        return createProduct(values);
      }
    },
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(`Error ${toastErrorMsg} product. ${result.error}`);
        return;
      }
      toast.success(`Product ${toastSuccessMsg}! 🎉 Keep up the great work!`);

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (!isNewProduct) {
        queryClient.invalidateQueries({ queryKey: ["product", productId] });
      }

      router.push("/admin/products");
    },
  });

  const title = product ? "Edit Product" : "Create Product";
  const description = product
    ? "Edit product information"
    : "Add a new product to your catalog";
  const action = product ? "Save Changes" : "Create Product";

  const watchedValues = form.watch();
  const formErrors = form.formState.errors;
  const hasErrors = Object.keys(formErrors).length > 0;

  // Check if required fields are filled
  const requiredFieldsFilled =
    watchedValues.title &&
    watchedValues.desc &&
    watchedValues.price > 0 &&
    watchedValues.category_id &&
    watchedValues.images &&
    watchedValues.images.length > 0;

  // Auto-generate slug when title changes for new products
  React.useEffect(() => {
    if (watchedValues.title && !isEditMode) {
      const slug = watchedValues.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      form.setValue("slug", slug);
    }
  }, [watchedValues.title, form, isEditMode]);

  const onSubmit = (data: CreateProductInput) => {
    // Use provided slug or auto-generate from title
    let slug =
      data.slug?.trim() ||
      data.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    // Clean up the slug
    slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "");

    const productData = { ...data, slug };

    // Validate the data against our schema
    try {
      const validatedData = createProductSchema.parse(productData);
      mutate(productData);
    } catch (error) {
      console.error("Schema validation failed:", error);
      toast.error("Please check all required fields");
    }
  };
  const onCancel = () => {
    router.back();
  };

  if (isDataLoading) {
    return (
      <div className="container mx-auto py-6 max-w-5xl">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading form data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          Product Title
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter product title"
                            className="focus:border-blue-300 focus:ring-blue-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          URL Slug
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="product-url-slug"
                            className="focus:border-blue-300 focus:ring-blue-300"
                          />
                        </FormControl>
                        <FormDescription>
                          Auto-generated from title. Used in product URL:
                          /products/{field.value || "product-slug"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          Description
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Product description"
                            className="min-h-[100px] focus:border-blue-300 focus:ring-blue-300"
                          />
                        </FormControl>
                        <FormDescription>
                          {field.value?.length || 0}/2000 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          Category
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.title}
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
                          <FormLabel className="flex items-center gap-1">
                            Selling Price (LKR)
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0.01"
                              placeholder="0.01"
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(
                                  isNaN(value) ? 0.01 : Math.max(0.01, value)
                                );
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Current price customers pay
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="compare_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Compare at Price (LKR)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : null
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Original price (shows discount)
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cost_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost Price (LKR)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : null
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Your cost for this item (for profit calculation)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Inventory & SKU */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory & SKU</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU (Stock Keeping Unit)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value || ""}
                              placeholder="PROD-001"
                              className="uppercase"
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Unique product identifier (optional)
                          </FormDescription>
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
                            <Input
                              {...field}
                              value={field.value || ""}
                              placeholder="123456789012"
                            />
                          </FormControl>
                          <FormDescription>
                            Product barcode (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          Product Images
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <MultipleImageUpload
                            value={
                              field.value?.map((img) => ({
                                ...img,
                                sort_order: img.sort_order || 0,
                              })) || []
                            }
                            onChange={field.onChange}
                            disabled={isPending}
                            folder="products"
                            maxImages={10}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="sizes"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="flex items-center gap-1 text-base">
                            Available Sizes
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormDescription>
                            Select all sizes available for this product
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {sizes.map((size) => (
                            <FormField
                              key={size.id}
                              control={form.control}
                              name="sizes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={size.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(size.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...(field.value || []),
                                                size.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== size.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal cursor-pointer">
                                      {size.name} ({size.value})
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="colors"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="flex items-center gap-1 text-base">
                            Available Colors
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormDescription>
                            Select all colors available for this product
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {colors.map((color) => (
                            <FormField
                              key={color.id}
                              control={form.control}
                              name="colors"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={color.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          color.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...(field.value || []),
                                                color.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== color.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal cursor-pointer flex items-center gap-2">
                                      <div
                                        className="w-4 h-4 rounded border border-gray-300"
                                        style={{ backgroundColor: color.value }}
                                        title={color.value}
                                      />
                                      {color.name}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Status & Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>
                            Product is visible in store
                          </FormDescription>
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
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Featured</FormLabel>
                          <FormDescription>
                            Show in featured products
                          </FormDescription>
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

              {/* Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="track_quantity"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Track Quantity
                          </FormLabel>
                          <FormDescription>
                            Enable inventory tracking
                          </FormDescription>
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

                  {watchedValues.track_quantity && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Quantity</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                placeholder="0"
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
                        name="low_stock_threshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Low Stock Alert</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min="1"
                                placeholder="10"
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value) || 10)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Product Type & Physical Properties */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Type & Physical Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="is_digital"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Digital Product
                          </FormLabel>
                          <FormDescription>
                            This is a digital product (no physical shipping
                            required)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {!form.watch("is_digital") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (g)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseFloat(e.target.value)
                                      : null
                                  )
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              Product weight in grams (for shipping calculation)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="dimensions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dimensions (L×W×H cm)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value || ""}
                                placeholder="30×20×10"
                              />
                            </FormControl>
                            <FormDescription>
                              Product dimensions for shipping (optional)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* SEO Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO Metadata</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Optional fields to improve search engine visibility
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="meta_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="Product meta title for search engines"
                            maxLength={60}
                          />
                        </FormControl>
                        <FormDescription>
                          Title that appears in search engine results (max 60
                          characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value || ""}
                            placeholder="Product meta description for search engines"
                            maxLength={160}
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Description that appears in search engine results (max
                          160 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {!requiredFieldsFilled && (
              <p className="text-sm text-red-600 text-right">
                Please fill in all required fields: Title, Description,
                Category, Price (&gt; 0), and at least one image
              </p>
            )}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isPending}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isPending || hasErrors || !requiredFieldsFilled}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {action}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
