import z from "zod";

// Coupon validation schemas
export const createCouponSchema = z
  .object({
    code: z
      .string()
      .min(3, "Coupon code must be at least 3 characters")
      .max(20, "Coupon code must be less than 20 characters")
      .regex(
        /^[A-Z0-9_-]+$/,
        "Coupon code can only contain uppercase letters, numbers, underscores, and hyphens"
      ),
    type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"], {
      message: "Coupon type is required",
    }),
    value: z
      .number()
      .min(0, "Value must be positive")
      .refine((val) => Number(val.toFixed(2)) === val, {
        message: "Value can have at most 2 decimal places",
      }),
    description: z.string().optional(),
    usage_limit: z
      .number()
      .int()
      .min(1, "Usage limit must be at least 1")
      .optional()
      .nullable(),
    usage_limit_per_user: z
      .number()
      .int()
      .min(1, "Per user usage limit must be at least 1")
      .optional()
      .nullable(),
    is_active: z.boolean(),
    starts_at: z.date().optional().nullable(),
    expires_at: z.date().optional().nullable(),
    minimum_amount: z
      .number()
      .min(0, "Minimum amount must be positive")
      .refine((val) => Number(val.toFixed(2)) === val, {
        message: "Minimum amount can have at most 2 decimal places",
      })
      .optional()
      .nullable(),
    maximum_amount: z
      .number()
      .min(0, "Maximum amount must be positive")
      .refine((val) => Number(val.toFixed(2)) === val, {
        message: "Maximum amount can have at most 2 decimal places",
      })
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      // Validate percentage value
      if (data.type === "PERCENTAGE" && data.value > 100) {
        return false;
      }
      return true;
    },
    {
      message: "Percentage value cannot be greater than 100",
      path: ["value"],
    }
  )
  .refine(
    (data) => {
      // Validate date range
      if (
        data.starts_at &&
        data.expires_at &&
        data.starts_at >= data.expires_at
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Start date must be before expiry date",
      path: ["expires_at"],
    }
  )
  .refine(
    (data) => {
      // Validate amount range
      if (
        data.minimum_amount &&
        data.maximum_amount &&
        data.minimum_amount >= data.maximum_amount
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Minimum amount must be less than maximum amount",
      path: ["maximum_amount"],
    }
  );

export const updateCouponSchema = z
  .object({
    id: z.string().min(1, "Coupon ID is required"),
    code: z
      .string()
      .min(3, "Coupon code must be at least 3 characters")
      .max(20, "Coupon code must be less than 20 characters")
      .regex(
        /^[A-Z0-9_-]+$/,
        "Coupon code can only contain uppercase letters, numbers, underscores, and hyphens"
      ),
    type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"], {
      message: "Coupon type is required",
    }),
    value: z
      .number()
      .min(0, "Value must be positive")
      .refine((val) => Number(val.toFixed(2)) === val, {
        message: "Value can have at most 2 decimal places",
      }),
    description: z.string().optional(),
    usage_limit: z
      .number()
      .int()
      .min(1, "Usage limit must be at least 1")
      .optional()
      .nullable(),
    usage_limit_per_user: z
      .number()
      .int()
      .min(1, "Per user usage limit must be at least 1")
      .optional()
      .nullable(),
    is_active: z.boolean(),
    starts_at: z.date().optional().nullable(),
    expires_at: z.date().optional().nullable(),
    minimum_amount: z
      .number()
      .min(0, "Minimum amount must be positive")
      .refine((val) => Number(val.toFixed(2)) === val, {
        message: "Minimum amount can have at most 2 decimal places",
      })
      .optional()
      .nullable(),
    maximum_amount: z
      .number()
      .min(0, "Maximum amount must be positive")
      .refine((val) => Number(val.toFixed(2)) === val, {
        message: "Maximum amount can have at most 2 decimal places",
      })
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      // Validate percentage value
      if (data.type === "PERCENTAGE" && data.value > 100) {
        return false;
      }
      return true;
    },
    {
      message: "Percentage value cannot be greater than 100",
      path: ["value"],
    }
  )
  .refine(
    (data) => {
      // Validate date range
      if (
        data.starts_at &&
        data.expires_at &&
        data.starts_at >= data.expires_at
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Start date must be before expiry date",
      path: ["expires_at"],
    }
  )
  .refine(
    (data) => {
      // Validate amount range
      if (
        data.minimum_amount &&
        data.maximum_amount &&
        data.minimum_amount >= data.maximum_amount
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Minimum amount must be less than maximum amount",
      path: ["maximum_amount"],
    }
  );

export const deleteCouponSchema = z.object({
  id: z.string().min(1, "Coupon ID is required"),
});

// Type definitions
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type DeleteCouponInput = z.infer<typeof deleteCouponSchema>;

// Coupon type options for forms
export const COUPON_TYPES = [
  { value: "PERCENTAGE", label: "Percentage" },
  { value: "FIXED_AMOUNT", label: "Fixed Amount" },
  { value: "FREE_SHIPPING", label: "Free Shipping" },
] as const;
