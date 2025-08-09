import { Coupon } from "@/app/generated/prisma";

// Serialized coupon type for client components
export type SerializedCoupon = Omit<
  Coupon,
  "value" | "minimum_amount" | "maximum_amount"
> & {
  value: number;
  minimum_amount: number | null;
  maximum_amount: number | null;
};

// Function to calculate discount amount
export const calculateDiscount = (
  coupon: SerializedCoupon,
  orderTotal: number
): number => {
  switch (coupon.type) {
    case "PERCENTAGE":
      return (orderTotal * coupon.value) / 100;
    case "FIXED_AMOUNT":
      return Math.min(coupon.value, orderTotal);
    case "FREE_SHIPPING":
      return 0; // Shipping discount handled separately
    default:
      return 0;
  }
};

// Function to check if coupon is currently valid (not expired and active)
export const isCouponValid = (coupon: SerializedCoupon): boolean => {
  if (!coupon.is_active) {
    return false;
  }

  const now = new Date();

  // Check start date
  if (coupon.starts_at && now < coupon.starts_at) {
    return false;
  }

  // Check expiry date
  if (coupon.expires_at && now > coupon.expires_at) {
    return false;
  }

  return true;
};

// Function to get coupon status
export const getCouponStatus = (
  coupon: SerializedCoupon
): {
  status: "active" | "inactive" | "expired" | "scheduled";
  label: string;
  className: string;
} => {
  if (!coupon.is_active) {
    return {
      status: "inactive",
      label: "Inactive",
      className: "bg-gray-100 text-gray-800",
    };
  }

  const now = new Date();

  if (coupon.expires_at && now > coupon.expires_at) {
    return {
      status: "expired",
      label: "Expired",
      className: "bg-red-100 text-red-800",
    };
  }

  if (coupon.starts_at && now < coupon.starts_at) {
    return {
      status: "scheduled",
      label: "Scheduled",
      className: "bg-yellow-100 text-yellow-800",
    };
  }

  return {
    status: "active",
    label: "Active",
    className: "bg-green-100 text-green-800",
  };
};

// Function to format coupon value display
export const formatCouponValue = (coupon: SerializedCoupon): string => {
  switch (coupon.type) {
    case "PERCENTAGE":
      return `${coupon.value}%`;
    case "FIXED_AMOUNT":
      return `LKR ${coupon.value.toFixed(2)}`;
    case "FREE_SHIPPING":
      return "Free Shipping";
    default:
      return "-";
  }
};

// Function to get coupon type display
export const getCouponTypeDisplay = (
  type: SerializedCoupon["type"]
): string => {
  switch (type) {
    case "PERCENTAGE":
      return "Percentage Discount";
    case "FIXED_AMOUNT":
      return "Fixed Amount Discount";
    case "FREE_SHIPPING":
      return "Free Shipping";
    default:
      return "Unknown";
  }
};
