import { notFound } from "next/navigation";
import { getOrderById } from "@/features/checkout/actions/order.actions";
import { OrderSuccess } from "@/features/checkout/components/order-success";

interface OrderPageProps {
  params: {
    orderId: string;
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const order = await getOrderById(params.orderId);

  if (!order) {
    notFound();
  }

  return <OrderSuccess order={order} />;
}
