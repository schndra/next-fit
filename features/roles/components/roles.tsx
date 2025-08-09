"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  Shield,
  UserCheck,
  RefreshCw,
  AlertCircle,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllRoles } from "../actions/roles.actions";
import { RoleType } from "./column";

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

  const filteredRoles = roles.filter(
    (role: RoleType) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description &&
        role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRefresh = () => {
    refetch();
  };

  const getStatusColor = (role: RoleType) => {
    // You can customize this based on your role status logic
    if (role.name.toLowerCase() === "admin") return "bg-red-100 text-red-800";
    if (role.name.toLowerCase() === "user")
      return "bg-green-100 text-green-800";
    return "bg-blue-100 text-blue-800";
  };

  const getRoleIcon = (role: RoleType) => {
    if (role.name.toLowerCase() === "admin")
      return <Shield className="h-4 w-4" />;
    if (role.name.toLowerCase() === "user")
      return <UserCheck className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading roles...
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-red-600"
                    >
                      Error loading roles:{" "}
                      {(error as Error)?.message || "Unknown error"}
                    </TableCell>
                  </TableRow>
                ) : filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((role: RoleType) => (
                    <TableRow key={role.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {getRoleIcon(role)}
                          <div>
                            <div className="font-medium">{role.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {role.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {role.description || "No description"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(role)}>
                          {role.name.toLowerCase().includes("admin")
                            ? "Admin"
                            : role.name.toLowerCase().includes("user")
                            ? "User"
                            : "Custom"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {/* This would come from your permissions system */}
                          View permissions
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {/* This would come from your user-role relationship */}
                          0 users
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Roles;
