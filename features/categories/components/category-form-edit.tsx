"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCategoryInput,
  createCategorySchema,
  UpdateCategoryInput,
  updateCategorySchema,
} from "@/features/categories/schema/category.schemas";
import { toast } from "sonner";
import {
  createCategory,
  getCategoryById,
  updateCategory,
  getMainCategories,
} from "@/features/categories/actions/categories.actions";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

function CategoryForm({ categoryId }: { categoryId: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isNewCategory = categoryId === "new";

  const { data } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => getCategoryById(categoryId),
    enabled: !isNewCategory, // Only fetch if not creating new category
  });

  const { data: parentCategories = [] } = useQuery({
    queryKey: ["main-categories"],
    queryFn: getMainCategories,
  });

  const toastErrorMsg = data ? "editing" : "creating";
  const toastSuccessMsg = data ? "updated" : "created";

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateCategoryInput | UpdateCategoryInput) =>
      data
        ? updateCategory({ ...values, id: categoryId } as UpdateCategoryInput)
        : createCategory(values as CreateCategoryInput),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(`Error ${toastErrorMsg} category. ${result.message}`);
        return;
      }
      toast.success(`Category ${toastSuccessMsg}! 🎉 Keep up the great work!`);
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      if (!isNewCategory) {
        queryClient.invalidateQueries({ queryKey: ["category", categoryId] });
      }
      router.push("/admin/categories");
    },
  });

  const title = data ? "Edit category" : "Create category";
  const description = data ? "Edit a category." : "Add a new category";
  const action = data ? "Save changes" : "Create";

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  // Define form
  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(data ? updateCategorySchema : createCategorySchema),
    defaultValues: {
      title: data?.title || "",
      desc: data?.desc || "",
      img: data?.img || "",
      slug: data?.slug || "",
      parent_id: data?.parent_id || "none",
      is_main_category: data?.is_main_category || false,
      is_active: data?.is_active !== undefined ? data.is_active : true,
      sort_order: data?.sort_order || 0,
    },
  });

  // Auto-generate slug when title changes (only for new categories)
  const watchTitle = form.watch("title");
  useEffect(() => {
    if (!data && watchTitle) {
      const slug = generateSlug(watchTitle);
      form.setValue("slug", slug);
    }
  }, [watchTitle, form, data]);

  function onSubmit(values: CreateCategoryInput) {
    // Clean up empty values
    const cleanData = {
      ...values,
      parent_id:
        values.parent_id === "none" ? undefined : values.parent_id || undefined,
      img: values.img || undefined,
    };
    mutate(cleanData);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/categories">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        {data && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}
      </div>

      <Separator />

      {/* Form */}
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Set up the fundamental details for your category.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Men's Clothing, Women's Shoes, Accessories"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The display name that customers will see
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Slug *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., mens-clothing, womens-shoes, accessories"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          URL-friendly version (auto-generated)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="desc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the clothing items in this category, such as styles, sizes, occasions, or target audience..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description to help customers understand this
                        category
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="img"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/category-image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Add an image URL to represent this category
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Organization Card */}
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>
                  Configure how this category fits into your store structure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="parent_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">
                              No parent (Main Category)
                            </SelectItem>
                            {parentCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose a parent category or leave as main category
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sort_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Lower numbers appear first in listings
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Category Settings</CardTitle>
                <CardDescription>
                  Configure visibility and category type settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="is_main_category"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">
                            Main Category
                          </FormLabel>
                          <FormDescription>
                            Mark this as a top-level main category
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
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">
                            Active Status
                          </FormLabel>
                          <FormDescription>
                            Make this category visible to customers
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
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-4">
              <Link href="/admin/categories">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {action}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Delete Dialog */}
      {data && (
        <DeleteCategoryDialog
          category={data}
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
}

export default CategoryForm;
