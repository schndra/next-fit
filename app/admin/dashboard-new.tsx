import { checkAdminAuth } from "@/lib/admin-auth";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import {
  getDashboardStats,
  getRecentOrders,
  getTopProducts,
  getMonthlyRevenue,
} from "@/features/admin/actions/dashboard.actions";
import { DashboardClient } from "@/features/admin/components/dashboard-client";
import { Suspense } from "react";

export default async function AdminDashboard() {
  // Check admin authentication
  await checkAdminAuth();

  const queryClient = new QueryClient();

  // Prefetch all dashboard data
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["dashboard-stats"],
      queryFn: getDashboardStats,
      staleTime: 5 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["recent-orders"],
      queryFn: getRecentOrders,
      staleTime: 2 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["top-products"],
      queryFn: getTopProducts,
      staleTime: 10 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["monthly-revenue"],
      queryFn: getMonthlyRevenue,
      staleTime: 10 * 60 * 1000,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardClient />
      </Suspense>
    </HydrationBoundary>
  );
}
