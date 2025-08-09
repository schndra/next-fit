"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  checkUserRole,
} from "../actions/profile.actions";
import type { ProfileUpdateData, PasswordUpdateData } from "../schema";

// Hook to get user profile
export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook to update user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      profileData,
    }: {
      userId: string;
      profileData: ProfileUpdateData;
    }) => updateUserProfile(userId, profileData),
    onSuccess: (updatedUser, variables) => {
      queryClient.setQueryData(["profile", variables.userId], updatedUser);
      queryClient.invalidateQueries({
        queryKey: ["profile", variables.userId],
      });
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    },
  });
}

// Hook to update user password
export function useUpdatePassword() {
  return useMutation({
    mutationFn: ({
      userId,
      passwordData,
    }: {
      userId: string;
      passwordData: PasswordUpdateData;
    }) => updateUserPassword(userId, passwordData),
    onSuccess: () => {
      toast.success("Password updated successfully!");
    },
    onError: (error: any) => {
      console.error("Error updating password:", error);
      const errorMessage = error.message || "Failed to update password";
      toast.error(errorMessage);
    },
  });
}

// Hook to check user role
export function useUserRole(userId?: string) {
  return useQuery({
    queryKey: ["userRole", userId],
    queryFn: () => checkUserRole(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
