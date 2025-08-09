"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { UserType } from "@/features/users/schema/user.schemas";
import {
  formatDate,
  getFullName,
  getUserInitials,
  getVerificationStatusBadge,
  getUserRoleNames,
  getUserActivitySummary,
} from "@/features/users/utils/user.utils";
import { UserActions } from "./user-actions";

export { type UserType };

export const columns: ColumnDef<UserType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-medium"
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      const fullName = getFullName(user);
      const initials = getUserInitials(user);

      return (
        <Link
          href={`/admin/users/${user.id}`}
          className="flex items-center gap-3 hover:underline"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || undefined} alt={fullName} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-blue-600 hover:text-blue-800">
              {fullName}
            </div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </Link>
      );
    },
    sortingFn: (rowA, rowB) => {
      const nameA = getFullName(rowA.original);
      const nameB = getFullName(rowB.original);
      return nameA.localeCompare(nameB);
    },
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const user = row.original;
      const roleNames = getUserRoleNames(user);

      if (roleNames === "No roles") {
        return <span className="text-muted-foreground text-sm">No roles</span>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role) => (
            <Badge key={role.id} variant="secondary" className="text-xs">
              {role.name}
            </Badge>
          ))}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "email_verified",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-medium"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const emailVerified = row.getValue("email_verified") as Date | null;
      const badge = getVerificationStatusBadge(emailVerified);
      return <Badge className={badge.className}>{badge.label}</Badge>;
    },
    sortingFn: (rowA, rowB) => {
      const aVerified = rowA.getValue("email_verified") as Date | null;
      const bVerified = rowB.getValue("email_verified") as Date | null;
      if (aVerified && !bVerified) return -1;
      if (!aVerified && bVerified) return 1;
      return 0;
    },
  },
  {
    id: "activity",
    header: "Activity",
    cell: ({ row }) => {
      const user = row.original;
      const activitySummary = getUserActivitySummary(user);
      return <div className="text-sm">{activitySummary}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 font-medium"
        >
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("created_at") as Date;
      return <div className="text-sm">{formatDate(date)}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <UserActions user={user} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
