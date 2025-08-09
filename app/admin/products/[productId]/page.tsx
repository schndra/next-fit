import { getQueryClient } from "@/components/providers/react-query-provider";
import { getProductDetails } from "@/features/products/actions/products.actions";
import { getAllCategories } from "@/features/categories/actions/categories.actions";
import { getAllColors } from "@/features/colors/actions/colors.actions";
import { getAllSizes } from "@/features/sizes/actions/sizes.actions";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { ProductFormReactHookForm } from "@/features/products/components/product-form";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = await params;
  const queryClient = getQueryClient();

  // Prefetch categories, colors, and sizes
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

  let initialData = null;

  // Only fetch product data if not creating a new product
  if (productId !== "new" && productId) {
    try {
      initialData = await getProductDetails(productId);
      if (!initialData) {
        notFound();
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      notFound();
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductFormReactHookForm productId={productId} />
    </HydrationBoundary>
  );
};

export default ProductPage;
