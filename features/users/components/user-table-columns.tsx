"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserType } from "@/features/users/schema/user.schemas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpDown, Eye, MoreHorizontal } from "lucide-react";
import { formatDate } from "@/features/users/utils/user.utils";
import Link from "next/link";
import { UserActions } from "./user-actions";

export const userColumns: ColumnDef<UserType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ""} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const user = row.original;
      if (!user.roles || user.roles.length === 0) {
        return <Badge variant="outline">No roles</Badge>;
      }

      return (
        <div className="flex flex-wrap gap-1">
          {user.roles.slice(0, 2).map((role) => (
            <Badge key={role.id} variant="secondary" className="text-xs">
              {role.name}
            </Badge>
          ))}
          {user.roles.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{user.roles.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "email_verified",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      const isVerified = user.email_verified;

      return (
        <Badge variant={isVerified ? "default" : "destructive"}>
          {isVerified ? "Verified" : "Unverified"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "_count",
    header: "Activity",
    cell: ({ row }) => {
      const user = row.original;
      const counts = user._count;

      return (
        <div className="text-sm text-muted-foreground">
          <div>{counts.orders} orders</div>
          <div>{counts.reviews} reviews</div>
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
          className="hover:bg-transparent"
        >
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return <div className="text-sm">{formatDate(user.created_at)}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link href={`/admin/users/${user.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <UserActions user={user} />
        </div>
      );
    },
    meta: {
      className: "w-[100px]",
    },
  },
];
