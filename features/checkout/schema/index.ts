import { z } from "zod";

// Shipping Address Schema
export const shippingAddressSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50),
  last_name: z.string().min(1, "Last name is required").max(50),
  company: z.string().max(100).optional(),
  address1: z.string().min(1, "Address is required").max(255),
  address2: z.string().max(255).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State/Province is required").max(100),
  postal_code: z.string().min(1, "Postal code is required").max(20),
  country: z.string().min(1, "Country is required").max(100),
  phone: z.string().max(20).optional(),
  is_default: z.boolean().optional().default(false),
});

// Billing Address Schema (extends shipping with same_as_shipping option)
export const billingAddressSchema = shippingAddressSchema.extend({
  same_as_shipping: z.boolean().default(true),
});

// Checkout Data Schema
export const checkoutDataSchema = z.object({
  shipping_address: shippingAddressSchema.optional(),
  billing_address: billingAddressSchema.optional(),
  shipping_method: z.string().optional(),
  payment_method: z.string().optional(),
  notes: z.string().max(500).optional(),
});

// Order Creation Schema
export const orderCreateSchema = z.object({
  shipping_address_id: z.string().optional(),
  billing_address_id: z.string().optional(),
  shipping_method: z.string().optional(),
  payment_method: z.string().optional(),
  notes: z.string().max(500).optional(),
  subtotal: z.number().min(0),
  tax_amount: z.number().min(0).default(0),
  shipping_amount: z.number().min(0).default(0),
  discount_amount: z.number().min(0).default(0),
  total: z.number().min(0),
});

// Types from schemas
export type ShippingAddressData = z.infer<typeof shippingAddressSchema>;
export type BillingAddressData = z.infer<typeof billingAddressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutDataSchema>;
export type OrderCreateData = z.infer<typeof orderCreateSchema>;
