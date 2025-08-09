import { getQueryClient } from "@/components/providers/react-query-provider";
import { getAllProducts } from "@/features/products/actions/products.actions";
import Products from "@/features/products/components/products";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const ProductsPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch products data
  await queryClient.prefetchQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Products />
    </HydrationBoundary>
  );
};

export default ProductsPage;
