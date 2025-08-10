"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getRecentOrders,
  getTopProducts,
  getMonthlyRevenue,
  DashboardStats,
  RecentOrder,
  TopProduct,
  MonthlyRevenue,
} from "@/features/admin/actions/dashboard.actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/features/orders/utils/order.utils";
import Link from "next/link";

interface DashboardClientProps {
  initialStats?: DashboardStats;
  initialOrders?: RecentOrder[];
  initialProducts?: TopProduct[];
  initialRevenue?: MonthlyRevenue[];
}

export function DashboardClient({
  initialStats,
  initialOrders,
  initialProducts,
  initialRevenue,
}: DashboardClientProps) {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
    initialData: initialStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: getRecentOrders,
    initialData: initialOrders,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const { data: topProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["top-products"],
    queryFn: getTopProducts,
    initialData: initialProducts,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: monthlyRevenue, isLoading: revenueLoading } = useQuery({
    queryKey: ["monthly-revenue"],
    queryFn: getMonthlyRevenue,
    initialData: initialRevenue,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const statsCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      change: `${stats?.revenueChange || 0}%`,
      trend: (stats?.revenueChange || 0) >= 0 ? "up" : "down",
      icon: DollarSign,
    },
    {
      title: "Orders",
      value: stats?.totalOrders?.toString() || "0",
      change: `${stats?.ordersChange || 0}%`,
      trend: (stats?.ordersChange || 0) >= 0 ? "up" : "down",
      icon: ShoppingCart,
    },
    {
      title: "Products",
      value: stats?.totalProducts?.toString() || "0",
      change: `${stats?.productsChange || 0}%`,
      trend: (stats?.productsChange || 0) >= 0 ? "up" : "down",
      icon: Package,
    },
    {
      title: "Customers",
      value: stats?.totalCustomers?.toString() || "0",
      change: `${stats?.customersChange || 0}%`,
      trend: (stats?.customersChange || 0) >= 0 ? "up" : "down",
      icon: Users,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/">
              <Eye className="h-4 w-4 mr-2" />
              View Store
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? "..." : stat.value}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                  )}
                  <span
                    className={
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }
                  >
                    {statsLoading ? "..." : stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Monthly Revenue Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly revenue and orders for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Loading chart...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {monthlyRevenue?.map((month, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm font-medium">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {month.orders} orders
                      </span>
                      <span className="font-medium">
                        {formatCurrency(month.revenue)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Best performing products this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts?.map((product, index) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.sales} sold • {formatCurrency(product.revenue)}
                      </p>
                    </div>
                    <div className="text-lg font-medium">#{index + 1}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders from your customers</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/admin/orders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders?.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{order.user.name}</h4>
                      <Badge
                        className={getStatusColor(order.status)}
                        variant="secondary"
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
