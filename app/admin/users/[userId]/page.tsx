import { checkAdminAuth } from "@/lib/admin-auth";
import { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  getUserById,
  getAllRoles,
} from "@/features/users/actions/users.actions";
import { UserFormEdit } from "@/features/users/components/user-form-edit";
import { notFound } from "next/navigation";

interface UserPageProps {
  params: {
    userId: string;
  };
}

export default async function UserPage({ params }: UserPageProps) {
  // Check admin authentication
  await checkAdminAuth();

  const { userId } = params;
  const queryClient = new QueryClient();

  // If it's not a new user, prefetch the user data
  if (userId !== "new") {
    try {
      const user = await getUserById(userId);
      if (!user) {
        notFound();
      }

      await queryClient.prefetchQuery({
        queryKey: ["user", userId],
        queryFn: () => getUserById(userId),
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      notFound();
    }
  }

  // Prefetch roles for both new and existing users
  await queryClient.prefetchQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading user...</div>}>
        <UserFormEdit userId={userId} />
      </Suspense>
    </HydrationBoundary>
  );
}
