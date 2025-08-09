import { getQueryClient } from "@/components/providers/react-query-provider";
import { getCategoryDetails } from "@/features/categories/actions/categories.actions";
import CategoryForm from "@/features/categories/components/category-form-edit";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface CategoryDetailPageProps {
  params: {
    categoryId: string;
  };
}

const CategoryDetailPage = async ({ params }: CategoryDetailPageProps) => {
  const { categoryId } = params;
  const queryClient = getQueryClient();

  // Only prefetch if not creating a new category
  if (categoryId !== "new") {
    try {
      await queryClient.prefetchQuery({
        queryKey: ["category", categoryId],
        queryFn: () => getCategoryDetails(categoryId),
        staleTime: 5 * 60 * 1000,
      });
    } catch (error) {
      console.error("Error prefetching category details:", error);
      notFound();
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoryForm categoryId={categoryId} />
    </HydrationBoundary>
  );
};

export default CategoryDetailPage;
