import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/features/store/actions/store.actions";
import { ProductDetailContent } from "@/features/store/components/product-detail-content";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.meta_title || `${product.title} | Store`,
    description: product.meta_description || product.desc,
    openGraph: {
      title: product.title,
      description: product.desc,
      images: product.images.length > 0 ? [{ url: product.images[0].url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch product data on the server
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Create a new QueryClient for this request
  const queryClient = new QueryClient();

  // Prefetch product data
  await queryClient.prefetchQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
  });

  // Prefetch related products
  await queryClient.prefetchQuery({
    queryKey: ["related-products", product.id, product.category.id, 4],
    queryFn: () => getRelatedProducts(product.id, product.category.id, 4),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductDetailContent product={product} />
    </HydrationBoundary>
  );
}
