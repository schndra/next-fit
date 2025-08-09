import { getQueryClient } from "@/components/providers/react-query-provider";
import { getOrderById } from "@/features/checkout/actions/order.actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { OrderClient } from "@/features/checkout/components/order-client";

interface OrderPageProps {
  params: {
    orderId: string;
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const queryClient = getQueryClient();

  // Prefetch order data for instant loading
  await queryClient.prefetchQuery({
    queryKey: ["order", params.orderId],
    queryFn: () => getOrderById(params.orderId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderClient orderId={params.orderId} />
    </HydrationBoundary>
  );
}
