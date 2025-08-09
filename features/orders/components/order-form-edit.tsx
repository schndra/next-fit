"use client";

import { useRouter } from "next/navigation";
import { OrderDetailView } from "./order-detail-view";

interface OrderFormEditProps {
  orderId: string;
}

export function OrderFormEdit({ orderId }: OrderFormEditProps) {
  const router = useRouter();

  if (orderId === "new") {
    // Redirect to orders list as we don't create orders in admin
    router.push("/admin/orders");
    return null;
  }

  return <OrderDetailView orderId={orderId} />;
}
