import { Metadata } from "next";
import { getQueryClient } from "@/components/providers/react-query-provider";
import {
  getFeaturedProducts,
  getStoreCategories,
} from "@/features/store/actions/store.actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  HeroSection,
  CategoriesSection,
  FeaturedProductsSection,
  FeaturesSection,
} from "@/features/store/components";

export const metadata: Metadata = {
  title: "Home - Discover Amazing Products",
  description:
    "Shop from thousands of products across multiple categories with fast shipping and secure payments.",
};

export default async function Home() {
  const queryClient = getQueryClient();

  // Prefetch store data for instant loading
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["featured-products"],
      queryFn: getFeaturedProducts,
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
        <HeroSection />
        <CategoriesSection />
        <FeaturedProductsSection />
        <FeaturesSection />
      </div>
    </HydrationBoundary>
  );
}
