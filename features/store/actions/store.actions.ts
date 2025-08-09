"use server";

import prisma from "@/lib/prisma";
import { StoreProduct, StoreCategory, ProductFilters } from "../types";
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
