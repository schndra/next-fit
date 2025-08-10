import { checkAdminAuth } from "@/lib/admin-auth";
import { getQueryClient } from "@/components/providers/react-query-provider";
import { getAllCoupons } from "@/features/coupons/actions/coupons.actions";
import Coupons from "@/features/coupons/components/coupons";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const CouponsPage = async () => {
  // Check admin authentication
  await checkAdminAuth();

  const queryClient = getQueryClient();

  // Prefetch coupons data for instant loading
  await queryClient.prefetchQuery({
    queryKey: ["coupons"],
    queryFn: getAllCoupons,
    staleTime: 5 * 60 * 1000, // Match the component's stale time
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Coupons />
    </HydrationBoundary>
  );
};

export default CouponsPage;
