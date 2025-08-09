"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useCartSummary } from "../hooks/use-cart";

interface CartContextType {
  totalItems: number;
  totalPrice: number;
  itemCount: number;
  isLoading: boolean;
  userId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user?.id || "demo-user";

  const { data: cartSummary, isLoading } = useCartSummary(userId);

  const value: CartContextType = {
    totalItems: cartSummary?.totalItems || 0,
    totalPrice: cartSummary?.totalPrice || 0,
    itemCount: cartSummary?.itemCount || 0,
    isLoading,
    userId: session?.user?.id || null,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
