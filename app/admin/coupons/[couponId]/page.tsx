import { getQueryClient } from "@/components/providers/react-query-provider";
import { getCouponDetails } from "@/features/coupons/actions/coupons.actions";
import { CouponFormEdit } from "@/features/coupons/components/coupon-form-edit";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface CouponPageProps {
  params: Promise<{ couponId: string }>;
}

const CouponPage = async ({ params }: CouponPageProps) => {
  const { couponId } = await params;
  const queryClient = getQueryClient();

  // Only prefetch if not creating a new coupon and couponId is valid
  if (couponId !== "new" && couponId) {
    try {
      await queryClient.prefetchQuery({
        queryKey: ["coupon", couponId],
        queryFn: () => getCouponDetails(couponId),
        staleTime: 5 * 60 * 1000,
      });
    } catch (error) {
      console.error("Error prefetching coupon details:", error);
      // Don't call notFound() here, let the component handle it
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CouponFormEdit couponId={couponId} />
    </HydrationBoundary>
  );
};

export default CouponPage;
