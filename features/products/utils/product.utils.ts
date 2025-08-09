import { Decimal } from "@/app/generated/prisma/runtime/library";

// Type for serialized product data (for client components)
export type SerializedProduct = {
  id: string;
  title: string;
  desc: string;
  slug: string;
  price: number;
  compare_price: number | null;
  cost_price: number | null;
  sku: string | null;
  barcode: string | null;
  track_quantity: boolean;
  quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
  is_digital: boolean;
  meta_title: string | null;
  meta_description: string | null;
  weight: number | null;
  dimensions: string | null;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  category_id: string;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  user: {
    id: string;
    name: string;
  };
  images: {
    id: string;
    url: string;
    alt: string | null;
    sort_order: number;
  }[];
  sizes: {
    id: string;
    value: string;
    name: string;
  }[];
  colors: {
    id: string;
    value: string;
    name: string;
  }[];
  _count?: {
    reviews: number;
    order_items: number;
    cart_items: number;
    wishlist_items: number;
  };
};

// Function to serialize product data for client components
export const serializeProduct = (product: any): SerializedProduct => {
  return {
    ...product,
    price:
      product.price instanceof Decimal ? Number(product.price) : product.price,
    compare_price:
      product.compare_price instanceof Decimal
        ? Number(product.compare_price)
        : product.compare_price,
    cost_price:
      product.cost_price instanceof Decimal
        ? Number(product.cost_price)
        : product.cost_price,
    weight:
      product.weight instanceof Decimal
        ? Number(product.weight)
        : product.weight,
  };
};

// Function to calculate discount percentage
export const calculateDiscountPercentage = (
  price: number,
  comparePrice: number | null
): number => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

// Function to format product price
export const formatProductPrice = (
  price: number,
  comparePrice?: number | null
): {
  price: string;
  comparePrice?: string;
  discount?: number;
} => {
  const formattedPrice = new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(price);

  if (comparePrice && comparePrice > price) {
    const formattedComparePrice = new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(comparePrice);

    const discount = calculateDiscountPercentage(price, comparePrice);

    return {
      price: formattedPrice,
      comparePrice: formattedComparePrice,
      discount,
    };
  }

  return { price: formattedPrice };
};

// Function to get product status
export const getProductStatus = (
  product: SerializedProduct
): {
  label: string;
  className: string;
} => {
  if (!product.is_active) {
    return {
      label: "Inactive",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
  }

  if (product.track_quantity && product.quantity <= 0) {
    return {
      label: "Out of Stock",
      className:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };
  }

  if (
    product.track_quantity &&
    product.quantity <= product.low_stock_threshold
  ) {
    return {
      label: "Low Stock",
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    };
  }

  return {
    label: "Active",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  };
};

// Function to get product type display
export const getProductTypeDisplay = (isDigital: boolean): string => {
  return isDigital ? "Digital" : "Physical";
};

// Function to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
};

// Function to validate and format dimensions
export const formatDimensions = (dimensions: string | null): string => {
  if (!dimensions) return "Not specified";
  try {
    const parsed = JSON.parse(dimensions);
    if (parsed.length && parsed.width && parsed.height) {
      return `${parsed.length} × ${parsed.width} × ${parsed.height} cm`;
    }
  } catch (error) {
    // If it's not JSON, treat as plain text
    return dimensions;
  }
  return dimensions;
};

// Function to get stock status
export const getStockStatus = (
  product: SerializedProduct
): {
  status: "in_stock" | "low_stock" | "out_of_stock" | "unlimited";
  message: string;
  color: string;
} => {
  if (!product.track_quantity) {
    return {
      status: "unlimited",
      message: "Unlimited",
      color: "text-blue-600",
    };
  }

  if (product.quantity <= 0) {
    return {
      status: "out_of_stock",
      message: "Out of Stock",
      color: "text-red-600",
    };
  }

  if (product.quantity <= product.low_stock_threshold) {
    return {
      status: "low_stock",
      message: `Low Stock (${product.quantity} left)`,
      color: "text-orange-600",
    };
  }

  return {
    status: "in_stock",
    message: `${product.quantity} in stock`,
    color: "text-green-600",
  };
};
