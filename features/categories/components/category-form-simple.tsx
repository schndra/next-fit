"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  CreateCategoryInput,
  createCategorySchema,
  UpdateCategoryInput,
  updateCategorySchema,
} from "@/features/categories/schema/category.schemas";
import {
  createCategory,
  getCategoryById,
  updateCategory,
  getAllCategories,
} from "@/features/categories/actions/categories.actions";
import { CustomFormField } from "@/components/FormComponents";
import Heading from "@/app/admin/_components/heading";
import { CategoryActions } from "./category-actions";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as LucideIcons from "lucide-react";

function CategoryForm({ categoryId }: { categoryId?: string }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [showIconPicker, setShowIconPicker] = useState(false);

  const { data: category } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => getCategoryById(categoryId!),
    enabled: !!categoryId,
  });

  const { data: allCategories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const isEditing = !!categoryId && !!category;
  const toastErrorMsg = isEditing ? "editing" : "creating";
  const toastSuccessMsg = isEditing ? "updated" : "created";

  const { mutate, isPending } = useMutation({
    mutationFn: (values: CreateCategoryInput | UpdateCategoryInput) =>
      isEditing
        ? updateCategory(categoryId!, values as UpdateCategoryInput)
        : createCategory(values as CreateCategoryInput),
    onSuccess: (data) => {
      if (!data) {
        toast.error(`Error ${toastErrorMsg} category. Let's try again.`);
        return;
      }
      toast.success(`Category ${toastSuccessMsg}! 🎉 Keep up the great work!`);

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      if (categoryId) {
        queryClient.invalidateQueries({ queryKey: ["category", categoryId] });
      }
      router.push("/admin/categories");
    },
  });

  const title = isEditing ? "Edit category" : "Create category";
  const description = isEditing ? "Edit a category." : "Add a new category";
  const action = isEditing ? "Save changes" : "Create";

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Available icons
  const iconOptions = [
    "Shirt",
    "Users",
    "User",
    "Footprints",
    "Watch",
    "Activity",
    "ShoppingBag",
    "Package",
    "Heart",
    "Star",
    "Crown",
    "Gem",
  ];

  // Define form
  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(
      isEditing ? updateCategorySchema : createCategorySchema
    ),
    defaultValues: {
      title: category?.title || "",
      desc: category?.desc || "",
      slug: category?.slug || "",
      icon: category?.icon || "Package",
      parent_id: category?.parent_id || undefined,
      is_main_category: category?.is_main_category ?? true,
      is_active: category?.is_active ?? true,
      sort_order: category?.sort_order || 1,
    },
  });

  // Watch title changes to auto-generate slug
  const watchedTitle = form.watch("title");

  // Update slug when title changes (only for new categories)
  if (!isEditing && watchedTitle) {
    const newSlug = generateSlug(watchedTitle);
    if (form.getValues("slug") !== newSlug) {
      form.setValue("slug", newSlug);
    }
  }

  function onSubmit(values: CreateCategoryInput) {
    mutate(values);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {isEditing && category && <CategoryActions category={category} />}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Title */}
            <CustomFormField
              control={form.control}
              name="title"
              placeholder="Category Name"
              labelText="Title"
            />

            {/* Slug */}
            <CustomFormField
              control={form.control}
              name="slug"
              placeholder="category-slug"
              labelText="Slug"
            />

            {/* Sort Order */}
            <FormField
              control={form.control}
              name="sort_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Icon */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowIconPicker(true)}
                        className="flex items-center gap-2"
                      >
                        {field.value &&
                          LucideIcons[
                            field.value as keyof typeof LucideIcons
                          ] &&
                          (() => {
                            const IconComponent = LucideIcons[
                              field.value as keyof typeof LucideIcons
                            ] as React.ComponentType<{ className?: string }>;
                            return <IconComponent className="h-4 w-4" />;
                          })()}
                        {field.value || "Select Icon"}
                      </Button>
                      <Input
                        placeholder="Icon name"
                        value={field.value}
                        onChange={field.onChange}
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Parent Category */}
            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">
                        No Parent (Main Category)
                      </SelectItem>
                      {allCategories
                        .filter(
                          (cat) => cat.is_main_category && cat.id !== categoryId
                        )
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Category description..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Switches */}
          <div className="flex flex-col sm:flex-row gap-6">
            <FormField
              control={form.control}
              name="is_main_category"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Main Category</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      This category can have subcategories
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
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Category is visible to users
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

          <Button className="ml-auto" type="submit" disabled={isPending}>
            {action}
          </Button>
        </form>
      </Form>

      {/* Icon Picker Dialog */}
      <Dialog open={showIconPicker} onOpenChange={setShowIconPicker}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose an Icon</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-6 gap-4 max-h-96 overflow-y-auto">
            {iconOptions.map((iconName) => {
              const IconComponent = LucideIcons[
                iconName as keyof typeof LucideIcons
              ] as React.ComponentType<{ className?: string }>;
              return IconComponent ? (
                <Button
                  key={iconName}
                  variant="outline"
                  className="h-16 w-16 flex flex-col items-center gap-1"
                  onClick={() => {
                    form.setValue("icon", iconName);
                    setShowIconPicker(false);
                  }}
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-xs">{iconName}</span>
                </Button>
              ) : null;
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CategoryForm;
