"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CalendarIcon,
  UserIcon,
  UsersIcon,
  Edit,
  Trash2,
  Users,
} from "lucide-react";
import { getRoleDetails } from "../actions/roles.actions";
import { format } from "date-fns";
import { useState } from "react";
import { EditRoleDialog } from "./edit-role-dialog";
import { DeleteRoleDialog } from "./delete-role-dialog";
import { RoleType } from "./column";

interface RoleDetailViewProps {
  roleId: string;
}

export function RoleDetailView({ roleId }: RoleDetailViewProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    data: roleDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["role-details", roleId],
    queryFn: () => getRoleDetails(roleId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !roleDetails) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg font-semibold mb-2">
            {error ? "Error Loading Role" : "Role Not Found"}
          </div>
          <p className="text-gray-600 mb-4">
            {error
              ? "Failed to load role details. Please try again."
              : "The requested role could not be found."}
          </p>
          <Button onClick={() => router.push("/admin/roles")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roles
          </Button>
        </div>
      </div>
    );
  }

  // Convert to RoleType for dialogs
  const roleForDialogs: RoleType = {
    id: roleDetails.id,
    name: roleDetails.name,
    description: roleDetails.description,
    created_at: roleDetails.created_at,
    updated_at: roleDetails.updated_at,
  };

  return (
    <>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/roles")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Roles
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{roleDetails.name}</h1>
              <p className="text-gray-600">Role Details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Role
            </Button>
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {roleDetails.userCount}
              </div>
              <p className="text-xs text-muted-foreground">
                Users assigned to this role
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New This Month
              </CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {
                  roleDetails.users.filter(
                    (user) =>
                      new Date(user.created_at) >
                      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Users joined this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Badge
                variant="secondary"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Active
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {
                  roleDetails.users.filter(
                    (user) =>
                      new Date(user.created_at) >
                      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Users joined this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Role Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Role Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Role Name
                  </label>
                  <p className="text-lg font-semibold">{roleDetails.name}</p>
                </div>

                {roleDetails.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Description
                    </label>
                    <p className="text-gray-700 mt-1 p-3 bg-gray-50 rounded-md">
                      {roleDetails.description}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Created Date
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <p>{format(new Date(roleDetails.created_at), "PPP")}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Last Updated
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(new Date(roleDetails.updated_at), "PPP 'at' p")}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Role ID
                  </label>
                  <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                    {roleDetails.id}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assigned Users */}
          <div className="lg:col-span-2">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5" />
                  Assigned Users ({roleDetails.userCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {roleDetails.users.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <UsersIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">
                      No users assigned
                    </p>
                    <p className="text-sm">
                      This role doesn't have any users assigned yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {roleDetails.users.map((user, index) => (
                      <div key={user.id}>
                        <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                              {user.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {user.name || "Unnamed User"}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="text-right text-xs text-gray-400">
                            <p>Joined</p>
                            <p>
                              {format(
                                new Date(user.created_at),
                                "MMM dd, yyyy"
                              )}
                            </p>
                          </div>
                        </div>
                        {index < roleDetails.users.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <EditRoleDialog
        role={roleForDialogs}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteRoleDialog
        role={roleForDialogs}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        redirectAfterDelete={true}
      />
    </>
  );
}
