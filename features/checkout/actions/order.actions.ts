"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { type OrderPlacementData } from "../schema";

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  total: number;
  product: {
    id: string;
    title: string;
    sku: string;
    images: Array<{
      id: string;
      url: string;
      alt: string;
    }>;
  };
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  notes?: string;
  shipping_method: string;
  payment_status: string;
  payment_method: string;
  created_at: Date;
  updated_at: Date;
  shipping_address: {
    first_name: string;
    last_name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
  } | null;
  billing_address: {
    first_name: string;
    last_name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
  } | null;
  items: OrderItem[];
}

/**
 * Generate a unique order number
 */
function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
}

/**
 * Calculate shipping cost based on method
 */
function calculateShippingCost(method: string): number {
  const costs = {
    standard: 0,
    express: 15,
    overnight: 30,
  };
  return costs[method as keyof typeof costs] || 0;
}

/**
 * Place a new order
 */
export async function placeOrder(
  userId: string,
  orderData: OrderPlacementData
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: userId },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return { success: false, error: "Cart is empty" };
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );
    const shippingCost = calculateShippingCost(orderData.shipping_method);
    const taxRate = 0.08; // 8% tax
    const taxAmount = subtotal * taxRate;
    const total = subtotal + shippingCost + taxAmount;

    // Get or create shipping address
    let shippingAddress = await prisma.address.findUnique({
      where: { id: orderData.shipping_address_id },
    });

    if (!shippingAddress) {
      return { success: false, error: "Shipping address not found" };
    }

    // Get or use shipping address as billing if not provided
    let billingAddress = shippingAddress;
    if (orderData.billing_address_id) {
      const foundBillingAddress = await prisma.address.findUnique({
        where: { id: orderData.billing_address_id },
      });
      if (foundBillingAddress) {
        billingAddress = foundBillingAddress;
      }
    }

    // Create order in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          order_number: generateOrderNumber(),
          user_id: userId,
          status: "PENDING",
          payment_status: "PENDING",
          payment_method: JSON.stringify({
            type: orderData.payment_method.type,
            last_four: orderData.payment_method.card_number.slice(-4),
            cardholder_name: orderData.payment_method.cardholder_name,
          }),
          subtotal,
          tax_amount: taxAmount,
          shipping_amount: shippingCost,
          discount_amount: 0,
          total,
          shipping_method: orderData.shipping_method,
          notes: orderData.notes,
          shipping_address_id: shippingAddress.id,
          billing_address_id: billingAddress.id,
        },
      });

      // Create order items
      for (const cartItem of cartItems) {
        await tx.orderItem.create({
          data: {
            order_id: order.id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            price: Number(cartItem.product.price),
            total: Number(cartItem.product.price) * cartItem.quantity,
          },
        });

        // Update product stock
        await tx.product.update({
          where: { id: cartItem.product_id },
          data: {
            quantity: {
              decrement: cartItem.quantity,
            },
          },
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { user_id: userId },
      });

      return order;
    });

    // Revalidate relevant paths
    revalidatePath("/cart");
    revalidatePath("/orders");
    revalidatePath("/admin/orders");

    return { success: true, orderId: result.id };
  } catch (error) {
    console.error("Failed to place order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to place order",
    };
  }
}

/**
 * Get user's orders
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const orders = await prisma.order.findMany({
      where: { user_id: userId },
      include: {
        shipping_address: true,
        billing_address: true,
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return orders.map((order) => ({
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      tax_amount: Number(order.tax_amount),
      shipping_amount: Number(order.shipping_amount),
      discount_amount: Number(order.discount_amount),
      notes: order.notes || undefined,
      shipping_method: order.shipping_method || "standard",
      payment_status: order.payment_status,
      payment_method: order.payment_method || "",
      created_at: order.created_at,
      updated_at: order.updated_at,
      shipping_address: order.shipping_address
        ? {
            first_name: order.shipping_address.first_name,
            last_name: order.shipping_address.last_name,
            address1: order.shipping_address.address1,
            address2: order.shipping_address.address2 || undefined,
            city: order.shipping_address.city,
            state: order.shipping_address.state,
            postal_code: order.shipping_address.postal_code,
            country: order.shipping_address.country,
            phone: order.shipping_address.phone || undefined,
          }
        : null,
      billing_address: order.billing_address
        ? {
            first_name: order.billing_address.first_name,
            last_name: order.billing_address.last_name,
            address1: order.billing_address.address1,
            address2: order.billing_address.address2 || undefined,
            city: order.billing_address.city,
            state: order.billing_address.state,
            postal_code: order.billing_address.postal_code,
            country: order.billing_address.country,
            phone: order.billing_address.phone || undefined,
          }
        : null,
      items: order.items.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: Number(item.price),
        total: Number(item.total),
        product: {
          id: item.product.id,
          title: item.product.title,
          sku: item.product.sku || "",
          images: item.product.images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt || "",
          })),
        },
      })),
    }));
  } catch (error) {
    console.error("Failed to get user orders:", error);
    return [];
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(
  orderId: string,
  userId?: string
): Promise<Order | null> {
  try {
    const whereClause: any = { id: orderId };
    if (userId) {
      whereClause.user_id = userId;
    }

    const order = await prisma.order.findFirst({
      where: whereClause,
      include: {
        shipping_address: true,
        billing_address: true,
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) return null;

    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      tax_amount: Number(order.tax_amount),
      shipping_amount: Number(order.shipping_amount),
      discount_amount: Number(order.discount_amount),
      notes: order.notes || undefined,
      shipping_method: order.shipping_method || "standard",
      payment_status: order.payment_status,
      payment_method: order.payment_method || "",
      created_at: order.created_at,
      updated_at: order.updated_at,
      shipping_address: order.shipping_address
        ? {
            first_name: order.shipping_address.first_name,
            last_name: order.shipping_address.last_name,
            address1: order.shipping_address.address1,
            address2: order.shipping_address.address2 || undefined,
            city: order.shipping_address.city,
            state: order.shipping_address.state,
            postal_code: order.shipping_address.postal_code,
            country: order.shipping_address.country,
            phone: order.shipping_address.phone || undefined,
          }
        : null,
      billing_address: order.billing_address
        ? {
            first_name: order.billing_address.first_name,
            last_name: order.billing_address.last_name,
            address1: order.billing_address.address1,
            address2: order.billing_address.address2 || undefined,
            city: order.billing_address.city,
            state: order.billing_address.state,
            postal_code: order.billing_address.postal_code,
            country: order.billing_address.country,
            phone: order.billing_address.phone || undefined,
          }
        : null,
      items: order.items.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: Number(item.price),
        total: Number(item.total),
        product: {
          id: item.product.id,
          title: item.product.title,
          sku: item.product.sku || "",
          images: item.product.images.map((img) => ({
            id: img.id,
            url: img.url,
            alt: img.alt || "",
          })),
        },
      })),
    };
  } catch (error) {
    console.error("Failed to get order:", error);
    return null;
  }
}
