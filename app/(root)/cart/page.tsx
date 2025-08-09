"use client";

import { useSession } from "next-auth/react";
import { CartItemsList } from "@/features/store/components/cart-items-list";

export default function CartPage() {
  const { data: session } = useSession();

  const userId = session?.user?.id || "demo-user";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {!session?.user?.id && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              Please sign in to manage your cart. For now, showing demo cart.
            </p>
          </div>
        )}

        <CartItemsList userId={userId} />
      </div>
    </div>
  );
}
