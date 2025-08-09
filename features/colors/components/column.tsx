import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Package, ArrowUpDown, Eye } from "lucide-react";
import { ColorActions } from "./color-actions";
import { ColorType } from "../actions/colors.actions";

export type { ColorType };

const getColorIcon = () => {
  return <Palette className="h-4 w-4" />;
};

const getStatusColor = (color: ColorType) => {
  // Color based on sort order or color properties
  if (color.sort_order <= 10) return "bg-blue-100 text-blue-800";
  if (color.sort_order <= 20) return "bg-purple-100 text-purple-800";
  return "bg-green-100 text-green-800";
};

export const columns: ColumnDef<ColorType>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const color = row.original;
      return (
        <div className="font-mono text-xs text-muted-foreground">
          {color.id}
        </div>
      );
    },
    meta: {
      className: "min-w-[200px]",
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Color Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const color = row.original;
      return (
        <div className="flex items-center gap-3">
          <div
            className="h-6 w-6 rounded-full border-2 border-gray-300 shadow-sm"
            style={{ backgroundColor: color.value }}
            title={color.value}
          />
          <div className="flex flex-col">
            <span className="font-mono text-sm">{color.value}</span>
          </div>
        </div>
      );
    },
    meta: {
      className: "min-w-[150px]",
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Color Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const color = row.original;
      return (
        <div className="flex items-center gap-2">
          {getColorIcon()}
          <span className="font-medium">{color.name}</span>
        </div>
      );
    },
    meta: {
      className: "min-w-[200px]",
    },
  },
  {
    accessorKey: "sort_order",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Sort Order
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const color = row.original;
      return (
        <Badge variant="outline" className={getStatusColor(color)}>
          {color.sort_order}
        </Badge>
      );
    },
    meta: {
      className: "min-w-[120px]",
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const color = row.original;
      return (
        <div className="text-sm text-muted-foreground">
          {color.created_at
            ? new Date(color.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </div>
      );
    },
    meta: {
      className: "min-w-[120px]",
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const color = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link href={`/admin/colors/${color.id}`} passHref>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
              <span className="sr-only">View color details</span>
            </Button>
          </Link>
          <ColorActions color={color} />
        </div>
      );
    },
    meta: {
      className: "min-w-[100px]",
    },
  },
];
