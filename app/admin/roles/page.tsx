import { getQueryClient } from "@/components/providers/react-query-provider";
import { getAllRoles } from "@/features/roles/actions/roles.actions";
import Roles from "@/features/roles/components/roles";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const RolesPage = async () => {
  const queryClient = getQueryClient();

  // Prefetch roles data for instant loading
  await queryClient.prefetchQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
    staleTime: 5 * 60 * 1000, // Match the component's stale time
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Roles />
    </HydrationBoundary>
  );
};

export default RolesPage;
