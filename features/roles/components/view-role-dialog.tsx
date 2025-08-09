"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, UserIcon, UsersIcon } from "lucide-react";
import { getRoleDetails } from "../actions/roles.actions";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface ViewRoleDialogProps {
  roleId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewRoleDialog({
  roleId,
  open,
  onOpenChange,
}: ViewRoleDialogProps) {
  const {
    data: roleDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["role-details", roleId],
    queryFn: () => getRoleDetails(roleId),
    enabled: open && !!roleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Error Loading Role</DialogTitle>
          </DialogHeader>
          <div className="text-center text-red-500 py-8">
            Failed to load role details. Please try again.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Loading Role Details...</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!roleDetails) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Role Not Found</DialogTitle>
          </DialogHeader>
          <div className="text-center text-gray-500 py-8">
            The requested role could not be found.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Role Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Role Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Role Name
                  </label>
                  <p className="text-lg font-semibold">{roleDetails.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Created Date
                  </label>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <p>{format(new Date(roleDetails.created_at), "PPP")}</p>
                  </div>
                </div>
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
                  Status
                </label>
                <div className="mt-1">
                  <Badge
                    variant="secondary"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Users Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {roleDetails.userCount}
                  </div>
                  <div className="text-sm text-blue-600">Total Users</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      roleDetails.users.filter(
                        (user) =>
                          new Date(user.created_at) >
                          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                      ).length
                    }
                  </div>
                  <div className="text-sm text-green-600">New This Month</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      roleDetails.users.filter(
                        (user) =>
                          new Date(user.created_at) >
                          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                      ).length
                    }
                  </div>
                  <div className="text-sm text-purple-600">New This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Assigned Users ({roleDetails.userCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {roleDetails.users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UsersIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No users assigned to this role yet.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {roleDetails.users.map((user, index) => (
                    <div key={user.id}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
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
                        <div className="text-xs text-gray-400">
                          Joined{" "}
                          {format(new Date(user.created_at), "MMM dd, yyyy")}
                        </div>
                      </div>
                      {index < roleDetails.users.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-gray-500">Role ID</label>
                  <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                    {roleDetails.id}
                  </p>
                </div>
                <div>
                  <label className="font-medium text-gray-500">
                    Last Updated
                  </label>
                  <p className="mt-1">
                    {format(new Date(roleDetails.updated_at), "PPP 'at' p")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
