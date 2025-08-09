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
import { Package, Calendar, DollarSign, Eye, ShoppingBag } from "lucide-react";
import { type Order } from "../actions/order.actions";

interface OrdersListProps {
  orders: Order[];
}

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-orange-100 text-orange-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function OrdersList({ orders }: OrdersListProps) {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6 text-center">
            When you place your first order, it will appear here.
          </p>
          <Button onClick={() => router.push("/")}>Start Shopping</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order #{order.order_number}
                </CardTitle>
                <CardDescription className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />${order.total.toFixed(2)}
                  </span>
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  className={
                    STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]
                  }
                  variant="secondary"
                >
                  {order.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Order Items Preview */}
              <div className="space-y-2">
                <h4 className="font-medium">Items ({order.items.length})</h4>
                <div className="grid gap-3">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {item.product.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Qty: {item.quantity} • ${item.price.toFixed(2)} each
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        ${item.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="text-sm text-muted-foreground text-center py-2">
                      +{order.items.length - 3} more items
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Shipping Info */}
              {order.shipping_address && (
                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <div className="text-sm text-muted-foreground">
                    <div>
                      {order.shipping_address.first_name}{" "}
                      {order.shipping_address.last_name}
                    </div>
                    <div>
                      {order.shipping_address.address1}
                      {order.shipping_address.address2 &&
                        `, ${order.shipping_address.address2}`}
                    </div>
                    <div>
                      {order.shipping_address.city},{" "}
                      {order.shipping_address.state}{" "}
                      {order.shipping_address.postal_code}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
