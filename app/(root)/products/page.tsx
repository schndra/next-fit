import { Metadata } from "next";
import { getQueryClient } from "@/components/providers/react-query-provider";
import {
  getProducts,
  getStoreCategories,
} from "@/features/store/actions/store.actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductsPageContent } from "@/features/store/components";

export const metadata: Metadata = {
  title: "Products - Browse All Items",
  description:
    "Browse our complete collection of products across all categories.",
};

export default async function ProductsPage() {
  const queryClient = getQueryClient();

  // Prefetch initial data for instant loading
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["products", {}],
      queryFn: () => getProducts({}),
      staleTime: 5 * 60 * 1000, // 5 minutes
    }),
    queryClient.prefetchQuery({
      queryKey: ["store-categories"],
      queryFn: getStoreCategories,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-background">
        <ProductsPageContent />
      </div>
    </HydrationBoundary>
  );
}
