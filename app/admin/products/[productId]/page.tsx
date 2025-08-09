import { getQueryClient } from "@/components/providers/react-query-provider";
import { getProductDetails } from "@/features/products/actions/products.actions";
import { getAllCategories } from "@/features/categories/actions/categories.actions";
import { getAllColors } from "@/features/colors/actions/colors.actions";
import { getAllSizes } from "@/features/sizes/actions/sizes.actions";
import { ProductFormSimple } from "@/features/products/components/product-form-simple";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = await params;
  const queryClient = getQueryClient();

  // Fetch categories, colors, and sizes in parallel
  const [categories, colors, sizes] = await Promise.all([
    getAllCategories(),
    getAllColors(),
    getAllSizes(),
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
      <ProductFormSimple
        initialData={initialData}
        categories={categories}
        colors={colors}
        sizes={sizes}
      />
    </HydrationBoundary>
  );
};

export default ProductPage;
