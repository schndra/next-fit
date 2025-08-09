"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getUserDetails,
  updateUser,
  getAllRoles,
} from "@/features/users/actions/users.actions";
import {
  UserType,
  UpdateUserInput,
  RoleType,
} from "@/features/users/schema/user.schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Edit,
  Save,
  RefreshCw,
  Package,
  ShoppingCart,
  Star,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import {
  formatDate,
  getFullName,
  getUserInitials,
  getVerificationStatusBadge,
  getUserRoleNames,
  getUserActivitySummary,
  getUserJoinDuration,
  getUserStatsSummary,
} from "@/features/users/utils/user.utils";

interface UserDetailViewProps {
  userId: string;
}

export function UserDetailView({ userId }: UserDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateUserInput>({});
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserDetails(userId),
    enabled: !!userId && userId !== "new",
    staleTime: 30 * 1000, // 30 seconds
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
    staleTime: 10 * 60 * 1000,
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["users"] });
        queryClient.invalidateQueries({ queryKey: ["user", userId] });
        setIsEditing(false);
        setFormData({});
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      console.error("Update user error:", error);
      toast.error("Failed to update user. Please try again.");
    },
  });

  const handleInputChange = (field: keyof UpdateUserInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoleChange = (roleId: string, checked: boolean) => {
    const currentRoleIds =
      formData.role_ids || user?.roles.map((r) => r.id) || [];
    let newRoleIds;

    if (checked) {
      newRoleIds = [...currentRoleIds, roleId];
    } else {
      newRoleIds = currentRoleIds.filter((id) => id !== roleId);
    }

    handleInputChange("role_ids", newRoleIds);
  };

  const handleSave = () => {
    if (!user) return;

    updateUserMutation.mutate({
      id: user.id,
      data: formData,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading user...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-red-600">
          User not found or error loading user.
        </div>
      </div>
    );
  }

  const fullName = getFullName(user);
  const initials = getUserInitials(user);
  const verificationBadge = getVerificationStatusBadge(user.email_verified);
  const roleNames = getUserRoleNames(user);
  const activitySummary = getUserActivitySummary(user);
  const joinDuration = getUserJoinDuration(user);
  const statsSummary = getUserStatsSummary(user);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.image || undefined} alt={fullName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{fullName}</h1>
              <p className="text-muted-foreground">Joined {joinDuration}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  {isEditing ? (
                    <Input
                      value={formData.name || user.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter full name"
                    />
                  ) : (
                    <div className="mt-1 text-sm">{user.name}</div>
                  )}
                </div>

                <div>
                  <Label>Email</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.email || user.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter email"
                    />
                  ) : (
                    <div className="mt-1 text-sm">{user.email}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  {isEditing ? (
                    <Input
                      value={formData.first_name || user.first_name || ""}
                      onChange={(e) =>
                        handleInputChange("first_name", e.target.value)
                      }
                      placeholder="Enter first name"
                    />
                  ) : (
                    <div className="mt-1 text-sm">
                      {user.first_name || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Last Name</Label>
                  {isEditing ? (
                    <Input
                      value={formData.last_name || user.last_name || ""}
                      onChange={(e) =>
                        handleInputChange("last_name", e.target.value)
                      }
                      placeholder="Enter last name"
                    />
                  ) : (
                    <div className="mt-1 text-sm">
                      {user.last_name || "Not provided"}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  {isEditing ? (
                    <Input
                      value={formData.phone || user.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="mt-1 text-sm">
                      {user.phone || "Not provided"}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Email Status</Label>
                  <div className="mt-1">
                    <Badge className={verificationBadge.className}>
                      {verificationBadge.label}
                    </Badge>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div>
                  <Label>New Password (leave blank to keep current)</Label>
                  <Input
                    type="password"
                    value={formData.password || ""}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="Enter new password"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Roles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-3">
                  {roles.map((role) => {
                    const currentRoleIds =
                      formData.role_ids || user.roles.map((r) => r.id);
                    const isChecked = currentRoleIds.includes(role.id);

                    return (
                      <div
                        key={role.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={role.id}
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            handleRoleChange(role.id, !!checked)
                          }
                        />
                        <Label htmlFor={role.id} className="flex-1">
                          <div className="font-medium">{role.name}</div>
                          {role.description && (
                            <div className="text-sm text-muted-foreground">
                              {role.description}
                            </div>
                          )}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <Badge key={role.id} variant="outline">
                        {role.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No roles assigned
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Activity */}
        <div className="space-y-6">
          {/* User Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsSummary.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{stat.label}</span>
                  <span className={`text-sm font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {formatDate(user.created_at)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span>Updated {formatDate(user.updated_at)}</span>
              </div>

              {user.dob && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Born {formatDate(user.dob)}</span>
                </div>
              )}

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Activity Summary</h4>
                <p className="text-sm text-muted-foreground">
                  {activitySummary}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
