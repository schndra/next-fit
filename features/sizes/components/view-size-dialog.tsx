"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Calendar,
  Hash,
  Edit,
  Trash2,
  Loader2,
  ArrowUpDown,
} from "lucide-react";
import { getSizeDetails } from "@/features/sizes/actions/sizes.actions";
import { SizeType } from "./column";

interface ViewSizeDialogProps {
  sizeId: string;
  open: boolean;
  onClose: () => void;
  onEdit?: (size: SizeType) => void;
  onDelete?: (size: SizeType) => void;
}

interface SizeDetails extends SizeType {
  productCount: number;
  products: Array<{
    id: string;
    title: string;
    slug: string;
    created_at: Date;
  }>;
}

export function ViewSizeDialog({
  sizeId,
  open,
  onClose,
  onEdit,
  onDelete,
}: ViewSizeDialogProps) {
  const [size, setSize] = useState<SizeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open && sizeId) {
      loadSizeDetails();
    }
  }, [open, sizeId]);

  const loadSizeDetails = async () => {
    try {
      setIsLoading(true);
      const data = await getSizeDetails(sizeId);
      setSize(data);
    } catch (error) {
      console.error("Error loading size details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Loading Size Details</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!size) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Size Not Found</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Size not found</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Size Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about this size and its usage.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  Size Value
                </div>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {size.value}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  Size Name
                </div>
                <p className="font-medium">{size.name}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort Order
                </div>
                <Badge variant="outline">{size.sort_order}</Badge>
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
          </div>

          <Separator />

          {/* Usage Statistics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Usage Statistics</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Products using this size
                    </p>
                    <p className="text-2xl font-bold">{size.productCount}</p>
                  </div>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* Products List */}
          {size.products && size.products.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Products ({size.products.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {size.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-lg border p-3"
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
              </div>
            </>
          )}

          {/* Actions */}
          <Separator />
          <div className="flex justify-end gap-3">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(size)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                onClick={() => onDelete(size)}
                disabled={size.productCount > 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
