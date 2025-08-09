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
} from "lucide-react";
import { EditSizeDialog } from "./edit-size-dialog";
import { DeleteSizeDialog } from "./delete-size-dialog";
import { SizeType } from "./column";

interface SizeDetailViewProps {
  size: SizeType & {
    productCount: number;
    products: Array<{
      id: string;
      title: string;
      slug: string;
      created_at: Date;
    }>;
  };
}

export function SizeDetailView({ size }: SizeDetailViewProps) {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleGoBack = () => {
    router.push("/admin/sizes");
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    router.refresh(); // Refresh the page to get updated data
  };

  const handleDeleteSuccess = () => {
    setShowDeleteDialog(false);
    router.push("/admin/sizes");
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sizes
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Size Details</h1>
          <p className="text-muted-foreground">
            Detailed information about {size.value} ({size.name})
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={size.productCount > 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Basic Information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    Size Value
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {size.value}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    Size Name
                  </div>
                  <p className="text-lg font-medium">{size.name}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort Order
                  </div>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {size.sort_order}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Created
                  </div>
                  <p className="text-sm">
                    {size.created_at
                      ? new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(size.created_at))
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Using This Size */}
          <Card>
            <CardHeader>
              <CardTitle>Products Using This Size</CardTitle>
              <CardDescription>
                {size.productCount} product(s) are using this size
              </CardDescription>
            </CardHeader>
            <CardContent>
              {size.products && size.products.length > 0 ? (
                <div className="space-y-3">
                  {size.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{product.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.slug}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        }).format(new Date(product.created_at))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No products are using this size yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Products Using
                  </span>
                  <Badge variant="secondary">{size.productCount}</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Sort Position
                  </span>
                  <Badge variant="outline">{size.sort_order}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Size
              </Button>
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => setShowDeleteDialog(true)}
                disabled={size.productCount > 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Size
              </Button>
              {size.productCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  Cannot delete size that is being used by products
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      {showEditDialog && (
        <EditSizeDialog
          size={size}
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
        />
      )}

      {showDeleteDialog && (
        <DeleteSizeDialog
          size={size}
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
}
