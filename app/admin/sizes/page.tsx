import { getQueryClient } from "@/components/providers/react-query-provider";
import { getAllSizes } from "@/features/sizes/actions/sizes.actions";
import Sizes from "@/features/sizes/components/sizes";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const SizesPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch sizes data for instant loading
  await queryClient.prefetchQuery({
    queryKey: ["sizes"],
    queryFn: getAllSizes,
    staleTime: 5 * 60 * 1000, // Match the component's stale time
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Sizes />
    </HydrationBoundary>
  );
};

export default SizesPage;
