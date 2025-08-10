"use server";

import prisma from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalProducts: number;
  productsChange: number;
  totalCustomers: number;
  customersChange: number;
}

export interface RecentOrder {
  id: string;
  user: {
    name: string;
    email: string;
  };
  total: number;
  status: string;
  created_at: Date;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

// Helper function to convert Decimal to number
function toNumber(value: number | Decimal): number {
  return typeof value === "number" ? value : Number(value.toString());
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    // Get current month stats
    const [currentStats, lastMonthStats] = await Promise.all([
      // Current month
      prisma.$transaction(async (tx) => {
        const revenue = await tx.order.aggregate({
          where: {
            created_at: { gte: currentMonth },
            status: { not: "CANCELLED" },
          },
          _sum: { total: true },
        });

        const orders = await tx.order.count({
          where: {
            created_at: { gte: currentMonth },
          },
        });

        const products = await tx.product.count();

        const customers = await tx.user.count({
          where: {
            created_at: { gte: currentMonth },
          },
        });

        return {
          revenue: toNumber(revenue._sum.total || 0),
          orders,
          products,
          customers,
        };
      }),

      // Last month
      prisma.$transaction(async (tx) => {
        const revenue = await tx.order.aggregate({
          where: {
            created_at: { gte: lastMonth, lt: currentMonth },
            status: { not: "CANCELLED" },
          },
          _sum: { total: true },
        });

        const orders = await tx.order.count({
          where: {
            created_at: { gte: lastMonth, lt: currentMonth },
          },
        });

        const customers = await tx.user.count({
          where: {
            created_at: { gte: lastMonth, lt: currentMonth },
          },
        });

        return {
          revenue: toNumber(revenue._sum.total || 0),
          orders,
          customers,
        };
      }),
    ]);

    // Calculate changes
    const revenueChange =
      lastMonthStats.revenue === 0
        ? 100
        : ((currentStats.revenue - lastMonthStats.revenue) /
            lastMonthStats.revenue) *
          100;

    const ordersChange =
      lastMonthStats.orders === 0
        ? 100
        : ((currentStats.orders - lastMonthStats.orders) /
            lastMonthStats.orders) *
          100;

    const customersChange =
      lastMonthStats.customers === 0
        ? 100
        : ((currentStats.customers - lastMonthStats.customers) /
            lastMonthStats.customers) *
          100;

    return {
      totalRevenue: currentStats.revenue,
      revenueChange: Math.round(revenueChange),
      totalOrders: currentStats.orders,
      ordersChange: Math.round(ordersChange),
      totalProducts: currentStats.products,
      productsChange: 0, // Products don't change as frequently
      totalCustomers: currentStats.customers,
      customersChange: Math.round(customersChange),
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalRevenue: 0,
      revenueChange: 0,
      totalOrders: 0,
      ordersChange: 0,
      totalProducts: 0,
      productsChange: 0,
      totalCustomers: 0,
      customersChange: 0,
    };
  }
}

export async function getRecentOrders(): Promise<RecentOrder[]> {
  try {
    const orders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      user: {
        name: order.user.name,
        email: order.user.email,
      },
      total: toNumber(order.total),
      status: order.status,
      created_at: order.created_at,
    }));
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }
}

export async function getTopProducts(): Promise<TopProduct[]> {
  try {
    const topProducts = await prisma.orderItem.groupBy({
      by: ["product_id"],
      _sum: {
        quantity: true,
        price: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });

    const productDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.product_id },
          select: {
            id: true,
            title: true,
            images: {
              take: 1,
              select: {
                url: true,
              },
            },
          },
        });

        return {
          id: product?.id || "",
          name: product?.title || "Unknown Product",
          sales: item._sum.quantity || 0,
          revenue: toNumber(item._sum.price || 0),
          image: product?.images?.[0]?.url || "",
        };
      })
    );

    return productDetails.filter((p) => p.id);
  } catch (error) {
    console.error("Error fetching top products:", error);
    return [];
  }
}

export async function getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await prisma.order.groupBy({
      by: ["created_at"],
      where: {
        created_at: {
          gte: sixMonthsAgo,
        },
        status: {
          not: "CANCELLED",
        },
      },
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
    });

    // Group by month
    const monthlyRevenue: {
      [key: string]: { revenue: number; orders: number };
    } = {};

    monthlyData.forEach((item) => {
      const month = new Date(item.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = { revenue: 0, orders: 0 };
      }

      monthlyRevenue[month].revenue += toNumber(item._sum.total || 0);
      monthlyRevenue[month].orders += item._count.id;
    });

    return Object.entries(monthlyRevenue).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders,
    }));
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    return [];
  }
}
