import z from "zod";

// Category validation schemas
export const createCategorySchema = z.object({
  title: z
    .string()
    .min(2, "Category title must be at least 2 characters")
    .max(100, "Category title must be less than 100 characters"),
  desc: z
    .string()
    .min(5, "Category description must be at least 5 characters")
    .max(500, "Category description must be less than 500 characters"),
  img: z.string().optional(),
  slug: z
    .string()
    .min(2, "Category slug must be at least 2 characters")
    .max(100, "Category slug must be less than 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  parent_id: z.string().optional(),
  is_main_category: z.boolean(),
  is_active: z.boolean(),
  sort_order: z.number().int().min(0, "Sort order must be a positive number"),
});

export const updateCategorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  title: z
    .string()
    .min(2, "Category title must be at least 2 characters")
    .max(100, "Category title must be less than 100 characters"),
  desc: z
    .string()
    .min(5, "Category description must be at least 5 characters")
    .max(500, "Category description must be less than 500 characters"),
  img: z.string().optional(),
  slug: z
    .string()
    .min(2, "Category slug must be at least 2 characters")
    .max(100, "Category slug must be less than 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  parent_id: z.string().optional(),
  is_main_category: z.boolean(),
  is_active: z.boolean(),
  sort_order: z.number().int().min(0, "Sort order must be a positive number"),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
