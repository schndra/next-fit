"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import {
  useCartSummary,
  useCartItems,
  useUpdateCartItem,
  useRemoveFromCart,
} from "../hooks/use-cart";
import { formatPrice } from "../utils/currency";
import type { CartItem } from "../actions/cart.actions";

interface CartDropdownProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

export function CartDropdown({
  variant = "ghost",
  size = "default",
}: CartDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { data: cartSummary } = useCartSummary(session?.user?.id);
  const { data: cartItems, isLoading } = useCartItems(session?.user?.id);
  const updateCartItemMutation = useUpdateCartItem();
  const removeFromCartMutation = useRemoveFromCart();

  const totalItems = cartSummary?.totalItems || 0;

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1 || !session?.user?.id) return;

    updateCartItemMutation.mutate({
      cartItemId,
      quantity: newQuantity,
      userId: session.user.id,
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    if (!session?.user?.id) return;

    removeFromCartMutation.mutate({
      cartItemId,
      userId: session.user.id,
    });
  };

  const CartButton = (
    <Button variant={variant} size="icon" className="relative">
      <ShoppingCart className="h-5 w-5" />
      {totalItems > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          {totalItems > 99 ? "99+" : totalItems}
        </Badge>
      )}
    </Button>
  );

  if (!session?.user?.id) {
    return <Link href="/cart">{CartButton}</Link>;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>{CartButton}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-96 p-0"
        align="end"
        onInteractOutside={() => setIsOpen(false)}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Shopping Cart</h3>
              <span className="text-sm text-muted-foreground">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="px-4 pb-4">
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-16 h-16 bg-gray-200 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : !cartItems || cartItems.length === 0 ? (
              <div className="px-4 pb-4 text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="mt-2">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="max-h-80 overflow-y-auto px-4">
                  <div className="space-y-3 pb-4">
                    {cartItems.map((item: CartItem) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.product.images &&
                          item.product.images.length > 0 ? (
                            <Image
                              src={item.product.images[0].url}
                              alt={
                                item.product.images[0].alt || item.product.title
                              }
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="font-medium text-sm hover:text-blue-600 transition-colors line-clamp-2"
                          >
                            {item.product.title}
                          </Link>

                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-semibold">
                              {formatPrice(item.product.price)}
                            </span>

                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={
                                  item.quantity <= 1 ||
                                  updateCartItemMutation.isPending
                                }
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-xs font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  item.quantity >= item.product.quantity ||
                                  updateCartItemMutation.isPending
                                }
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={removeFromCartMutation.isPending}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="px-4 py-4 space-y-3">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total:</span>
                    <span>{formatPrice(cartSummary?.totalPrice || 0)}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href="/cart"
                      className="flex-1"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="outline" className="w-full" size="sm">
                        View Cart
                      </Button>
                    </Link>
                    <Button className="flex-1" size="sm">
                      Checkout
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
