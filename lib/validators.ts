import z from "zod";

export const signupFormSchema = z
  .object({
    name: z
      .string()
      .min(2, "Display name must be at least 2 characters")
      .max(50, "Display name must be less than 50 characters"),
    first_name: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(30, "First name must be less than 30 characters"),
    last_name: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(30, "Last name must be less than 30 characters"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
    phone: z
      .string()
      .regex(/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),
    dob: z
      .string()
      .optional()
      .refine((date) => {
        if (!date) return true;
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 13 && age <= 120;
      }, "You must be at least 13 years old"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions"
      ),
    acceptMarketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInFormSchema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export type SignupFormData = z.infer<typeof signupFormSchema>;
