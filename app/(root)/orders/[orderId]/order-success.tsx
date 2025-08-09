"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { type Order } from "@/features/checkout/actions/order.actions";

interface OrderSuccessProps {
  order: Order;
}

const SHIPPING_METHODS = {
  standard: { name: "Standard Shipping", days: "5-7 business days" },
  express: { name: "Express Shipping", days: "2-3 business days" },
  overnight: { name: "Overnight Shipping", days: "1 business day" },
};

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function OrderSuccess({ order }: OrderSuccessProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your order. We'll send you a confirmation email
            shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Order #{order.order_number}
                  </span>
                  <Badge
                    className={
                      STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]
                    }
                    variant="secondary"
                  >
                    {order.status}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {item.product.title}
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          SKU: {item.product.sku}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${item.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-semibold">
                        ${item.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.shipping_address && (
                  <div className="p-3 border rounded-lg bg-muted/50">
                    <div className="font-medium">
                      {order.shipping_address.first_name}{" "}
                      {order.shipping_address.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.shipping_address.address1}
                      {order.shipping_address.address2 &&
                        `, ${order.shipping_address.address2}`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.shipping_address.city},{" "}
                      {order.shipping_address.state}{" "}
                      {order.shipping_address.postal_code}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.shipping_address.country}
                    </div>
                    {order.shipping_address.phone && (
                      <div className="text-sm text-muted-foreground">
                        Phone: {order.shipping_address.phone}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 border rounded-lg bg-muted/50">
                  <div className="font-medium">
                    {SHIPPING_METHODS[
                      order.shipping_method as keyof typeof SHIPPING_METHODS
                    ]?.name || order.shipping_method}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Estimated delivery:{" "}
                    {SHIPPING_METHODS[
                      order.shipping_method as keyof typeof SHIPPING_METHODS
                    ]?.days || "TBD"}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 border rounded-lg bg-muted/50">
                  <div className="font-medium">
                    Payment Status: {order.payment_status}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Payment method details are securely stored
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${order.shipping_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${order.tax_amount.toFixed(2)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-${order.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button onClick={() => router.push("/")} className="w-full">
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/orders")}
                    className="w-full"
                  >
                    View All Orders
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="w-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
