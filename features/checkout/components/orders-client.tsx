"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { OrdersList } from "../components/orders-list";
import { useUserOrders } from "../hooks/use-orders";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function OrdersClient() {
  const { data: session, status } = useSession();

  // Always call hooks at the top level, but conditionally pass parameters
  const {
    data: orders,
    isLoading,
    error,
  } = useUserOrders(session?.user?.id || undefined);

  // Handle loading state
  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/orders");
  }

  // Handle data loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading your orders...</span>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <p className="text-red-600">
                Failed to load orders. Please try again.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        <OrdersList orders={orders || []} />
      </div>
    </div>
  );
}
