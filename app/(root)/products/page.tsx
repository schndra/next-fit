import { Metadata } from "next";
import { getQueryClient } from "@/components/providers/react-query-provider";
import { getProducts } from "@/features/store/actions/store.actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const metadata: Metadata = {
  title: "Products - Browse All Items",
  description:
    "Browse our complete collection of products across all categories.",
};

export default async function ProductsPage() {
  const queryClient = getQueryClient();

  // Prefetch products data for instant loading
  await queryClient.prefetchQuery({
    queryKey: ["products", {}],
    queryFn: () => getProducts({}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">All Products</h1>
          <p className="text-muted-foreground">
            Products page coming soon. This will show all products with
            filtering and pagination.
          </p>
        </div>
      </div>
    </HydrationBoundary>
  );
}
