import { getQueryClient } from "@/components/providers/react-query-provider";
import { getAllOrders } from "@/features/orders/actions/orders.actions";
import Orders from "@/features/orders/components/orders";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const OrdersPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch orders data for instant loading
  await queryClient.prefetchQuery({
    queryKey: ["orders"],
    queryFn: () => getAllOrders(),
    staleTime: 5 * 60 * 1000, // Match the component's stale time
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Orders />
    </HydrationBoundary>
  );
};

export default OrdersPage;
