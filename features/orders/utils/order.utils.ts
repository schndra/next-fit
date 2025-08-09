import {
  OrderStatus,
  PaymentStatus,
  OrderType,
} from "@/features/orders/schema/order.schemas";

// Status mappings with colors and labels
export const orderStatusConfig: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string }
> = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  PROCESSING: {
    label: "Processing",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  SHIPPED: {
    label: "Shipped",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  REFUNDED: {
    label: "Refunded",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
};

export const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; color: string; bgColor: string }
> = {
  PENDING: {
    label: "Pending",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
  },
  PAID: {
    label: "Paid",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  FAILED: {
    label: "Failed",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  REFUNDED: {
    label: "Refunded",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  PARTIALLY_REFUNDED: {
    label: "Partially Refunded",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
  },
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(amount);
};

// Helper function to format date
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

// Helper function to format short date
export const formatShortDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj);
};

// Helper function to get full customer name
export const getCustomerName = (order: OrderType): string => {
  const { user } = order;
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  return user.name;
};

// Helper function to get full address string
export const formatAddress = (
  address:
    | NonNullable<OrderType["shipping_address"]>
    | NonNullable<OrderType["billing_address"]>
): string => {
  const addressParts = [
    address.address1,
    address.address2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ].filter(Boolean);

  return addressParts.join(", ");
};

// Helper function to get address name
export const getAddressName = (
  address:
    | NonNullable<OrderType["shipping_address"]>
    | NonNullable<OrderType["billing_address"]>
): string => {
  return `${address.first_name} ${address.last_name}`;
};

// Helper function to calculate order totals
export const calculateOrderTotals = (order: OrderType) => {
  const itemsTotal = order.items.reduce((sum, item) => sum + item.total, 0);
  const finalTotal =
    order.subtotal +
    order.tax_amount +
    order.shipping_amount -
    order.discount_amount;

  return {
    itemsTotal,
    subtotal: order.subtotal,
    taxAmount: order.tax_amount,
    shippingAmount: order.shipping_amount,
    discountAmount: order.discount_amount,
    finalTotal,
  };
};

// Helper function to get order status badge props
export const getOrderStatusBadge = (status: OrderStatus) => {
  const config = orderStatusConfig[status];
  return {
    label: config.label,
    className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`,
  };
};

// Helper function to get payment status badge props
export const getPaymentStatusBadge = (status: PaymentStatus) => {
  const config = paymentStatusConfig[status];
  return {
    label: config.label,
    className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`,
  };
};

// Helper function to check if order can be cancelled
export const canCancelOrder = (order: OrderType): boolean => {
  return !["SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].includes(
    order.status
  );
};

// Helper function to check if order can be refunded
export const canRefundOrder = (order: OrderType): boolean => {
  return (
    order.payment_status === "PAID" &&
    !["CANCELLED", "REFUNDED"].includes(order.status)
  );
};

// Helper function to check if tracking info can be added
export const canAddTracking = (order: OrderType): boolean => {
  return ["PROCESSING", "SHIPPED"].includes(order.status);
};

// Helper function to get next possible statuses
export const getNextPossibleStatuses = (
  currentStatus: OrderStatus
): OrderStatus[] => {
  switch (currentStatus) {
    case "PENDING":
      return ["CONFIRMED", "CANCELLED"];
    case "CONFIRMED":
      return ["PROCESSING", "CANCELLED"];
    case "PROCESSING":
      return ["SHIPPED", "CANCELLED"];
    case "SHIPPED":
      return ["DELIVERED"];
    case "DELIVERED":
      return ["REFUNDED"];
    case "CANCELLED":
      return [];
    case "REFUNDED":
      return [];
    default:
      return [];
  }
};

// Helper function to get order priority
export const getOrderPriority = (
  order: OrderType
): "high" | "medium" | "low" => {
  const now = new Date();
  const orderDate = new Date(order.created_at);
  const daysSinceOrder = Math.floor(
    (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (order.status === "PENDING" && daysSinceOrder > 2) {
    return "high";
  }

  if (order.status === "CONFIRMED" && daysSinceOrder > 1) {
    return "high";
  }

  if (order.status === "PROCESSING" && daysSinceOrder > 3) {
    return "medium";
  }

  return "low";
};
