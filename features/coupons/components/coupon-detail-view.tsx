"use client";

import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  Copy,
  Calendar,
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getCouponDetails } from "../actions/coupons.actions";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import {
  formatCouponValue,
  getCouponStatus,
  getCouponTypeDisplay,
} from "../utils/coupon.utils";

interface CouponDetailViewProps {
  couponId: string;
}

export const CouponDetailView = ({ couponId }: CouponDetailViewProps) => {
  const router = useRouter();

  const {
    data: coupon,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["coupon", couponId],
    queryFn: () => getCouponDetails(couponId),
    enabled: !!couponId,
  });

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Coupon code copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading coupon details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !coupon) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">
            Error loading coupon
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Coupon not found or failed to load
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { label: statusLabel, className: statusClassName } =
    getCouponStatus(coupon);

  const usagePercentage = coupon.usage_limit
    ? (coupon.used_count / coupon.usage_limit) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{coupon.code}</h1>
            <p className="text-muted-foreground">
              Coupon Details • Created{" "}
              {new Date(coupon.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onCopy(coupon.code)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Code
          </Button>
          <Button
            onClick={() => router.push(`/admin/coupons/${couponId}?mode=edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Coupon
          </Button>
        </div>
      </div>

      {/* Status and Key Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge variant="secondary" className={statusClassName}>
                  {statusLabel}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Value
                </p>
                <div className="text-2xl font-bold">
                  {formatCouponValue(coupon)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Usage
                </p>
                <div className="text-2xl font-bold">
                  {coupon.used_count}
                  {coupon.usage_limit && `/${coupon.usage_limit}`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Orders
                </p>
                <div className="text-2xl font-bold">{coupon._count.orders}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coupon Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coupon Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Code
                    </p>
                    <p className="font-mono font-medium">{coupon.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Type
                    </p>
                    <p className="font-medium">
                      {getCouponTypeDisplay(coupon.type)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Value
                    </p>
                    <p className="font-medium">{formatCouponValue(coupon)}</p>
                  </div>
                  {coupon.description && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Description
                      </p>
                      <p className="text-sm">{coupon.description}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Created By
                    </p>
                    <p className="font-medium">{coupon.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {coupon.user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Created
                    </p>
                    <p className="text-sm">
                      {new Date(coupon.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </p>
                    <p className="text-sm">
                      {new Date(coupon.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Usage Limit
                    </p>
                    <p className="font-medium">
                      {coupon.usage_limit ? coupon.usage_limit : "Unlimited"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Per User Limit
                    </p>
                    <p className="font-medium">
                      {coupon.usage_limit_per_user
                        ? coupon.usage_limit_per_user
                        : "Unlimited"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Times Used
                    </p>
                    <p className="font-medium">{coupon.used_count}</p>
                    {coupon.usage_limit && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(usagePercentage, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {usagePercentage.toFixed(1)}% used
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Minimum Amount
                    </p>
                    <p className="font-medium">
                      {coupon.minimum_amount
                        ? formatCurrency(Number(coupon.minimum_amount))
                        : "No minimum"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Maximum Amount
                    </p>
                    <p className="font-medium">
                      {coupon.maximum_amount
                        ? formatCurrency(Number(coupon.maximum_amount))
                        : "No maximum"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders Using This Coupon</CardTitle>
            </CardHeader>
            <CardContent>
              {coupon.orders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Number</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupon.orders.map((order: any) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono font-medium">
                          {order.order_number}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.user.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(Number(order.total))}
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-muted-foreground">
                    No orders yet
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This coupon hasn't been used in any orders yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Validity Period
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Start Date
                  </p>
                  <p className="text-sm">
                    {coupon.starts_at
                      ? new Date(coupon.starts_at).toLocaleString()
                      : "Immediate"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Expiry Date
                  </p>
                  <p className="text-sm">
                    {coupon.expires_at
                      ? new Date(coupon.expires_at).toLocaleString()
                      : "Never expires"}
                  </p>
                </div>
                {coupon.expires_at && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Time Remaining
                    </p>
                    <p className="text-sm">
                      {new Date() > new Date(coupon.expires_at)
                        ? "Expired"
                        : `${Math.ceil(
                            (new Date(coupon.expires_at).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )} days`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
