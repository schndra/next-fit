import { getQueryClient } from "@/components/providers/react-query-provider";
import { getCouponById } from "@/features/coupons/actions/coupons.actions";
import { CouponDetailView } from "@/features/coupons/components/coupon-detail-view";
import { CouponFormEdit } from "@/features/coupons/components/coupon-form-edit";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface CouponPageProps {
  params: Promise<{ couponId: string }>;
  searchParams: Promise<{ mode?: string }>;
}

const CouponPage = async ({ params, searchParams }: CouponPageProps) => {
  const { couponId } = await params;
  const { mode } = await searchParams;
  const queryClient = getQueryClient();

  // Handle new coupon creation
  if (couponId === "new") {
    return <CouponFormEdit mode="create" />;
  }

  // Fetch existing coupon
  const coupon = await getCouponById(couponId);

  if (!coupon) {
    notFound();
  }

  // Prefetch coupon data for the detail view
  await queryClient.prefetchQuery({
    queryKey: ["coupon", couponId],
    queryFn: () => getCouponById(couponId),
    staleTime: 5 * 60 * 1000,
  });

  // Show edit form if mode is edit
  if (mode === "edit") {
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CouponFormEdit coupon={coupon} mode="edit" />
      </HydrationBoundary>
    );
  }

  // Show detail view by default
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CouponDetailView couponId={couponId} />
    </HydrationBoundary>
  );
};

export default CouponPage;
