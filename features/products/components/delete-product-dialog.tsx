"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../actions/products.actions";
import { SerializedProduct } from "../utils/product-client.utils";

interface DeleteProductDialogProps {
  product: SerializedProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteProductDialog = ({
  product,
  open,
  onOpenChange,
}: DeleteProductDialogProps) => {
  const queryClient = useQueryClient();

  const { mutate: deleteProductMutation, isPending } = useMutation({
    mutationFn: () => deleteProduct(product.id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Product deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["products"] });
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      toast.error("An unexpected error occurred");
    },
  });

  const handleDelete = () => {
    deleteProductMutation();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{product.title}&quot;? This
            action cannot be undone and will permanently remove the product and
            all its associated data including images, reviews, and order
            history.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
