"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CouponActions } from "./coupon-actions";
import { formatCurrency } from "@/lib/utils";
import { Coupon, User } from "@/app/generated/prisma";
import {
  formatCouponValue,
  getCouponStatus,
  getCouponTypeDisplay,
  SerializedCoupon,
} from "../utils/coupon.utils";

export type CouponType = SerializedCoupon & {
  user: Pick<User, "id" | "name" | "email">;
  _count: {
    orders: number;
  };
};

export const columns: ColumnDef<CouponType>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const code = row.getValue("code") as string;
      return <div className="font-mono font-medium">{code}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("type") as
        | "PERCENTAGE"
        | "FIXED_AMOUNT"
        | "FREE_SHIPPING";

      const typeConfig = {
        PERCENTAGE: {
          label: "Percentage",
          className: "bg-blue-100 text-blue-800",
        },
        FIXED_AMOUNT: {
          label: "Fixed Amount",
          className: "bg-green-100 text-green-800",
        },
        FREE_SHIPPING: {
          label: "Free Shipping",
          className: "bg-purple-100 text-purple-800",
        },
      };

      const config = typeConfig[type];

      return (
        <Badge variant="secondary" className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const coupon = row.original;
      return <div className="font-medium">{formatCouponValue(coupon)}</div>;
    },
  },
  {
    accessorKey: "used_count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Usage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const usedCount = row.getValue("used_count") as number;
      const usageLimit = row.original.usage_limit;

      return (
        <div className="text-center">
          {usedCount}
          {usageLimit ? ` / ${usageLimit}` : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const coupon = row.original;
      const { label, className } = getCouponStatus(coupon);

      return (
        <Badge variant="secondary" className={className}>
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "expires_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Expires
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const expiresAt = row.getValue("expires_at") as Date | null;

      if (!expiresAt) {
        return <div className="text-muted-foreground">Never</div>;
      }

      return (
        <div className="text-sm">
          {new Date(expiresAt).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as Date;
      return (
        <div className="text-sm text-muted-foreground">
          {new Date(createdAt).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const coupon = row.original;

      return <CouponActions coupon={coupon} />;
    },
  },
];
