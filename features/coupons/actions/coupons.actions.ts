"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  CreateCouponInput,
  createCouponSchema,
  UpdateCouponInput,
  updateCouponSchema,
  DeleteCouponInput,
  deleteCouponSchema,
} from "@/features/coupons/schema/coupon.schemas";
import { CouponType } from "../components/column";
import { auth } from "@/auth";
import { Decimal } from "@/app/generated/prisma/runtime/library";

// Helper function to serialize Decimal values to numbers
const serializeCoupon = (coupon: any): CouponType => {
  return {
    ...coupon,
    value: Number(coupon.value),
    minimum_amount: coupon.minimum_amount
      ? Number(coupon.minimum_amount)
      : null,
    maximum_amount: coupon.maximum_amount
      ? Number(coupon.maximum_amount)
      : null,
  };
};

// Helper function to serialize coupon details with orders
const serializeCouponDetails = (coupon: any) => {
  return {
    ...coupon,
    value: Number(coupon.value),
    minimum_amount: coupon.minimum_amount
      ? Number(coupon.minimum_amount)
      : null,
    maximum_amount: coupon.maximum_amount
      ? Number(coupon.maximum_amount)
      : null,
    orders:
      coupon.orders?.map((order: any) => ({
        ...order,
        total: Number(order.total),
      })) || [],
  };
};

export const getAllCoupons = async (): Promise<CouponType[]> => {
  try {
    const coupons = await prisma.coupon.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: [
        {
          is_active: "desc",
        },
        {
          created_at: "desc",
        },
      ],
    });

    return coupons.map(serializeCoupon);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
};

export const getCouponById = async (id: string): Promise<CouponType | null> => {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    return coupon ? serializeCoupon(coupon) : null;
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return null;
  }
};

export const getCouponDetails = async (id: string) => {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orders: {
          select: {
            id: true,
            order_number: true,
            total: true,
            created_at: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            created_at: "desc",
          },
          take: 10,
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!coupon) {
      throw new Error("Coupon not found");
    }

    return serializeCouponDetails(coupon);
  } catch (error) {
    console.error("Error fetching coupon details:", error);
    throw error;
  }
};

export const createCoupon = async (data: CreateCouponInput) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // Validate the input data
    const validatedData = createCouponSchema.parse(data);

    // Check if coupon code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: {
        code: validatedData.code,
      },
    });

    if (existingCoupon) {
      throw new Error("Coupon code already exists");
    }

    // Convert number values to Decimal for database
    const couponData = {
      ...validatedData,
      value: new Decimal(validatedData.value),
      minimum_amount: validatedData.minimum_amount
        ? new Decimal(validatedData.minimum_amount)
        : null,
      maximum_amount: validatedData.maximum_amount
        ? new Decimal(validatedData.maximum_amount)
        : null,
      created_by: session.user.id,
    };

    const coupon = await prisma.coupon.create({
      data: couponData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    revalidatePath("/admin/coupons");
    return { success: true, data: serializeCoupon(coupon) };
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    return {
      success: false,
      error: error.message || "Failed to create coupon",
    };
  }
};

export const updateCoupon = async (data: UpdateCouponInput) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // Validate the input data
    const validatedData = updateCouponSchema.parse(data);

    // Check if coupon exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: {
        id: validatedData.id,
      },
    });

    if (!existingCoupon) {
      throw new Error("Coupon not found");
    }

    // Check if coupon code already exists (excluding current coupon)
    const duplicateCoupon = await prisma.coupon.findFirst({
      where: {
        code: validatedData.code,
        id: {
          not: validatedData.id,
        },
      },
    });

    if (duplicateCoupon) {
      throw new Error("Coupon code already exists");
    }

    // Convert number values to Decimal for database
    const couponData = {
      code: validatedData.code,
      type: validatedData.type,
      value: new Decimal(validatedData.value),
      description: validatedData.description,
      usage_limit: validatedData.usage_limit,
      usage_limit_per_user: validatedData.usage_limit_per_user,
      is_active: validatedData.is_active,
      starts_at: validatedData.starts_at,
      expires_at: validatedData.expires_at,
      minimum_amount: validatedData.minimum_amount
        ? new Decimal(validatedData.minimum_amount)
        : null,
      maximum_amount: validatedData.maximum_amount
        ? new Decimal(validatedData.maximum_amount)
        : null,
    };

    const coupon = await prisma.coupon.update({
      where: {
        id: validatedData.id,
      },
      data: couponData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    revalidatePath("/admin/coupons");
    revalidatePath(`/admin/coupons/${validatedData.id}`);
    return { success: true, data: serializeCoupon(coupon) };
  } catch (error: any) {
    console.error("Error updating coupon:", error);
    return {
      success: false,
      error: error.message || "Failed to update coupon",
    };
  }
};

export const deleteCoupon = async (data: DeleteCouponInput) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // Validate the input data
    const validatedData = deleteCouponSchema.parse(data);

    // Check if coupon exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: {
        id: validatedData.id,
      },
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });

    if (!existingCoupon) {
      throw new Error("Coupon not found");
    }

    // Check if coupon is being used in any orders
    if (existingCoupon._count.orders > 0) {
      throw new Error("Cannot delete coupon as it is being used in orders");
    }

    await prisma.coupon.delete({
      where: {
        id: validatedData.id,
      },
    });

    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting coupon:", error);
    return {
      success: false,
      error: error.message || "Failed to delete coupon",
    };
  }
};

// Utility function to check if coupon is valid
export const validateCouponCode = async (
  code: string,
  orderTotal: number,
  userId: string
) => {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: {
        code: code.toUpperCase(),
      },
      include: {
        orders: {
          where: {
            user_id: userId,
          },
        },
      },
    });

    if (!coupon) {
      return { valid: false, error: "Invalid coupon code" };
    }

    // Check if coupon is active
    if (!coupon.is_active) {
      return { valid: false, error: "Coupon is not active" };
    }

    // Check start date
    if (coupon.starts_at && new Date() < coupon.starts_at) {
      return { valid: false, error: "Coupon is not yet valid" };
    }

    // Check expiry date
    if (coupon.expires_at && new Date() > coupon.expires_at) {
      return { valid: false, error: "Coupon has expired" };
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { valid: false, error: "Coupon usage limit reached" };
    }

    // Check per user usage limit
    if (
      coupon.usage_limit_per_user &&
      coupon.orders.length >= coupon.usage_limit_per_user
    ) {
      return {
        valid: false,
        error: "You have reached the usage limit for this coupon",
      };
    }

    // Check minimum amount
    if (coupon.minimum_amount && orderTotal < Number(coupon.minimum_amount)) {
      return {
        valid: false,
        error: `Minimum order amount of $${coupon.minimum_amount} required`,
      };
    }

    // Check maximum amount
    if (coupon.maximum_amount && orderTotal > Number(coupon.maximum_amount)) {
      return {
        valid: false,
        error: `Maximum order amount of $${coupon.maximum_amount} exceeded`,
      };
    }

    return { valid: true, coupon: serializeCoupon(coupon) };
  } catch (error) {
    console.error("Error validating coupon:", error);
    return { valid: false, error: "Failed to validate coupon" };
  }
};
