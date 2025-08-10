import { checkAdminAuth } from "@/lib/admin-auth";
import { getQueryClient } from "@/components/providers/react-query-provider";
import { getAllCategories } from "@/features/categories/actions/categories.actions";
import Categories from "@/features/categories/components/categories";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const CategoriesPage = async () => {
  // Check admin authentication
  await checkAdminAuth();

  const queryClient = getQueryClient();

  // Prefetch categories data for instant loading
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    staleTime: 5 * 60 * 1000, // Match the component's stale time
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Categories />
    </HydrationBoundary>
  );
};

export default CategoriesPage;
