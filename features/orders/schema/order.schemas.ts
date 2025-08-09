import z from "zod";

// Order status and payment status enums
export const orderStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);

export const paymentStatusEnum = z.enum([
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
]);

// Order update schema for admin
export const updateOrderSchema = z.object({
  status: orderStatusEnum.optional(),
  payment_status: paymentStatusEnum.optional(),
  tracking_number: z.string().optional().nullable(),
  shipping_method: z.string().optional().nullable(),
  admin_notes: z.string().optional().nullable(),
  shipped_at: z.date().optional().nullable(),
  delivered_at: z.date().optional().nullable(),
});

// Order filter schema
export const orderFilterSchema = z.object({
  status: orderStatusEnum.optional(),
  payment_status: paymentStatusEnum.optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  search: z.string().optional(),
});

// Order item type
export const orderItemSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  price: z.number(),
  total: z.number(),
  product: z.object({
    id: z.string(),
    title: z.string(),
    sku: z.string().nullable(),
    images: z
      .array(
        z.object({
          url: z.string(),
          alt: z.string().nullable(),
        })
      )
      .optional(),
  }),
});

// Order type schema
export const orderSchema = z.object({
  id: z.string(),
  order_number: z.string(),
  status: orderStatusEnum,
  payment_status: paymentStatusEnum,
  subtotal: z.number(),
  tax_amount: z.number(),
  shipping_amount: z.number(),
  discount_amount: z.number(),
  total: z.number(),
  payment_method: z.string().nullable(),
  payment_id: z.string().nullable(),
  shipping_method: z.string().nullable(),
  tracking_number: z.string().nullable(),
  shipped_at: z.date().nullable(),
  delivered_at: z.date().nullable(),
  notes: z.string().nullable(),
  admin_notes: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    first_name: z.string().nullable(),
    last_name: z.string().nullable(),
  }),
  shipping_address: z
    .object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      company: z.string().nullable(),
      address1: z.string(),
      address2: z.string().nullable(),
      city: z.string(),
      state: z.string(),
      postal_code: z.string(),
      country: z.string(),
      phone: z.string().nullable(),
    })
    .nullable(),
  billing_address: z
    .object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      company: z.string().nullable(),
      address1: z.string(),
      address2: z.string().nullable(),
      city: z.string(),
      state: z.string(),
      postal_code: z.string(),
      country: z.string(),
      phone: z.string().nullable(),
    })
    .nullable(),
  coupon: z
    .object({
      id: z.string(),
      code: z.string(),
      type: z.string(),
      value: z.number(),
    })
    .nullable(),
  items: z.array(orderItemSchema),
});

// Types
export type OrderStatus = z.infer<typeof orderStatusEnum>;
export type PaymentStatus = z.infer<typeof paymentStatusEnum>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type OrderFilterInput = z.infer<typeof orderFilterSchema>;
export type OrderType = z.infer<typeof orderSchema>;
export type OrderItemType = z.infer<typeof orderItemSchema>;

// Input validation schemas for actions
export const updateOrderInputSchema = z.object({
  id: z.string().min(1, "Order ID is required"),
  data: updateOrderSchema,
});

export const deleteOrderInputSchema = z.object({
  id: z.string().min(1, "Order ID is required"),
});

export type UpdateOrderActionInput = z.infer<typeof updateOrderInputSchema>;
export type DeleteOrderActionInput = z.infer<typeof deleteOrderInputSchema>;
