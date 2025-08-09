"use server";

import prisma from "@/lib/prisma";
import { shippingAddressSchema, orderCreateSchema } from "../schema";
import type { ShippingAddress, CreatedOrder, OrderCreateData } from "../types";

/**
 * Get user's saved addresses
 */
export async function getUserAddresses(
  userId: string
): Promise<ShippingAddress[]> {
  try {
    const addresses = await prisma.address.findMany({
      where: { user_id: userId },
      orderBy: [{ is_default: "desc" }, { created_at: "desc" }],
    });

    return addresses.map((address) => ({
      id: address.id,
      first_name: address.first_name,
      last_name: address.last_name,
      company: address.company || undefined,
      address1: address.address1,
      address2: address.address2 || undefined,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone || undefined,
      is_default: address.is_default,
    }));
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    throw new Error("Failed to fetch addresses");
  }
}

/**
 * Save a new address or update existing one
 */
export async function saveAddress(
  userId: string,
  addressData: Omit<ShippingAddress, "id">
): Promise<ShippingAddress> {
  try {
    // Validate the data
    const validatedData = shippingAddressSchema.parse(addressData);

    // If this is set as default, unset other default addresses
    if (validatedData.is_default) {
      await prisma.address.updateMany({
        where: { user_id: userId, is_default: true },
        data: { is_default: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        ...validatedData,
        user_id: userId,
      },
    });

    return {
      id: address.id,
      first_name: address.first_name,
      last_name: address.last_name,
      company: address.company || undefined,
      address1: address.address1,
      address2: address.address2 || undefined,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone || undefined,
      is_default: address.is_default,
    };
  } catch (error) {
    console.error("Error saving address:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to save address"
    );
  }
}

/**
 * Update an existing address
 */
export async function updateAddress(
  userId: string,
  addressId: string,
  addressData: Omit<ShippingAddress, "id">
): Promise<ShippingAddress> {
  try {
    // Validate the data
    const validatedData = shippingAddressSchema.parse(addressData);

    // Verify the address belongs to the user
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, user_id: userId },
    });

    if (!existingAddress) {
      throw new Error("Address not found");
    }

    // If this is set as default, unset other default addresses
    if (validatedData.is_default) {
      await prisma.address.updateMany({
        where: {
          user_id: userId,
          is_default: true,
          id: { not: addressId },
        },
        data: { is_default: false },
      });
    }

    const address = await prisma.address.update({
      where: { id: addressId },
      data: validatedData,
    });

    return {
      id: address.id,
      first_name: address.first_name,
      last_name: address.last_name,
      company: address.company || undefined,
      address1: address.address1,
      address2: address.address2 || undefined,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone || undefined,
      is_default: address.is_default,
    };
  } catch (error) {
    console.error("Error updating address:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update address"
    );
  }
}

/**
 * Delete an address
 */
export async function deleteAddress(
  userId: string,
  addressId: string
): Promise<void> {
  try {
    // Verify the address belongs to the user
    const existingAddress = await prisma.address.findFirst({
      where: { id: addressId, user_id: userId },
    });

    if (!existingAddress) {
      throw new Error("Address not found");
    }

    await prisma.address.delete({
      where: { id: addressId },
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    throw new Error("Failed to delete address");
  }
}

/**
 * Calculate checkout summary including taxes and shipping
 */
export async function calculateCheckoutSummary(userId: string): Promise<{
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total: number;
  items_count: number;
}> {
  try {
    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: userId },
      include: {
        product: true,
      },
    });

    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    const items_count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Simple tax calculation (10% for now)
    const tax_amount = subtotal * 0.1;

    // Simple shipping calculation
    const shipping_amount = subtotal > 5000 ? 0 : 500; // Free shipping over 5000 LKR

    const discount_amount = 0; // TODO: Implement coupon system

    const total = subtotal + tax_amount + shipping_amount - discount_amount;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax_amount: Math.round(tax_amount * 100) / 100,
      shipping_amount: Math.round(shipping_amount * 100) / 100,
      discount_amount: Math.round(discount_amount * 100) / 100,
      total: Math.round(total * 100) / 100,
      items_count,
    };
  } catch (error) {
    console.error("Error calculating checkout summary:", error);
    throw new Error("Failed to calculate checkout summary");
  }
}

/**
 * Create an order from cart items
 */
export async function createOrder(
  userId: string,
  orderData: OrderCreateData
): Promise<CreatedOrder> {
  try {
    // Validate the order data
    const validatedData = orderCreateSchema.parse(orderData);

    // Get cart items to create order items
    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: userId },
      include: {
        product: true,
      },
    });

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    // Create the order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          order_number: orderNumber,
          user_id: userId,
          status: "PENDING",
          payment_status: "PENDING",
          subtotal: validatedData.subtotal,
          tax_amount: validatedData.tax_amount,
          shipping_amount: validatedData.shipping_amount,
          discount_amount: validatedData.discount_amount,
          total: validatedData.total,
          shipping_address_id: validatedData.shipping_address_id,
          billing_address_id: validatedData.billing_address_id,
          shipping_method: validatedData.shipping_method,
          payment_method: validatedData.payment_method,
          notes: validatedData.notes,
        },
      });

      // Create order items
      const orderItems = cartItems.map((cartItem) => ({
        order_id: newOrder.id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        price: Number(cartItem.product.price),
        total: Number(cartItem.product.price) * cartItem.quantity,
      }));

      await tx.orderItem.createMany({
        data: orderItems,
      });

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { user_id: userId },
      });

      return newOrder;
    });

    return {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      payment_status: order.payment_status,
      total: Number(order.total),
      created_at: order.created_at,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create order"
    );
  }
}
