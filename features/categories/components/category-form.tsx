"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CategoryType } from "./column";
import { Loader2, Search, Palette } from "lucide-react";
import {
  CreateCategoryInput,
  createCategorySchema,
  UpdateCategoryInput,
  updateCategorySchema,
} from "@/features/categories/schema/category.schemas";
import { getMainCategories } from "@/features/categories/actions/categories.actions";

// Popular Lucide icons for categories
const CATEGORY_ICONS = [
  "ShoppingBag",
  "Shirt",
  "Laptop",
  "Smartphone",
  "Headphones",
  "Watch",
  "Home",
  "Car",
  "Book",
  "GameController",
  "Camera",
  "Music",
  "Heart",
  "Star",
  "Gift",
  "Coffee",
  "Pizza",
  "Utensils",
  "Dumbbell",
  "Bike",
  "Plane",
  "MapPin",
  "Briefcase",
  "Palette",
  "Wrench",
  "Zap",
  "Shield",
  "Crown",
  "Diamond",
  "Flower",
  "Sun",
  "Moon",
  "Cloud",
  "Mountain",
  "Trees",
  "Fish",
  "Cat",
  "Dog",
  "Baby",
  "Users",
  "Calendar",
  "Clock",
  "Mail",
  "Phone",
  "Globe",
  "Lock",
  "Key",
  "Flag",
];

interface IconSelectorProps {
  value?: string;
  onSelect: (icon: string) => void;
  trigger?: React.ReactNode;
}

function IconSelector({ value, onSelect, trigger }: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredIcons = CATEGORY_ICONS.filter((icon) =>
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (icon: string) => {
    onSelect(icon);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" type="button">
            <Palette className="mr-2 h-4 w-4" />
            {value ? `Selected: ${value}` : "Select Icon"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[600px]">
        <DialogHeader>
          <DialogTitle>Select Category Icon</DialogTitle>
          <DialogDescription>
            Choose an icon to represent your category. Icons are from Lucide
            React.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-6 gap-2 max-h-[400px] overflow-y-auto p-2">
            {filteredIcons.map((iconName) => (
              <Button
                key={iconName}
                variant={value === iconName ? "default" : "outline"}
                size="sm"
                className="h-16 flex flex-col gap-1 text-xs"
                onClick={() => handleSelect(iconName)}
                type="button"
              >
                <span className="capitalize">{iconName}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CreateCategoryFormProps {
  mode: "create";
  initialData?: never;
  onSubmit: (data: CreateCategoryInput) => Promise<void>;
  onCancel: () => void;
}

interface EditCategoryFormProps {
  mode: "edit";
  initialData: CategoryType;
  onSubmit: (data: UpdateCategoryInput) => Promise<void>;
  onCancel: () => void;
}

type CategoryFormProps = CreateCategoryFormProps | EditCategoryFormProps;

export function CategoryForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Fetch parent categories for selection
  const { data: parentCategories = [] } = useQuery({
    queryKey: ["main-categories"],
    queryFn: getMainCategories,
  });

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .trim();
  };

  if (mode === "create") {
    const form = useForm<CreateCategoryInput>({
      resolver: zodResolver(createCategorySchema),
      defaultValues: {
        title: "",
        desc: "",
        img: "",
        slug: "",
        parent_id: "",
        is_main_category: false,
        is_active: true,
        sort_order: 0,
      },
    });

    // Auto-generate slug when title changes
    const watchTitle = form.watch("title");
    useEffect(() => {
      if (watchTitle) {
        const slug = generateSlug(watchTitle);
        form.setValue("slug", slug);
      }
    }, [watchTitle, form]);

    const handleSubmit = async (data: CreateCategoryInput) => {
      try {
        setIsLoading(true);
        // Clean up empty parent_id
        const cleanData = {
          ...data,
          parent_id: data.parent_id || undefined,
          img: data.img || undefined,
        };
        await onSubmit(cleanData);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="container mx-auto py-8 space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Electronics, Clothing, Books"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The display name of your category
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
                        placeholder="e.g., electronics, clothing, books"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version (auto-generated from title)
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
                      placeholder="Describe what products belong in this category..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of this category
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
                  <FormLabel>Category Icon</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <IconSelector
                        value={field.value}
                        onSelect={field.onChange}
                        trigger={
                          <Button
                            variant="outline"
                            type="button"
                            className="w-full justify-start"
                          >
                            <Palette className="mr-2 h-4 w-4" />
                            {field.value
                              ? `Selected: ${field.value}`
                              : "Select Category Icon"}
                          </Button>
                        }
                      />
                      {field.value && (
                        <Badge variant="secondary" className="mt-2">
                          Icon: {field.value}
                        </Badge>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Choose an icon to represent your category
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">
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
                      Leave empty to create a main category
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
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="is_main_category"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Main Category</FormLabel>
                      <FormDescription>
                        Mark as a primary category
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
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>Enable this category</FormDescription>
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

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Category
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  // Edit mode
  const form = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      id: initialData.id,
      title: initialData.title,
      desc: initialData.desc,
      img: initialData.img || "",
      slug: initialData.slug,
      parent_id: initialData.parent_id || "",
      is_main_category: initialData.is_main_category,
      is_active: initialData.is_active,
      sort_order: initialData.sort_order,
    },
  });

  // Auto-generate slug when title changes (but only if slug is empty or matches old pattern)
  const watchTitle = form.watch("title");
  useEffect(() => {
    if (watchTitle && watchTitle !== initialData.title) {
      const currentSlug = form.getValues("slug");
      const oldGeneratedSlug = generateSlug(initialData.title);

      // Only auto-update if current slug matches the old generated slug
      if (currentSlug === oldGeneratedSlug || !currentSlug) {
        const newSlug = generateSlug(watchTitle);
        form.setValue("slug", newSlug);
      }
    }
  }, [watchTitle, form, initialData.title]);

  const handleSubmit = async (data: UpdateCategoryInput) => {
    try {
      setIsLoading(true);
      // Clean up empty parent_id
      const cleanData = {
        ...data,
        parent_id: data.parent_id || undefined,
        img: data.img || undefined,
      };
      await onSubmit(cleanData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter out current category from parent options to prevent self-reference
  const availableParentCategories = parentCategories.filter(
    (cat) => cat.id !== initialData.id
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Electronics, Clothing, Books"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The display name of your category
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
                      placeholder="e.g., electronics, clothing, books"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    URL-friendly version (auto-generated from title)
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
                    placeholder="Describe what products belong in this category..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A brief description of this category
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
                <FormLabel>Category Icon</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <IconSelector
                      value={field.value}
                      onSelect={field.onChange}
                      trigger={
                        <Button
                          variant="outline"
                          type="button"
                          className="w-full justify-start"
                        >
                          <Palette className="mr-2 h-4 w-4" />
                          {field.value
                            ? `Selected: ${field.value}`
                            : "Select Category Icon"}
                        </Button>
                      }
                    />
                    {field.value && (
                      <Badge variant="secondary" className="mt-2">
                        Icon: {field.value}
                      </Badge>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Choose an icon to represent your category
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">
                        No parent (Main Category)
                      </SelectItem>
                      {availableParentCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Leave empty to create a main category
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
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>Lower numbers appear first</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="is_main_category"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Main Category</FormLabel>
                    <FormDescription>
                      Mark as a primary category
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>Enable this category</FormDescription>
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

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Category
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
