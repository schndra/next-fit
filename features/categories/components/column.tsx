import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FolderOpen,
  Package,
  ArrowUpDown,
  Eye,
  Star,
  Hash,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { CategoryActions } from "./category-actions";

export type CategoryType = {
  id: string;
  title: string;
  desc: string;
  img?: string | null;
  slug: string;
  parent_id?: string | null;
  is_main_category: boolean;
  is_active: boolean;
  sort_order: number;
  created_at?: Date;
  updated_at?: Date;
  parent?: {
    id: string;
    title: string;
  } | null;
  _count?: {
    sub_categories: number;
    products: number;
  };
};

const getCategoryIcon = (category: CategoryType) => {
  if (category.is_main_category) {
    return <Star className="h-4 w-4 text-yellow-500" />;
  }
  return <FolderOpen className="h-4 w-4" />;
};

const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-red-100 text-red-800">
      <XCircle className="h-3 w-3 mr-1" />
      Inactive
    </Badge>
  );
};

const getCategoryTypeBadge = (category: CategoryType) => {
  if (category.is_main_category) {
    return (
      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
        <Star className="h-3 w-3 mr-1" />
        Main
      </Badge>
    );
  }
  return (
    <Badge variant="outline">
      <Hash className="h-3 w-3 mr-1" />
      Sub
    </Badge>
  );
};

export const columns: ColumnDef<CategoryType>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="font-mono text-xs text-muted-foreground">
          {category.id}
        </div>
      );
    },
    meta: {
      className: "min-w-[200px] max-w-[200px]",
    },
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(category)}
            <div className="flex flex-col">
              <span className="font-medium">{category.title}</span>
              <span className="text-xs text-muted-foreground">
                /{category.slug}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getCategoryTypeBadge(category)}
            {getStatusBadge(category.is_active)}
          </div>
        </div>
      );
    },
    meta: {
      className: "min-w-[250px]",
    },
  },
  {
    accessorKey: "desc",
    header: "Description",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="max-w-[300px]">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {category.desc}
          </p>
        </div>
      );
    },
    meta: {
      className: "min-w-[250px]",
    },
  },
  {
    accessorKey: "parent",
    header: "Parent Category",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="text-sm">
          {category.parent ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {category.parent.title}
            </Badge>
          ) : (
            <span className="text-muted-foreground">Root Category</span>
          )}
        </div>
      );
    },
    meta: {
      className: "min-w-[120px]",
    },
  },
  {
    accessorKey: "statistics",
    header: "Statistics",
    cell: ({ row }) => {
      const category = row.original;
      const subcategoryCount = category._count?.sub_categories || 0;
      const productCount = category._count?.products || 0;

      return (
        <div className="space-y-1">
          <div className="flex items-center space-x-1 text-xs">
            <FolderOpen className="h-3 w-3 text-blue-500" />
            <span className="text-muted-foreground">Subcategories:</span>
            <span className="font-medium">{subcategoryCount}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <Package className="h-3 w-3 text-green-500" />
            <span className="text-muted-foreground">Products:</span>
            <span className="font-medium">{productCount}</span>
          </div>
        </div>
      );
    },
    meta: {
      className: "min-w-[140px]",
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
          Order
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.original;
      return (
        <Badge variant="outline" className="font-mono">
          {category.sort_order}
        </Badge>
      );
    },
    meta: {
      className: "min-w-[80px]",
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
          <Calendar className="mr-2 h-4 w-4" />
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category = row.original;
      if (!category.created_at)
        return <span className="text-muted-foreground">-</span>;

      return (
        <div className="text-sm text-muted-foreground">
          {new Date(category.created_at).toLocaleDateString()}
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
      const category = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/admin/categories/${category.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <CategoryActions category={category} />
        </div>
      );
    },
    meta: {
      className:
        "sticky right-0 bg-background border-l shadow-lg min-w-[100px] z-10",
    },
    enableSorting: false,
    enableHiding: false,
  },
];
