"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAllUsers,
  getAllRoles,
} from "@/features/users/actions/users.actions";
import { DataTable } from "@/components/data-display/data-table";
import { userColumns } from "@/features/users/components/user-table-columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX, Crown } from "lucide-react";
import { GetUsersParams } from "@/features/users/schema/user.schemas";

export function UsersPageClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const queryParams: GetUsersParams = useMemo(() => {
    const params: GetUsersParams = {};

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (selectedRole !== "all") {
      params.role_id = selectedRole;
    }

    if (selectedStatus !== "all") {
      params.email_verified = selectedStatus === "verified";
    }

    return params;
  }, [searchTerm, selectedRole, selectedStatus]);

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => getAllUsers(queryParams),
    staleTime: 5 * 60 * 1000,
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
    staleTime: 10 * 60 * 1000,
  });

  const totalUsers = users.length;

  // Calculate statistics
  const stats = useMemo(() => {
    if (!users.length)
      return { total: 0, verified: 0, unverified: 0, admins: 0 };

    const verified = users.filter((user) => user.email_verified).length;
    const unverified = users.filter((user) => !user.email_verified).length;
    const admins = users.filter((user) =>
      user.roles?.some((role) => role.name.toLowerCase().includes("admin"))
    ).length;

    return {
      total: totalUsers,
      verified,
      unverified,
      admins,
    };
  }, [users, totalUsers]);

  if (usersError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Error loading users. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Users
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verified}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unverified Users
            </CardTitle>
            <UserX className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unverified}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Crown className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {searchTerm && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSearchTerm("")}
              >
                Search: {searchTerm} ×
              </Badge>
            )}
            {selectedRole !== "all" && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedRole("all")}
              >
                Role: {roles.find((r) => r.id === selectedRole)?.name} ×
              </Badge>
            )}
            {selectedStatus !== "all" && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setSelectedStatus("all")}
              >
                Status: {selectedStatus} ×
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({stats.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={userColumns}
            data={users}
            searchValue={searchTerm}
          />
        </CardContent>
      </Card>
    </div>
  );
}
