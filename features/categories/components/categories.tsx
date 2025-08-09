"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Download,
  FolderOpen,
  Package,
  Star,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/data-display/data-table";
import { getAllCategories } from "@/features/categories/actions/categories.actions";
import { columns, CategoryType } from "./column";
import { useRouter } from "next/navigation";

export default function Categories() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "main" | "sub">("all");

  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter categories based on search term and filters
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && category.is_active) ||
      (statusFilter === "inactive" && !category.is_active);

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "main" && category.is_main_category) ||
      (typeFilter === "sub" && !category.is_main_category);

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleCreateNew = () => {
    router.push("/admin/categories/new");
  };

  // Calculate stats
  const totalMainCategories = categories.filter(
    (cat) => cat.is_main_category
  ).length;
  const totalSubcategories = categories.filter(
    (cat) => !cat.is_main_category
  ).length;
  const activeCategories = categories.filter((cat) => cat.is_active).length;
  const totalProducts = categories.reduce(
    (sum, cat) => sum + (cat._count?.products || 0),
    0
  );

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600">Error loading categories</p>
              <Button onClick={handleRefresh} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage product categories and subcategories for your e-commerce
            store
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">All categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Main Categories
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMainCategories}</div>
            <p className="text-xs text-muted-foreground">
              Root level categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
            <Hash className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubcategories}</div>
            <p className="text-xs text-muted-foreground">Child categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCategories}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Total products assigned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find categories by title, description, or slug
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories by title, description, or slug..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Badge
                variant={statusFilter === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("all")}
              >
                All Status
              </Badge>
              <Badge
                variant={statusFilter === "active" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Badge>
              <Badge
                variant={statusFilter === "inactive" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setStatusFilter("inactive")}
              >
                Inactive
              </Badge>
            </div>

            <div className="flex gap-2">
              <Badge
                variant={typeFilter === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setTypeFilter("all")}
              >
                All Types
              </Badge>
              <Badge
                variant={typeFilter === "main" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setTypeFilter("main")}
              >
                Main
              </Badge>
              <Badge
                variant={typeFilter === "sub" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setTypeFilter("sub")}
              >
                Sub
              </Badge>
            </div>

            {(searchTerm || statusFilter !== "all" || typeFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
              >
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories ({filteredCategories.length})</CardTitle>
          <CardDescription>
            Manage your product categories and subcategories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredCategories} />
        </CardContent>
      </Card>
    </div>
  );
}
