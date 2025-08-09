"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Decimal } from "@/app/generated/prisma/runtime/library";
import {
  CreateProductInput,
  UpdateProductInput,
  createProductSchema,
  updateProductSchema,
} from "../schema/product.schemas";
import { serializeProduct, SerializedProduct } from "../utils/product.utils";

type ActionResult<T = any> = {
  success: boolean;
  data?: T;
  error?: any;
};

// Get all products
export async function getAllProducts(): Promise<SerializedProduct[]> {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          orderBy: {
            sort_order: "asc",
          },
        },
        sizes: true,
        colors: true,
        _count: {
          select: {
            reviews: true,
            order_items: true,
            cart_items: true,
            wishlist_items: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Ensure proper serialization for all products
    return products.map((product) =>
      JSON.parse(JSON.stringify(serializeProduct(product)))
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

// Get product by ID
export async function getProductById(
  id: string
): Promise<SerializedProduct | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          orderBy: {
            sort_order: "asc",
          },
        },
        sizes: true,
        colors: true,
        _count: {
          select: {
            reviews: true,
            order_items: true,
            cart_items: true,
            wishlist_items: true,
          },
        },
      },
    });

    if (!product) return null;

    // Ensure proper serialization before returning
    const serialized = serializeProduct(product);

    // Double-check that no Decimal objects remain
    return JSON.parse(JSON.stringify(serialized));
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

// Get product details (same as getProductById but with different name for consistency)
export async function getProductDetails(
  id: string
): Promise<SerializedProduct | null> {
  return getProductById(id);
}

// Create product
export async function createProduct(
  input: CreateProductInput
): Promise<ActionResult<SerializedProduct>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedData = createProductSchema.parse(input);

    // Check if slug already exists
    const existingSlug = await prisma.product.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingSlug) {
      return { success: false, error: "Product with this slug already exists" };
    }

    // Check if SKU already exists (if provided)
    if (validatedData.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: validatedData.sku },
      });

      if (existingSku) {
        return {
          success: false,
          error: "Product with this SKU already exists",
        };
      }
    }

    // Create product with images, sizes, and colors
    const product = await prisma.product.create({
      data: {
        title: validatedData.title,
        desc: validatedData.desc,
        slug: validatedData.slug,
        price: new Decimal(validatedData.price),
        compare_price: validatedData.compare_price
          ? new Decimal(validatedData.compare_price)
          : null,
        cost_price: validatedData.cost_price
          ? new Decimal(validatedData.cost_price)
          : null,
        sku: validatedData.sku,
        barcode: validatedData.barcode,
        track_quantity: validatedData.track_quantity,
        quantity: validatedData.quantity,
        low_stock_threshold: validatedData.low_stock_threshold,
        is_active: validatedData.is_active,
        is_featured: validatedData.is_featured,
        is_digital: validatedData.is_digital,
        meta_title: validatedData.meta_title,
        meta_description: validatedData.meta_description,
        weight: validatedData.weight ? new Decimal(validatedData.weight) : null,
        dimensions: validatedData.dimensions,
        created_by: session.user.id,
        category_id: validatedData.category_id,
        images: {
          create: validatedData.images.map((image) => ({
            url: image.url,
            alt: image.alt,
            sort_order: image.sort_order,
          })),
        },
        sizes: {
          connect: validatedData.sizes.map((sizeId) => ({ id: sizeId })),
        },
        colors: {
          connect: validatedData.colors.map((colorId) => ({ id: colorId })),
        },
      },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          orderBy: {
            sort_order: "asc",
          },
        },
        sizes: true,
        colors: true,
        _count: {
          select: {
            reviews: true,
            order_items: true,
            cart_items: true,
            wishlist_items: true,
          },
        },
      },
    });

    revalidatePath("/admin/products");
    const serialized = serializeProduct(product);
    return { success: true, data: JSON.parse(JSON.stringify(serialized)) };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

// Update product
export async function updateProduct(
  input: UpdateProductInput
): Promise<ActionResult<SerializedProduct>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedData = updateProductSchema.parse(input);

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingProduct) {
      return { success: false, error: "Product not found" };
    }

    // Check if slug already exists (excluding current product)
    const existingSlug = await prisma.product.findFirst({
      where: {
        slug: validatedData.slug,
        id: { not: validatedData.id },
      },
    });

    if (existingSlug) {
      return { success: false, error: "Product with this slug already exists" };
    }

    // Check if SKU already exists (excluding current product)
    if (validatedData.sku) {
      const existingSku = await prisma.product.findFirst({
        where: {
          sku: validatedData.sku,
          id: { not: validatedData.id },
        },
      });

      if (existingSku) {
        return {
          success: false,
          error: "Product with this SKU already exists",
        };
      }
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: validatedData.id },
      data: {
        title: validatedData.title,
        desc: validatedData.desc,
        slug: validatedData.slug,
        price: new Decimal(validatedData.price),
        compare_price: validatedData.compare_price
          ? new Decimal(validatedData.compare_price)
          : null,
        cost_price: validatedData.cost_price
          ? new Decimal(validatedData.cost_price)
          : null,
        sku: validatedData.sku,
        barcode: validatedData.barcode,
        track_quantity: validatedData.track_quantity,
        quantity: validatedData.quantity,
        low_stock_threshold: validatedData.low_stock_threshold,
        is_active: validatedData.is_active,
        is_featured: validatedData.is_featured,
        is_digital: validatedData.is_digital,
        meta_title: validatedData.meta_title,
        meta_description: validatedData.meta_description,
        weight: validatedData.weight ? new Decimal(validatedData.weight) : null,
        dimensions: validatedData.dimensions,
        category_id: validatedData.category_id,
        // Handle images separately
        images: {
          deleteMany: {}, // Delete all existing images
          create: validatedData.images.map((image) => ({
            url: image.url,
            alt: image.alt,
            sort_order: image.sort_order,
          })),
        },
        // Handle sizes separately
        sizes: {
          set: [], // Disconnect all sizes first
          connect: validatedData.sizes.map((sizeId) => ({ id: sizeId })),
        },
        // Handle colors separately
        colors: {
          set: [], // Disconnect all colors first
          connect: validatedData.colors.map((colorId) => ({ id: colorId })),
        },
      },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          orderBy: {
            sort_order: "asc",
          },
        },
        sizes: true,
        colors: true,
        _count: {
          select: {
            reviews: true,
            order_items: true,
            cart_items: true,
            wishlist_items: true,
          },
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${validatedData.id}`);
    const serialized = serializeProduct(product);
    return { success: true, data: JSON.parse(JSON.stringify(serialized)) };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return { success: false, error: "Product not found" };
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

// Get categories for dropdown
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        is_active: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        parent_id: true,
        is_main_category: true,
      },
      orderBy: [{ is_main_category: "desc" }, { title: "asc" }],
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

// Get sizes for dropdown
export async function getSizes() {
  try {
    const sizes = await prisma.size.findMany({
      orderBy: {
        sort_order: "asc",
      },
    });

    return sizes;
  } catch (error) {
    console.error("Error fetching sizes:", error);
    throw new Error("Failed to fetch sizes");
  }
}

// Get colors for dropdown
export async function getColors() {
  try {
    const colors = await prisma.color.findMany({
      orderBy: {
        sort_order: "asc",
      },
    });

    return colors;
  } catch (error) {
    console.error("Error fetching colors:", error);
    throw new Error("Failed to fetch colors");
  }
}
