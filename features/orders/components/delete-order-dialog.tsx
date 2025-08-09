"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderType } from "@/features/orders/schema/order.schemas";
import { formatCurrency } from "@/features/orders/utils/order.utils";

interface DeleteOrderDialogProps {
  order: OrderType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function DeleteOrderDialog({
  order,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteOrderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Order</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2">
              <p>
                Are you sure you want to delete order{" "}
                <strong>#{order.order_number}</strong>?
              </p>
              <div className="text-sm text-muted-foreground">
                <p>Customer: {order.user.name}</p>
                <p>Total: {formatCurrency(order.total)}</p>
                <p>Status: {order.status}</p>
              </div>
              <p className="text-destructive font-medium">
                This action cannot be undone. This will permanently delete the
                order and all associated data.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
