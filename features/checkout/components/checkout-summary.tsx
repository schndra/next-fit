"use client";

import { ShoppingCart, Package, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { useCheckoutSummary } from "../hooks/use-checkout";
import { formatPrice } from "@/features/store/utils/currency";

interface CheckoutSummaryProps {
  className?: string;
}

export function CheckoutSummary({ className }: CheckoutSummaryProps) {
  const { data: session } = useSession();
  const { data: summary, isLoading } = useCheckoutSummary(session?.user?.id);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-1/5" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
            <Separator />
            <div className="flex justify-between">
              <div className="h-5 bg-gray-200 rounded w-1/4" />
              <div className="h-5 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Your cart is empty
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {summary.items_count}{" "}
                {summary.items_count === 1 ? "item" : "items"}
              </span>
            </div>
            <span className="font-medium">{formatPrice(summary.subtotal)}</span>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(summary.subtotal)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>{formatPrice(summary.tax_amount)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>
                {summary.shipping_amount === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  formatPrice(summary.shipping_amount)
                )}
              </span>
            </div>

            {summary.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(summary.discount_amount)}</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatPrice(summary.total)}</span>
          </div>

          {summary.shipping_amount === 0 && summary.subtotal > 0 && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
              <CreditCard className="h-4 w-4" />
              <span>You qualify for free shipping!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
