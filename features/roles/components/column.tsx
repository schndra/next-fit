import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, UserCheck, ArrowUpDown, Eye } from "lucide-react";
import { RoleActions } from "./role-actions";
import Link from "next/link";

export type RoleType = {
  id: string;
  name: string;
  description?: string | null;
  created_at?: Date;
  updated_at?: Date;
};

const getRoleIcon = (role: RoleType) => {
  if (role.name.toLowerCase().includes("admin"))
    return <Shield className="h-4 w-4" />;
  if (role.name.toLowerCase().includes("user"))
    return <UserCheck className="h-4 w-4" />;
  return <Users className="h-4 w-4" />;
};

const getStatusColor = (role: RoleType) => {
  if (role.name.toLowerCase().includes("admin"))
    return "bg-red-100 text-red-800";
  if (role.name.toLowerCase().includes("user"))
    return "bg-green-100 text-green-800";
  return "bg-blue-100 text-blue-800";
};

const getRoleType = (role: RoleType) => {
  if (role.name.toLowerCase().includes("admin")) return "Admin";
  if (role.name.toLowerCase().includes("user")) return "User";
  return "Custom";
};

export const columns: ColumnDef<RoleType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-medium"
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.original;
      return (
        <div className="flex items-center justify-between space-x-3">
          <Link
            href={`/admin/roles/${role.id}`}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            {getRoleIcon(role)}
            <div>
              <div className="font-medium text-blue-600 hover:text-blue-800">
                {role.name}
              </div>
              <div className="text-sm text-muted-foreground">
                ID: {role.id.slice(0, 8)}...
              </div>
            </div>
          </Link>
          <Link href={`/admin/roles/${role.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return <div className="max-w-xs">{description || "No description"}</div>;
    },
  },
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => {
      const role = row.original;
      return (
        <Badge className={getStatusColor(role)}>{getRoleType(role)}</Badge>
      );
    },
  },
  // {
  //   id: "permissions",
  //   header: "Permissions",
  //   cell: () => {
  //     return (
  //       <span className="text-sm text-muted-foreground">View permissions</span>
  //     );
  //   },
  // },
  {
    id: "users",
    header: "Users",
    cell: () => {
      return <span className="text-sm">0 users</span>;
    },
  },
  // {
  //   id: "status",
  //   header: "Status",
  //   cell: () => {
  //     return (
  //       <Badge variant="outline" className="text-green-600 border-green-600">
  //         Active
  //       </Badge>
  //     );
  //   },
  // },
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
      if (!date) return "-";
      return (
        <div className="text-sm">{new Date(date).toLocaleDateString()}</div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => {
      const role = row.original;
      return <RoleActions role={role} />;
    },
  },
];
