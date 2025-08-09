"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, Package, RefreshCw } from "lucide-react";
import Link from "next/link";
import { OrderType } from "@/features/orders/schema/order.schemas";
import {
  updateOrder,
  deleteOrder,
} from "@/features/orders/actions/orders.actions";
import { DeleteOrderDialog } from "@/features/orders/components/delete-order-dialog";
import {
  canCancelOrder,
  canRefundOrder,
} from "@/features/orders/utils/order.utils";

interface OrderActionsProps {
  order: OrderType;
}

export function OrderActions({ order }: OrderActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateOrderMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["order", order.id] });
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      console.error("Update order error:", error);
      toast.error("Failed to update order. Please try again.");
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        setShowDeleteDialog(false);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      console.error("Delete order error:", error);
      toast.error("Failed to delete order. Please try again.");
    },
  });

  const handleUpdateStatus = (status: OrderType["status"]) => {
    updateOrderMutation.mutate({
      id: order.id,
      data: { status },
    });
  };

  const handleUpdatePaymentStatus = (
    payment_status: OrderType["payment_status"]
  ) => {
    updateOrderMutation.mutate({
      id: order.id,
      data: { payment_status },
    });
  };

  const handleDeleteOrder = () => {
    deleteOrderMutation.mutate({ id: order.id });
  };

  return (
    <>
      <DropdownMenuItem asChild>
        <Link href={`/admin/orders/${order.id}`}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Order
        </Link>
      </DropdownMenuItem>

      {order.status === "CONFIRMED" && (
        <DropdownMenuItem onClick={() => handleUpdateStatus("PROCESSING")}>
          <Package className="mr-2 h-4 w-4" />
          Mark as Processing
        </DropdownMenuItem>
      )}

      {order.status === "PROCESSING" && (
        <DropdownMenuItem onClick={() => handleUpdateStatus("SHIPPED")}>
          <Package className="mr-2 h-4 w-4" />
          Mark as Shipped
        </DropdownMenuItem>
      )}

      {order.status === "SHIPPED" && (
        <DropdownMenuItem onClick={() => handleUpdateStatus("DELIVERED")}>
          <Package className="mr-2 h-4 w-4" />
          Mark as Delivered
        </DropdownMenuItem>
      )}

      {canCancelOrder(order) && (
        <DropdownMenuItem
          onClick={() => handleUpdateStatus("CANCELLED")}
          className="text-red-600"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Cancel Order
        </DropdownMenuItem>
      )}

      {canRefundOrder(order) && (
        <DropdownMenuItem
          onClick={() => handleUpdatePaymentStatus("REFUNDED")}
          className="text-orange-600"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refund Order
        </DropdownMenuItem>
      )}

      <DropdownMenuSeparator />

      <DropdownMenuItem
        onClick={() => setShowDeleteDialog(true)}
        className="text-red-600"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Order
      </DropdownMenuItem>

      <DeleteOrderDialog
        order={order}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteOrder}
        isLoading={deleteOrderMutation.isPending}
      />
    </>
  );
}
