export interface StoreProduct {
  id: string;
  title: string;
  price: number;
  compare_price?: number;
  slug: string;
  quantity: number;
  images: Array<{
    id: string;
    url: string;
    alt?: string;
  }>;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  reviews: Array<{
    rating: number;
  }>;
  is_featured: boolean;
  is_active: boolean;
}

export interface DetailedStoreProduct {
  id: string;
  title: string;
  desc: string;
  slug: string;
  price: number;
  compare_price?: number;
  sku: string;
  barcode: string;
  quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
  is_digital: boolean;
  meta_title: string;
  meta_description: string;
  created_at: Date;
  category: {
    id: string;
    title: string;
    slug: string;
  };
  images: Array<{
    id: string;
    url: string;
    alt: string;
    sort_order: number;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    title: string;
    comment: string;
    is_verified: boolean;
    user: {
      id: string;
      name: string;
    };
    created_at: Date;
  }>;
  sizes: Array<{
    id: string;
    name: string;
    value: string;
  }>;
  colors: Array<{
    id: string;
    name: string;
    value: string;
  }>;
}

export interface StoreCategory {
  id: string;
  title: string;
  slug: string;
  img?: string;
  _count: {
    products: number;
  };
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
