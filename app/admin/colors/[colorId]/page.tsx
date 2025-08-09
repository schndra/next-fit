import { getQueryClient } from "@/components/providers/react-query-provider";
import { getColorDetails } from "@/features/colors/actions/colors.actions";
import { ColorDetailView } from "@/features/colors/components/color-detail-view";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

interface ColorDetailPageProps {
  params: {
    colorId: string;
  };
}

const ColorDetailPage = async ({ params }: ColorDetailPageProps) => {
  const { colorId } = params;
  const queryClient = getQueryClient();

  // Prefetch color details data
  try {
    await queryClient.prefetchQuery({
      queryKey: ["color", colorId],
      queryFn: () => getColorDetails(colorId),
      staleTime: 5 * 60 * 1000,
    });
  } catch (error) {
    console.error("Error prefetching color details:", error);
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ColorDetailView colorId={colorId} />
    </HydrationBoundary>
  );
};

export default ColorDetailPage;
