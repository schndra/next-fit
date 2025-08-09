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
import { formatCurrency } from "@/lib/utils";
import {
  SerializedProduct,
  getProductStatus,
  getStockStatus,
  formatProductPrice,
} from "../utils/product-client.utils";
import { ProductActions } from "./product-actions";
import Image from "next/image";

export type ProductType = SerializedProduct;

export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const images = row.getValue("images") as ProductType["images"];
      const firstImage = images?.[0];

      return (
        <div className="flex items-center">
          {firstImage ? (
            <Image
              src={firstImage.url}
              alt={firstImage.alt || (row.getValue("title") as string)}
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const slug = row.original.slug;

      return (
        <div className="font-medium">
          <div className="truncate max-w-[200px]" title={title}>
            {title}
          </div>
          <div className="text-xs text-muted-foreground">/{slug}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as ProductType["category"];
      return <div className="text-sm">{category.title}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      const comparePrice = row.original.compare_price;

      const {
        price: formattedPrice,
        comparePrice: formattedComparePrice,
        discount,
      } = formatProductPrice(price, comparePrice);

      return (
        <div className="text-sm">
          <div className="font-medium">{formattedPrice}</div>
          {formattedComparePrice && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground line-through">
                {formattedComparePrice}
              </span>
              {discount && (
                <Badge variant="secondary" className="text-xs">
                  -{discount}%
                </Badge>
              )}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;
      const stockStatus = getStockStatus(
        product.track_quantity,
        product.quantity,
        product.low_stock_threshold
      );

      return <div className="text-sm">{stockStatus}</div>;
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => {
      const sku = row.getValue("sku") as string | null;
      return <div className="text-sm font-mono">{sku || "—"}</div>;
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const product = row.original;
      const statusLabel = getProductStatus(product.is_active);
      const statusClass = product.is_active
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";

      return <Badge className={statusClass}>{statusLabel}</Badge>;
    },
  },
  {
    accessorKey: "is_featured",
    header: "Featured",
    cell: ({ row }) => {
      const isFeatured = row.getValue("is_featured") as boolean;

      return (
        <Badge variant={isFeatured ? "default" : "secondary"}>
          {isFeatured ? "Featured" : "Regular"}
        </Badge>
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
      const date = row.getValue("created_at") as Date;
      return (
        <div className="text-sm">{new Date(date).toLocaleDateString()}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return <ProductActions product={product} />;
    },
  },
];
