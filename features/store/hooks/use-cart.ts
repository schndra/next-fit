"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  getCartSummary,
  getCartItems,
  updateCartItem,
  removeFromCart,
} from "../actions/cart.actions";
import { toast } from "sonner";

// Hook to add item to cart
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: (_, variables) => {
      // Invalidate and refetch cart queries
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
      queryClient.invalidateQueries({
        queryKey: ["cart-summary", variables.userId],
      });

      toast.success("Item added to cart!");
    },
    onError: (error) => {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    },
  });
}

// Hook to get cart summary (total items and total price)
export function useCartSummary(userId?: string) {
  return useQuery({
    queryKey: ["cart-summary", userId],
    queryFn: () => getCartSummary(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to get cart items
export function useCartItems(userId?: string) {
  return useQuery({
    queryKey: ["cart", userId],
    queryFn: () => getCartItems(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to update cart item quantity
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
      queryClient.invalidateQueries({
        queryKey: ["cart-summary", variables.userId],
      });
      toast.success("Cart updated!");
    },
    onError: (error) => {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    },
  });
}

// Hook to remove item from cart
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartItemId,
      userId,
    }: {
      cartItemId: string;
      userId: string;
    }) => removeFromCart(cartItemId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
      queryClient.invalidateQueries({
        queryKey: ["cart-summary", variables.userId],
      });
      toast.success("Item removed from cart!");
    },
    onError: (error) => {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item");
    },
  });
}
