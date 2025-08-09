import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getQueryClient } from "@/components/providers/react-query-provider";
import { getUserOrders } from "@/features/checkout/actions/order.actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { OrdersClient } from "@/features/checkout/components/orders-client";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/orders");
  }

  const queryClient = getQueryClient();
  const userId = session.user.id;

  // Prefetch orders data for instant loading
  await queryClient.prefetchQuery({
    queryKey: ["orders", userId],
    queryFn: () => getUserOrders(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrdersClient />
    </HydrationBoundary>
  );
}
