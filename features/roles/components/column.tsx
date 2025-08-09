import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  Shield,
  UserCheck,
  ArrowUpDown,
} from "lucide-react";

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
        <div className="flex items-center space-x-3">
          {getRoleIcon(role)}
          <div>
            <div className="font-medium">{role.name}</div>
            <div className="text-sm text-muted-foreground">
              ID: {role.id.slice(0, 8)}...
            </div>
          </div>
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

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Role
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Role
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
