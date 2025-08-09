import z from "zod";

// Color validation schemas
export const createColorSchema = z.object({
  value: z
    .string()
    .min(4, "Color value must be a valid hex color")
    .max(7, "Color value must be a valid hex color")
    .regex(
      /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      "Color value must be a valid hex color (e.g., #FF0000 or #F00)"
    ),
  name: z
    .string()
    .min(2, "Color name must be at least 2 characters")
    .max(50, "Color name must be less than 50 characters"),
  sort_order: z.number().int().min(0, "Sort order must be a positive number"),
});

export const updateColorSchema = z.object({
  id: z.string().min(1, "Color ID is required"),
  value: z
    .string()
    .min(4, "Color value must be a valid hex color")
    .max(7, "Color value must be a valid hex color")
    .regex(
      /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      "Color value must be a valid hex color (e.g., #FF0000 or #F00)"
    ),
  name: z
    .string()
    .min(2, "Color name must be at least 2 characters")
    .max(50, "Color name must be less than 50 characters"),
  sort_order: z.number().int().min(0, "Sort order must be a positive number"),
});

export type CreateColorInput = z.infer<typeof createColorSchema>;
export type UpdateColorInput = z.infer<typeof updateColorSchema>;
