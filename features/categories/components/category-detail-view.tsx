"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Calendar,
  Hash,
  ArrowUpDown,
  FolderOpen,
  Star,
  CheckCircle,
  XCircle,
  Eye,
  ExternalLink,
} from "lucide-react";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { CategoryType } from "./column";

interface CategoryDetailViewProps {
  category: CategoryType & {
    subcategoryCount: number;
    productCount: number;
    parent?: {
      id: string;
      title: string;
      slug: string;
    } | null;
    sub_categories: Array<{
      id: string;
      title: string;
      slug: string;
      is_active: boolean;
      created_at: Date;
    }>;
    products: Array<{
      id: string;
      title: string;
      slug: string;
      price: any;
      is_active: boolean;
      created_at: Date;
    }>;
  };
}

export function CategoryDetailView({ category }: CategoryDetailViewProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleGoBack = () => {
    router.push("/admin/categories");
  };

  const handleEdit = () => {
    router.push(`/admin/categories/${category.id}/edit`);
  };

  const handleDeleteSuccess = () => {
    setShowDeleteDialog(false);
    router.push("/admin/categories");
  };

  const canDelete =
    category.subcategoryCount === 0 && category.productCount === 0;

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Category Details
          </h1>
          <p className="text-muted-foreground">
            Detailed information about {category.title}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={!canDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {category.is_main_category ? (
                  <Star className="h-5 w-5 text-yellow-500" />
                ) : (
                  <FolderOpen className="h-5 w-5" />
                )}
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    Category Title
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {category.title}
                    </Badge>
                    {category.is_main_category && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-800"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Main
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    Slug
                  </div>
                  <p className="text-lg font-mono">/{category.slug}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort Order
                  </div>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {category.sort_order}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    Status
                  </div>
                  {category.is_active ? (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-800"
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Created
                  </div>
                  <p className="text-sm">
                    {category.created_at
                      ? new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(category.created_at))
                      : "N/A"}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Updated
                  </div>
                  <p className="text-sm">
                    {category.updated_at
                      ? new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(category.updated_at))
                      : "N/A"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Description</div>
                <p className="text-base leading-relaxed">{category.desc}</p>
              </div>

              {category.parent && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Parent Category
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        {category.parent.title}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/admin/categories/${category.parent?.id}`
                          )
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Subcategories */}
          {category.sub_categories && category.sub_categories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Subcategories</CardTitle>
                <CardDescription>
                  {category.subcategoryCount} subcategory(ies) under this
                  category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.sub_categories.map((subcat) => (
                    <div
                      key={subcat.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{subcat.title}</p>
                          <p className="text-sm text-muted-foreground">
                            /{subcat.slug}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {subcat.is_active ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 text-xs"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-800 text-xs"
                          >
                            Inactive
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/categories/${subcat.id}`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products */}
          {category.products && category.products.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Products in This Category</CardTitle>
                <CardDescription>
                  {category.productCount} product(s) assigned to this category
                  {category.products.length < category.productCount && (
                    <span className="text-muted-foreground">
                      {" "}
                      (showing latest {category.products.length})
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{product.title}</p>
                          <p className="text-sm text-muted-foreground">
                            /{product.slug}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          ${product.price}
                        </Badge>
                        {product.is_active ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 text-xs"
                          >
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-800 text-xs"
                          >
                            Inactive
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            router.push(`/admin/products/${product.id}`)
                          }
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Subcategories
                </span>
                <Badge variant="secondary">{category.subcategoryCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Products</span>
                <Badge variant="secondary">{category.productCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <Badge
                  variant={category.is_main_category ? "default" : "outline"}
                >
                  {category.is_main_category ? "Main Category" : "Subcategory"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant={category.is_active ? "secondary" : "destructive"}
                >
                  {category.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Category
              </Button>

              {category.subcategoryCount === 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    router.push(`/admin/categories/new?parent=${category.id}`)
                  }
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Add Subcategory
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  router.push(`/admin/products/new?category=${category.id}`)
                }
              >
                <Package className="mr-2 h-4 w-4" />
                Add Product
              </Button>

              {!canDelete && (
                <div className="text-xs text-muted-foreground mt-2 p-2 bg-yellow-50 rounded">
                  <strong>Note:</strong> This category cannot be deleted because
                  it has{" "}
                  {category.subcategoryCount > 0 &&
                    `${category.subcategoryCount} subcategory(ies)`}
                  {category.subcategoryCount > 0 &&
                    category.productCount > 0 &&
                    " and "}
                  {category.productCount > 0 &&
                    `${category.productCount} product(s)`}{" "}
                  assigned to it.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <DeleteCategoryDialog
          category={category}
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
}
