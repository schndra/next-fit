import { getQueryClient } from "@/components/providers/react-query-provider";
import { getAllColors } from "@/features/colors/actions/colors.actions";
import Colors from "@/features/colors/components/colors";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const ColorsPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch colors data for instant loading
  await queryClient.prefetchQuery({
    queryKey: ["colors"],
    queryFn: getAllColors,
    staleTime: 5 * 60 * 1000, // Match the component's stale time
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Colors />
    </HydrationBoundary>
  );
};

export default ColorsPage;
