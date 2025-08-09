"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import { useAddToCart } from "../hooks/use-cart";

interface AddToCartButtonProps {
  productId: string;
  productTitle: string;
  availableStock: number;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "secondary";
  className?: string;
  showQuantitySelector?: boolean;
}

export function AddToCartButton({
  productId,
  productTitle,
  availableStock,
  disabled = false,
  size = "default",
  variant = "default",
  className,
  showQuantitySelector = false,
}: AddToCartButtonProps) {
  const [quantity] = useState(1);
  const { data: session } = useSession();
  const addToCartMutation = useAddToCart();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!session?.user?.id) {
      // Store the current URL for callback after sign in
      const currentUrl = window.location.href;
      // Redirect to sign in with callback URL
      signIn(undefined, {
        callbackUrl: currentUrl,
        redirect: true,
      });
      return;
    }

    addToCartMutation.mutate({
      productId,
      quantity,
      userId: session.user.id,
    });
  };

  const isOutOfStock = availableStock === 0;
  const isLoading = addToCartMutation.isPending;

  if (isOutOfStock) {
    return (
      <Button disabled variant="secondary" size={size} className={className}>
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isLoading || isOutOfStock}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {session?.user?.id ? "Add to Cart" : "Sign In & Add to Cart"}
        </>
      )}
    </Button>
  );
}
