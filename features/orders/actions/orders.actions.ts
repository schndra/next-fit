"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  OrderType,
  UpdateOrderActionInput,
  updateOrderInputSchema,
  DeleteOrderActionInput,
  deleteOrderInputSchema,
  OrderFilterInput,
} from "@/features/orders/schema/order.schemas";
import { auth } from "@/auth";

// Helper function to serialize Decimal values to numbers
const serializeOrder = (order: any): OrderType => {
  return {
    ...order,
    subtotal: Number(order.subtotal),
    tax_amount: Number(order.tax_amount),
    shipping_amount: Number(order.shipping_amount),
    discount_amount: Number(order.discount_amount),
    total: Number(order.total),
    coupon: order.coupon
      ? {
          ...order.coupon,
          value: Number(order.coupon.value),
        }
      : null,
    items:
      order.items?.map((item: any) => ({
        ...item,
        price: Number(item.price),
        total: Number(item.total),
      })) || [],
  };
};

// Helper function to serialize order list
const serializeOrderList = (orders: any[]): OrderType[] => {
  return orders.map(serializeOrder);
};

export const getAllOrders = async (
  filters?: OrderFilterInput
): Promise<OrderType[]> => {
  try {
    const where: any = {};

    // Apply filters
    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.payment_status) {
      where.payment_status = filters.payment_status;
    }

    if (filters?.start_date || filters?.end_date) {
      where.created_at = {};
      if (filters.start_date) {
        where.created_at.gte = filters.start_date;
      }
      if (filters.end_date) {
        where.created_at.lte = filters.end_date;
      }
    }

    if (filters?.search) {
      where.OR = [
        { order_number: { contains: filters.search, mode: "insensitive" } },
        { user: { name: { contains: filters.search, mode: "insensitive" } } },
        { user: { email: { contains: filters.search, mode: "insensitive" } } },
        { tracking_number: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
        shipping_address: true,
        billing_address: true,
        coupon: {
          select: {
            id: true,
            code: true,
            type: true,
            value: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                sku: true,
                images: {
                  select: {
                    url: true,
                    alt: true,
                  },
                  take: 1,
                  orderBy: {
                    sort_order: "asc",
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return serializeOrderList(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const getOrderById = async (id: string): Promise<OrderType | null> => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
        shipping_address: true,
        billing_address: true,
        coupon: {
          select: {
            id: true,
            code: true,
            type: true,
            value: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                sku: true,
                images: {
                  select: {
                    url: true,
                    alt: true,
                  },
                  take: 1,
                  orderBy: {
                    sort_order: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return null;
    }

    return serializeOrder(order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return null;
  }
};

export const getOrderDetails = async (
  id: string
): Promise<OrderType | null> => {
  return getOrderById(id);
};

export const updateOrder = async (input: UpdateOrderActionInput) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Validate input
    const validatedInput = updateOrderInputSchema.parse(input);

    const { id, data } = validatedInput;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return {
        success: false,
        message: "Order not found.",
      };
    }

    // Prepare update data
    const updateData: any = { ...data };

    // Handle date fields - convert to proper Date objects if they're strings
    if (data.shipped_at) {
      updateData.shipped_at = new Date(data.shipped_at);
    }
    if (data.delivered_at) {
      updateData.delivered_at = new Date(data.delivered_at);
    }

    // Auto-set shipped_at when status changes to SHIPPED
    if (data.status === "SHIPPED" && !existingOrder.shipped_at) {
      updateData.shipped_at = new Date();
    }

    // Auto-set delivered_at when status changes to DELIVERED
    if (data.status === "DELIVERED" && !existingOrder.delivered_at) {
      updateData.delivered_at = new Date();
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
        shipping_address: true,
        billing_address: true,
        coupon: {
          select: {
            id: true,
            code: true,
            type: true,
            value: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                sku: true,
                images: {
                  select: {
                    url: true,
                    alt: true,
                  },
                  take: 1,
                  orderBy: {
                    sort_order: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);

    return {
      success: true,
      message: "Order updated successfully.",
      data: serializeOrder(updatedOrder),
    };
  } catch (error) {
    console.error("Error updating order:", error);
    return {
      success: false,
      message: "Failed to update order. Please try again.",
    };
  }
};

export const deleteOrder = async (input: DeleteOrderActionInput) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Validate input
    const validatedInput = deleteOrderInputSchema.parse(input);
    const { id } = validatedInput;

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return {
        success: false,
        message: "Order not found.",
      };
    }

    // Check if order can be deleted (optional business logic)
    if (
      existingOrder.status === "DELIVERED" ||
      existingOrder.status === "SHIPPED"
    ) {
      return {
        success: false,
        message: "Cannot delete orders that have been shipped or delivered.",
      };
    }

    await prisma.order.delete({
      where: { id },
    });

    revalidatePath("/admin/orders");

    return {
      success: true,
      message: "Order deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting order:", error);
    return {
      success: false,
      message: "Failed to delete order. Please try again.",
    };
  }
};

// Get order statistics for dashboard
export const getOrderStats = async () => {
  try {
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      todayOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PROCESSING" } }),
      prisma.order.count({ where: { status: "SHIPPED" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.order.count({
        where: {
          created_at: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: Number(totalRevenue._sum.total || 0),
      todayOrders,
    };
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return {
      totalOrders: 0,
      pendingOrders: 0,
      processingOrders: 0,
      shippedOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      totalRevenue: 0,
      todayOrders: 0,
    };
  }
};
