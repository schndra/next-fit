"use client";

import { useState } from "react";
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
import { Trash2, Loader2 } from "lucide-react";
import { CouponType } from "./column";
import { deleteCoupon } from "../actions/coupons.actions";
import { toast } from "sonner";

interface DeleteCouponDialogProps {
  coupon: CouponType;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteCouponDialog = ({
  coupon,
  isOpen,
  onClose,
}: DeleteCouponDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const result = await deleteCoupon({ id: coupon.id });

      if (result.success) {
        toast.success("Coupon deleted successfully");
        onClose();
      } else {
        toast.error(result.error || "Failed to delete coupon");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Coupon
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this coupon? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Code:</span>
              <Badge variant="outline" className="font-mono">
                {coupon.code}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Type:</span>
              <span className="text-sm text-muted-foreground">
                {coupon.type === "PERCENTAGE" && "Percentage"}
                {coupon.type === "FIXED_AMOUNT" && "Fixed Amount"}
                {coupon.type === "FREE_SHIPPING" && "Free Shipping"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Usage:</span>
              <span className="text-sm text-muted-foreground">
                {coupon.used_count} times
              </span>
            </div>
            {coupon._count.orders > 0 && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  ⚠️ This coupon has been used in {coupon._count.orders}{" "}
                  order(s). Deletion will fail if there are active orders.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Coupon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
