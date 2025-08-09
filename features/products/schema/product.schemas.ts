import { z } from "zod";

// Create product schema
export const createProductSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be less than 100 characters"),
    desc: z
      .string()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description must be less than 2000 characters"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .min(3, "Slug must be at least 3 characters")
      .max(100, "Slug must be less than 100 characters")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
      ),
    price: z
      .number()
      .min(0, "Price must be positive")
      .max(999999.99, "Price is too high")
      .refine(
        (val) => {
          const decimalPart = val.toString().split(".")[1];
          return !decimalPart || decimalPart.length <= 2;
        },
        {
          message: "Price can have at most 2 decimal places",
        }
      ),
    compare_price: z
      .number()
      .min(0, "Compare price must be positive")
      .max(999999.99, "Compare price is too high")
      .refine(
        (val) => {
          const decimalPart = val.toString().split(".")[1];
          return !decimalPart || decimalPart.length <= 2;
        },
        {
          message: "Compare price can have at most 2 decimal places",
        }
      )
      .optional()
      .nullable(),
    cost_price: z
      .number()
      .min(0, "Cost price must be positive")
      .max(999999.99, "Cost price is too high")
      .refine(
        (val) => {
          const decimalPart = val.toString().split(".")[1];
          return !decimalPart || decimalPart.length <= 2;
        },
        {
          message: "Cost price can have at most 2 decimal places",
        }
      )
      .optional()
      .nullable(),
    sku: z
      .string()
      .max(50, "SKU must be less than 50 characters")
      .regex(
        /^[A-Z0-9_-]*$/,
        "SKU can only contain uppercase letters, numbers, hyphens, and underscores"
      )
      .optional()
      .nullable(),
    barcode: z
      .string()
      .max(50, "Barcode must be less than 50 characters")
      .optional()
      .nullable(),
    track_quantity: z.boolean().default(true),
    quantity: z
      .number()
      .int("Quantity must be a whole number")
      .min(0, "Quantity must be non-negative")
      .max(999999, "Quantity is too high")
      .default(0),
    low_stock_threshold: z
      .number()
      .int("Low stock threshold must be a whole number")
      .min(0, "Low stock threshold must be non-negative")
      .max(999999, "Low stock threshold is too high")
      .default(10),
    is_active: z.boolean().default(true),
    is_featured: z.boolean().default(false),
    is_digital: z.boolean().default(false),
    meta_title: z
      .string()
      .max(60, "Meta title must be less than 60 characters")
      .optional()
      .nullable(),
    meta_description: z
      .string()
      .max(160, "Meta description must be less than 160 characters")
      .optional()
      .nullable(),
    weight: z
      .number()
      .min(0, "Weight must be positive")
      .max(999999.99, "Weight is too high")
      .refine(
        (val) => {
          const decimalPart = val.toString().split(".")[1];
          return !decimalPart || decimalPart.length <= 2;
        },
        {
          message: "Weight can have at most 2 decimal places",
        }
      )
      .optional()
      .nullable(),
    dimensions: z
      .string()
      .max(100, "Dimensions must be less than 100 characters")
      .optional()
      .nullable(),
    category_id: z.string().min(1, "Category is required"),
    sizes: z.array(z.string()).default([]),
    colors: z.array(z.string()).default([]),
    images: z
      .array(
        z.object({
          url: z.string(),
          alt: z.string().optional().nullable(),
          sort_order: z.number().default(0),
        })
      )
      .default([]),
  })
  .refine(
    (data) => {
      if (
        data.compare_price &&
        data.price &&
        data.compare_price <= data.price
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Compare price must be higher than regular price",
      path: ["compare_price"],
    }
  );

// Update product schema
export const updateProductSchema = createProductSchema.extend({
  id: z.string().min(1, "Product ID is required"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// Product types for components
export const PRODUCT_STATUS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export const PRODUCT_FEATURES = [
  { value: "featured", label: "Featured" },
  { value: "regular", label: "Regular" },
] as const;

export const PRODUCT_TYPES = [
  { value: "physical", label: "Physical Product" },
  { value: "digital", label: "Digital Product" },
] as const;
