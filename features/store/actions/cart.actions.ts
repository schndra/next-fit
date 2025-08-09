"use server";

import prisma from "@/lib/prisma";

export interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    compare_price?: number;
    sku: string;
    quantity: number;
    is_active: boolean;
    images: Array<{
      id: string;
      url: string;
      alt: string;
    }>;
  };
  created_at: Date;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  userId: string;
}

export interface UpdateCartItemData {
  cartItemId: string;
  quantity: number;
  userId: string;
}

/**
 * Add item to cart or update quantity if already exists
 */
export async function addToCart(data: AddToCartData): Promise<CartItem> {
  try {
    const { productId, quantity, userId } = data;

    // Check if product exists and is active
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        is_active: true,
      },
    });

    if (!product) {
      throw new Error("Product not found or unavailable");
    }

    if (product.quantity < quantity) {
      throw new Error("Insufficient stock");
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        user_id_product_id: {
          user_id: userId,
          product_id: productId,
        },
      },
    });

    let cartItem;

    if (existingCartItem) {
      // Update existing cart item
      const newQuantity = existingCartItem.quantity + quantity;

      if (product.quantity < newQuantity) {
        throw new Error("Insufficient stock");
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              compare_price: true,
              sku: true,
              quantity: true,
              is_active: true,
              images: {
                take: 1,
                orderBy: { sort_order: "asc" },
                select: {
                  id: true,
                  url: true,
                  alt: true,
                },
              },
            },
          },
        },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          user_id: userId,
          product_id: productId,
          quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              title: true,
              slug: true,
              price: true,
              compare_price: true,
              sku: true,
              quantity: true,
              is_active: true,
              images: {
                take: 1,
                orderBy: { sort_order: "asc" },
                select: {
                  id: true,
                  url: true,
                  alt: true,
                },
              },
            },
          },
        },
      });
    }

    return {
      id: cartItem.id,
      quantity: cartItem.quantity,
      product: {
        id: cartItem.product.id,
        title: cartItem.product.title,
        slug: cartItem.product.slug,
        price: Number(cartItem.product.price),
        compare_price: cartItem.product.compare_price
          ? Number(cartItem.product.compare_price)
          : undefined,
        sku: cartItem.product.sku || "",
        quantity: cartItem.product.quantity,
        is_active: cartItem.product.is_active,
        images: cartItem.product.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt || "",
        })),
      },
      created_at: cartItem.created_at,
    };
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to add item to cart"
    );
  }
}

/**
 * Get user's cart items
 */
export async function getCartItems(userId: string): Promise<CartItem[]> {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: userId },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            compare_price: true,
            sku: true,
            quantity: true,
            is_active: true,
            images: {
              take: 1,
              orderBy: { sort_order: "asc" },
              select: {
                id: true,
                url: true,
                alt: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        title: item.product.title,
        slug: item.product.slug,
        price: Number(item.product.price),
        compare_price: item.product.compare_price
          ? Number(item.product.compare_price)
          : undefined,
        sku: item.product.sku || "",
        quantity: item.product.quantity,
        is_active: item.product.is_active,
        images: item.product.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt || "",
        })),
      },
      created_at: item.created_at,
    }));
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw new Error("Failed to fetch cart items");
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
  data: UpdateCartItemData
): Promise<CartItem> {
  try {
    const { cartItemId, quantity, userId } = data;

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        user_id: userId,
      },
      include: { product: true },
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    if (cartItem.product.quantity < quantity) {
      throw new Error("Insufficient stock");
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            compare_price: true,
            sku: true,
            quantity: true,
            is_active: true,
            images: {
              take: 1,
              orderBy: { sort_order: "asc" },
              select: {
                id: true,
                url: true,
                alt: true,
              },
            },
          },
        },
      },
    });

    return {
      id: updatedCartItem.id,
      quantity: updatedCartItem.quantity,
      product: {
        id: updatedCartItem.product.id,
        title: updatedCartItem.product.title,
        slug: updatedCartItem.product.slug,
        price: Number(updatedCartItem.product.price),
        compare_price: updatedCartItem.product.compare_price
          ? Number(updatedCartItem.product.compare_price)
          : undefined,
        sku: updatedCartItem.product.sku || "",
        quantity: updatedCartItem.product.quantity,
        is_active: updatedCartItem.product.is_active,
        images: updatedCartItem.product.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt || "",
        })),
      },
      created_at: updatedCartItem.created_at,
    };
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update cart item"
    );
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(
  cartItemId: string,
  userId: string
): Promise<void> {
  try {
    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        user_id: userId,
      },
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw new Error("Failed to remove item from cart");
  }
}

/**
 * Clear all items from cart
 */
export async function clearCart(userId: string): Promise<void> {
  try {
    await prisma.cartItem.deleteMany({
      where: { user_id: userId },
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw new Error("Failed to clear cart");
  }
}

/**
 * Get cart summary (total items and total price)
 */
export async function getCartSummary(userId: string): Promise<{
  totalItems: number;
  totalPrice: number;
  itemCount: number;
}> {
  try {
    const cartItems = await getCartItems(userId);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return {
      totalItems,
      totalPrice,
      itemCount: cartItems.length,
    };
  } catch (error) {
    console.error("Error fetching cart summary:", error);
    throw new Error("Failed to fetch cart summary");
  }
}
