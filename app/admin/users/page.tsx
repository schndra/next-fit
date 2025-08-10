import { checkAdminAuth } from "@/lib/admin-auth";
import { Suspense } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  getAllUsers,
  getAllRoles,
} from "@/features/users/actions/users.actions";
import { UsersPageClient } from "../../../features/users/components/users-page-client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function UsersPage() {
  // Check admin authentication
  await checkAdminAuth();

  const queryClient = new QueryClient();

  // Prefetch users and roles data
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers({}),
  });

  await queryClient.prefetchQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Users Table */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>Loading users...</div>}>
          <UsersPageClient />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
