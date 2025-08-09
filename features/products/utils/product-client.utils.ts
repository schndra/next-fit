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
};

// Format currency utility (client-safe)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
  }).format(amount);
}

// Format product status
export function formatProductStatus(isActive: boolean): string {
  return isActive ? "Active" : "Inactive";
}

// Calculate discount percentage
export function calculateDiscountPercentage(
  price: number,
  comparePrice: number | null
): number | null {
  if (!comparePrice || comparePrice <= price) return null;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

// Format stock status
export function formatStockStatus(
  trackQuantity: boolean,
  quantity: number,
  lowStockThreshold: number
): string {
  if (!trackQuantity) return "Not tracked";
  if (quantity === 0) return "Out of stock";
  if (quantity <= lowStockThreshold) return "Low stock";
  return "In stock";
}

// Generate product URL
export function generateProductUrl(slug: string): string {
  return `/products/${slug}`;
}

// Get product display image
export function getProductDisplayImage(
  images: SerializedProduct["images"]
): string | null {
  if (images.length === 0) return null;

  // Sort by sort_order and get the first one
  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order);
  return sortedImages[0].url;
}

// Check if product is on sale
export function isProductOnSale(
  price: number,
  comparePrice: number | null
): boolean {
  return comparePrice !== null && comparePrice > price;
}

// Format product weight
export function formatWeight(weight: number | null): string {
  if (!weight) return "Not specified";
  return `${weight} kg`;
}

// Get product status (alias for formatProductStatus)
export function getProductStatus(isActive: boolean): string {
  return formatProductStatus(isActive);
}

// Get stock status (alias for formatStockStatus)
export function getStockStatus(
  trackQuantity: boolean,
  quantity: number,
  lowStockThreshold: number
): string {
  return formatStockStatus(trackQuantity, quantity, lowStockThreshold);
}

// Format product price (can handle single price or price comparison)
export function formatProductPrice(
  price: number,
  comparePrice?: number | null
): {
  price: string;
  comparePrice: string | null;
  discount: number | null;
} {
  const formattedPrice = formatCurrency(price);
  const formattedComparePrice = comparePrice
    ? formatCurrency(comparePrice)
    : null;
  const discount = calculateDiscountPercentage(price, comparePrice || null);

  return {
    price: formattedPrice,
    comparePrice: formattedComparePrice,
    discount,
  };
}
