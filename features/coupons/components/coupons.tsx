"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-display/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns, CouponType } from "./column";
import { getAllCoupons } from "../actions/coupons.actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Coupons = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const {
    data: coupons = [],
    isLoading,
    error,
  } = useQuery<CouponType[]>({
    queryKey: ["coupons"],
    queryFn: getAllCoupons,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter coupons based on search term and filters
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.user.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        coupon.is_active &&
        (!coupon.expires_at || new Date() <= coupon.expires_at)) ||
      (statusFilter === "inactive" && !coupon.is_active) ||
      (statusFilter === "expired" &&
        coupon.expires_at &&
        new Date() > coupon.expires_at);

    const matchesType = typeFilter === "all" || coupon.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">
            Error loading coupons
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
            <p className="text-muted-foreground">
              Manage your discount coupons and promotional codes
            </p>
          </div>
          <Button
            onClick={() => router.push("/admin/coupons/new")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Coupon
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Coupons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coupons.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Coupons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {
                  coupons.filter(
                    (c) =>
                      c.is_active &&
                      (!c.expires_at || new Date() <= c.expires_at)
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Expired Coupons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {
                  coupons.filter(
                    (c) => c.expires_at && new Date() > c.expires_at
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {coupons.reduce((sum, c) => sum + c.used_count, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Coupons</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search coupons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                  <SelectItem value="FREE_SHIPPING">Free Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">
                    Loading coupons...
                  </p>
                </div>
              </div>
            ) : (
              <DataTable columns={columns} data={filteredCoupons} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Coupons;
