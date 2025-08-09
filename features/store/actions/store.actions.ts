"use server";

import prisma from "@/lib/prisma";
import type {
  StoreProduct,
  StoreCategory,
  ProductFilters,
  DetailedStoreProduct,
} from "../types";
import { Product, Category, Image, Review } from "@/app/generated/prisma";

export async function getFeaturedProducts(): Promise<StoreProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        is_featured: true,
        is_active: true,
      },
      take: 8,
      include: {
        images: {
          orderBy: {
            sort_order: "asc",
          },
        },
        category: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return products.map(
      (product): StoreProduct => ({
        id: product.id,
        title: product.title,
        price: Number(product.price),
        compare_price: product.compare_price
          ? Number(product.compare_price)
          : undefined,
        slug: product.slug,
        images: product.images.map((image) => ({
          id: image.id,
          url: image.url,
          alt: image.alt || undefined,
        })),
        category: product.category,
        reviews: product.reviews,
        is_featured: product.is_featured,
        is_active: product.is_active,
      })
    );
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw new Error("Failed to fetch featured products");
  }
}

export async function getStoreCategories(): Promise<StoreCategory[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        is_active: true,
        is_main_category: true,
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                is_active: true,
              },
            },
          },
        },
      },
      orderBy: {
        sort_order: "asc",
      },
    });

    return categories.map(
      (category): StoreCategory => ({
        id: category.id,
        title: category.title,
        slug: category.slug,
        img: category.img || undefined,
        _count: category._count,
      })
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function getProducts(filters: ProductFilters = {}): Promise<{
  products: StoreProduct[];
  total: number;
}> {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      featured,
      search,
      page = 1,
      limit = 12,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {
      is_active: true,
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (featured !== undefined) {
      where.is_featured = featured;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          desc: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        skip,
        include: {
          images: {
            orderBy: {
              sort_order: "asc",
            },
          },
          category: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: products.map(
        (product): StoreProduct => ({
          id: product.id,
          title: product.title,
          price: Number(product.price),
          compare_price: product.compare_price
            ? Number(product.compare_price)
            : undefined,
          slug: product.slug,
          images: product.images.map((image) => ({
            id: image.id,
            url: image.url,
            alt: image.alt || undefined,
          })),
          category: product.category,
          reviews: product.reviews,
          is_featured: product.is_featured,
          is_active: product.is_active,
        })
      ),
      total,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

/**
 * Get a single product by slug with full details
 */
export async function getProductBySlug(
  slug: string
): Promise<DetailedStoreProduct | null> {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug,
        is_active: true,
      },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        images: {
          orderBy: { sort_order: "asc" },
          select: {
            id: true,
            url: true,
            alt: true,
            sort_order: true,
          },
        },
        reviews: {
          where: {
            is_approved: true,
          },
          include: {
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
          orderBy: { created_at: "desc" },
        },
        sizes: {
          select: {
            id: true,
            name: true,
            value: true,
          },
        },
        colors: {
          select: {
            id: true,
            name: true,
            value: true,
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return {
      id: product.id,
      title: product.title,
      desc: product.desc || "",
      slug: product.slug,
      price: Number(product.price),
      compare_price: product.compare_price
        ? Number(product.compare_price)
        : undefined,
      sku: product.sku || "",
      barcode: product.barcode || "",
      quantity: product.quantity,
      low_stock_threshold: product.low_stock_threshold || 0,
      is_active: product.is_active,
      is_featured: product.is_featured,
      is_digital: product.is_digital,
      meta_title: product.meta_title || "",
      meta_description: product.meta_description || "",
      created_at: product.created_at,
      category: product.category,
      images: product.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || "",
        sort_order: img.sort_order,
      })),
      reviews: product.reviews.map((review) => ({
        id: review.id,
        rating: review.rating,
        title: review.title || "",
        comment: review.comment || "",
        is_verified: review.is_verified,
        user: {
          id: review.user.id,
          name: `${review.user.first_name} ${review.user.last_name}`.trim(),
        },
        created_at: review.created_at,
      })),
      sizes: product.sizes,
      colors: product.colors,
    };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    throw new Error("Failed to fetch product");
  }
}

/**
 * Get related products for a specific product
 */
export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit: number = 4
): Promise<StoreProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        is_active: true,
        category_id: categoryId,
        id: { not: productId }, // Exclude current product
      },
      take: limit,
      include: {
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        images: {
          orderBy: { sort_order: "asc" },
          take: 1,
          select: {
            id: true,
            url: true,
            alt: true,
            sort_order: true,
          },
        },
        reviews: {
          where: {
            is_approved: true,
          },
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            reviews: {
              where: {
                is_approved: true,
              },
            },
          },
        },
      },
      orderBy: [{ is_featured: "desc" }, { created_at: "desc" }],
    });

    return products.map((product) => ({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: Number(product.price),
      compare_price: product.compare_price
        ? Number(product.compare_price)
        : undefined,
      category: product.category,
      images: product.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || "",
      })),
      reviews: product.reviews,
      is_featured: product.is_featured,
      is_active: product.is_active,
    }));
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw new Error("Failed to fetch related products");
  }
}
