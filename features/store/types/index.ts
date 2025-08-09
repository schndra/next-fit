export interface StoreProduct {
  id: string;
  title: string;
  price: number;
  compare_price?: number;
  slug: string;
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
