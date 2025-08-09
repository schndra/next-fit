import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { RoleDetailView } from "@/features/roles/components/role-detail-view";
import { getRoleDetails } from "@/features/roles/actions/roles.actions";

interface RolePageProps {
  params: {
    roleId: string;
  };
}

const RolePage = async ({ params }: RolePageProps) => {
  const queryClient = new QueryClient();

  // Prefetch single role data
  await queryClient.prefetchQuery({
    queryKey: ["role-details", params.roleId],
    queryFn: () => getRoleDetails(params.roleId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoleDetailView roleId={params.roleId} />
    </HydrationBoundary>
  );
};

export default RolePage;
