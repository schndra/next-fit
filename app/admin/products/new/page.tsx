import { getQueryClient } from "@/components/providers/react-query-provider";
import { getAllCategories } from "@/features/categories/actions/categories.actions";
import { getAllColors } from "@/features/colors/actions/colors.actions";
import { getAllSizes } from "@/features/sizes/actions/sizes.actions";
import { ProductFormComplete } from "@/features/products/components/product-form-complete";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function NewProductPage() {
  const queryClient = getQueryClient();

  // Prefetch all required data
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: getAllCategories,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
    queryClient.prefetchQuery({
      queryKey: ["colors"],
      queryFn: getAllColors,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
    queryClient.prefetchQuery({
      queryKey: ["sizes"],
      queryFn: getAllSizes,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductFormComplete />
    </HydrationBoundary>
  );
}
