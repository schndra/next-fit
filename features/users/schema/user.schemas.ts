import z from "zod";

// User validation schemas
export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone: z.string().optional(),
    dob: z.date().optional().nullable(),
    image: z.string().url().optional().nullable(),
    role_ids: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // Validate date of birth is not in the future
      if (data.dob && data.dob > new Date()) {
        return false;
      }
      return true;
    },
    {
      message: "Date of birth cannot be in the future",
      path: ["dob"],
    }
  );

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters")
      .optional(),
    email: z.string().email("Please enter a valid email address").optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .optional(),
    first_name: z.string().optional().nullable(),
    last_name: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    dob: z.date().optional().nullable(),
    image: z.string().url().optional().nullable(),
    email_verified: z.date().optional().nullable(),
    role_ids: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // Validate date of birth is not in the future
      if (data.dob && data.dob > new Date()) {
        return false;
      }
      return true;
    },
    {
      message: "Date of birth cannot be in the future",
      path: ["dob"],
    }
  );

// User filter schema
export const userFilterSchema = z.object({
  search: z.string().optional(),
  role_id: z.string().optional(),
  email_verified: z.boolean().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
});

// Get users params schema
export const getUsersParamsSchema = z.object({
  search: z.string().optional(),
  role_id: z.string().optional(),
  email_verified: z.boolean().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// User type schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  email_verified: z.date().nullable(),
  image: z.string().nullable(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  phone: z.string().nullable(),
  dob: z.date().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
  roles: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
    })
  ),
  _count: z.object({
    orders: z.number(),
    products: z.number(),
    reviews: z.number(),
    addresses: z.number(),
  }),
});

// Role schema
export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserFilterInput = z.infer<typeof userFilterSchema>;
export type GetUsersParams = z.infer<typeof getUsersParamsSchema>;
export type UserType = z.infer<typeof userSchema>;
export type RoleType = z.infer<typeof roleSchema>;

// Input validation schemas for actions
export const createUserInputSchema = z.object({
  data: createUserSchema,
});

export const updateUserInputSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  data: updateUserSchema,
});

export const deleteUserInputSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

export type CreateUserActionInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserActionInput = z.infer<typeof updateUserInputSchema>;
export type DeleteUserActionInput = z.infer<typeof deleteUserInputSchema>;
