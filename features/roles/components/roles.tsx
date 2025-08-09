"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Users,
  Shield,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAllRoles } from "../actions/roles.actions";
import { RoleType, columns } from "./column";
import { DataTable } from "../../../components/data-display/data-table";

const Roles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Use React Query to fetch roles data with prefetching support
  const {
    data: roles = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<RoleType[]>({
    queryKey: ["roles"],
    queryFn: getAllRoles,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const filteredRoles = roles; // Let DataTable handle the filtering

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isFetching}
            size="sm"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{roles.length}</div>
                <p className="text-xs text-muted-foreground">System roles</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {
                    roles.filter((role: RoleType) =>
                      role.name.toLowerCase().includes("admin")
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Administrative access
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Roles</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {
                    roles.filter((role: RoleType) =>
                      role.name.toLowerCase().includes("user")
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Standard access</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Roles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {
                    roles.filter(
                      (role: RoleType) =>
                        !role.name.toLowerCase().includes("admin") &&
                        !role.name.toLowerCase().includes("user")
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Custom permissions
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      {isError ? (
        <Card className="border-red-200">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-700 mb-2">
                Failed to load roles
              </h3>
              <p className="text-red-600 mb-4">
                {(error as Error)?.message || "An unexpected error occurred"}
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Role Management</CardTitle>
            <CardDescription>
              View and manage all user roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search roles by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button variant="outline" disabled={isLoading}>
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Roles Table */}
            {isLoading ? (
              <div className="rounded-md border">
                <div className="h-24 flex items-center justify-center">
                  Loading roles...
                </div>
              </div>
            ) : isError ? (
              <div className="rounded-md border border-red-200">
                <div className="h-24 flex items-center justify-center text-red-600">
                  Error loading roles:{" "}
                  {(error as Error)?.message || "Unknown error"}
                </div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={roles}
                searchValue={searchTerm}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Roles;
