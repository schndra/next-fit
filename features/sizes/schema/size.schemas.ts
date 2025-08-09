import z from "zod";

// Size validation schemas
export const createSizeSchema = z.object({
  value: z
    .string()
    .min(1, "Size value must be at least 1 character")
    .max(10, "Size value must be less than 10 characters")
    .regex(
      /^[a-zA-Z0-9_\-\s]+$/,
      "Size value can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
  name: z
    .string()
    .min(2, "Size name must be at least 2 characters")
    .max(50, "Size name must be less than 50 characters"),
  sort_order: z
    .number()
    .int()
    .min(0, "Sort order must be a positive number")
    .default(0),
});

export const updateSizeSchema = z.object({
  id: z.string().min(1, "Size ID is required"),
  value: z
    .string()
    .min(1, "Size value must be at least 1 character")
    .max(10, "Size value must be less than 10 characters")
    .regex(
      /^[a-zA-Z0-9_\-\s]+$/,
      "Size value can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
  name: z
    .string()
    .min(2, "Size name must be at least 2 characters")
    .max(50, "Size name must be less than 50 characters"),
  sort_order: z
    .number()
    .int()
    .min(0, "Sort order must be a positive number")
    .default(0),
});

export type CreateSizeInput = z.infer<typeof createSizeSchema>;
export type UpdateSizeInput = z.infer<typeof updateSizeSchema>;
