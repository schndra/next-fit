import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ruler, Package, ArrowUpDown, Eye } from "lucide-react";
import { SizeActions } from "./size-actions";

export type SizeType = {
  id: string;
  value: string;
  name: string;
  sort_order: number;
  created_at?: Date;
  updated_at?: Date;
};

const getSizeIcon = () => {
  return <Ruler className="h-4 w-4" />;
};

const getStatusColor = (size: SizeType) => {
  // Color based on sort order or size value
  if (
    size.value.toLowerCase().includes("xs") ||
    size.value.toLowerCase().includes("small")
  )
    return "bg-blue-100 text-blue-800";
  if (
    size.value.toLowerCase().includes("xl") ||
    size.value.toLowerCase().includes("large")
  )
    return "bg-purple-100 text-purple-800";
  return "bg-green-100 text-green-800";
};

export const columns: ColumnDef<SizeType>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const size = row.original;
      return (
        <div className="font-mono text-xs text-muted-foreground">{size.id}</div>
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
          className="h-auto p-0 font-medium"
        >
          Size Value
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const size = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
            {getSizeIcon()}
          </div>
          <span className="font-medium">{size.value}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.getValue("name")}</span>
            <Badge variant="secondary" className={getStatusColor(row.original)}>
              {row.original.value.toUpperCase()}
            </Badge>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "sort_order",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Sort Order
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <Badge variant="outline">{row.getValue("sort_order")}</Badge>
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
          className="h-auto p-0 font-medium"
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date;
      return (
        <div className="text-sm text-muted-foreground">
          {date
            ? new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              }).format(new Date(date))
            : "N/A"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const size = row.original;
      return (
        <div className="flex items-center justify-center">
          <SizeActions size={size} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    meta: {
      className:
        "sticky right-0 bg-background border-l shadow-lg min-w-[100px] z-10",
    },
  },
];
