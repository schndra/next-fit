"use client";

import { useOrder } from "../hooks/use-orders";
import { OrderSuccess } from "../components/order-success";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";

interface OrderClientProps {
  orderId: string;
}

export function OrderClient({ orderId }: OrderClientProps) {
  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading order details...</span>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !order) {
    notFound();
  }

  return <OrderSuccess order={order} />;
}
