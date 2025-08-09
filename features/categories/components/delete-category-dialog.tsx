"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  AlertTriangle,
  FolderOpen,
  Package,
  Star,
} from "lucide-react";
import { deleteCategory } from "@/features/categories/actions/categories.actions";
import { CategoryType } from "./column";

interface DeleteCategoryDialogProps {
  category: CategoryType;
  open: boolean;
  onClose: () => void;
}

export function DeleteCategoryDialog({
  category,
  open,
  onClose,
}: DeleteCategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const result = await deleteCategory(category.id);

      if (result.success) {
        toast.success(result.message);

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["category", category.id] });
        queryClient.invalidateQueries({ queryKey: ["main-categories"] });

        onClose();

        // Redirect to categories list
        router.push("/admin/categories");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Category
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            category and remove it from the system. Make sure no products or
            subcategories are using this category.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Category:</span>
              <Badge variant="secondary" className="flex items-center gap-1">
                {category.is_main_category ? (
                  <Star className="h-3 w-3" />
                ) : (
                  <FolderOpen className="h-3 w-3" />
                )}
                {category.title}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Slug:</span>
              <span className="text-sm text-muted-foreground font-mono">
                /{category.slug}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Type:</span>
              <Badge
                variant={category.is_main_category ? "default" : "outline"}
              >
                {category.is_main_category ? "Main Category" : "Subcategory"}
              </Badge>
            </div>

            {category.parent && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Parent:</span>
                <Badge variant="outline">{category.parent.title}</Badge>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Badge variant={category.is_active ? "secondary" : "destructive"}>
                {category.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          {(category._count?.sub_categories || category._count?.products) && (
            <div className="border-t pt-3 space-y-2">
              <div className="text-sm font-medium text-destructive">
                Warning:
              </div>
              {category._count.sub_categories > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <FolderOpen className="h-4 w-4 text-orange-500" />
                  <span>
                    {category._count.sub_categories} subcategory(ies) using this
                    as parent
                  </span>
                </div>
              )}
              {category._count.products > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-blue-500" />
                  <span>
                    {category._count.products} product(s) assigned to this
                    category
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
