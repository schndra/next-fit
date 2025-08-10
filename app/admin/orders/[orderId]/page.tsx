import { checkAdminAuth } from "@/lib/admin-auth";
import { getQueryClient } from "@/components/providers/react-query-provider";
import { getOrderDetails } from "@/features/orders/actions/orders.actions";
import { OrderFormEdit } from "@/features/orders/components/order-form-edit";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
}

const OrderPage = async ({ params }: OrderPageProps) => {
  // Check admin authentication
  await checkAdminAuth();

  const { orderId } = await params;
  const queryClient = getQueryClient();

  // Only prefetch if not creating a new order and orderId is valid
  if (orderId !== "new" && orderId) {
    try {
      await queryClient.prefetchQuery({
        queryKey: ["order", orderId],
        queryFn: () => getOrderDetails(orderId),
        staleTime: 5 * 60 * 1000,
      });
    } catch (error) {
      console.error("Error prefetching order details:", error);
      // Don't call notFound() here, let the component handle it
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderFormEdit orderId={orderId} />
    </HydrationBoundary>
  );
};

export default OrderPage;
