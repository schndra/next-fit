"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus } from "lucide-react";
import {
  useCartItems,
  useUpdateCartItem,
  useRemoveFromCart,
} from "../hooks/use-cart";
import { formatPrice } from "../utils/currency";
import type { CartItem } from "../actions/cart.actions";

interface CartItemsListProps {
  userId: string;
}

export function CartItemsList({ userId }: CartItemsListProps) {
  const { data: cartItems, isLoading, error } = useCartItems(userId);
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    updateCartItemMutation.mutate({
      cartItemId,
      quantity: newQuantity,
      userId,
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    removeFromCartMutation.mutate({
      cartItemId,
      userId,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-4 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-md" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-600">Error loading cart items</p>
      </Card>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your cart is empty</h3>
          <p className="text-muted-foreground">
            Add some products to your cart to get started.
          </p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </Card>
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {cartItems.map((item: CartItem) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                  {item.product.images && item.product.images.length > 0 ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.images[0].alt || item.product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-medium hover:text-blue-600 transition-colors line-clamp-2"
                  >
                    {item.product.title}
                  </Link>

                  <p className="text-sm text-muted-foreground mt-1">
                    SKU: {item.product.sku}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold">
                        {formatPrice(item.product.price)}
                      </span>
                      {item.product.compare_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(item.product.compare_price)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={
                            item.quantity <= 1 ||
                            updateCartItemMutation.isPending
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={
                            item.quantity >= item.product.quantity ||
                            updateCartItemMutation.isPending
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removeFromCartMutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-2 text-right">
                    <span className="text-sm text-muted-foreground">
                      Subtotal:{" "}
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/checkout" className="flex-1">
                <Button className="w-full">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
