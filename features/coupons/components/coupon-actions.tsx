"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteCouponDialog } from "./delete-coupon-dialog";
import { CouponType } from "./column";
import { toast } from "sonner";

interface CouponActionsProps {
  coupon: CouponType;
}

export const CouponActions = ({ coupon }: CouponActionsProps) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Coupon code copied to clipboard");
  };

  const onView = () => {
    router.push(`/admin/coupons/${coupon.id}`);
  };

  const onEdit = () => {
    router.push(`/admin/coupons/${coupon.id}?mode=edit`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(coupon.code)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy code
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit coupon
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete coupon
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteCouponDialog
        coupon={coupon}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
};
