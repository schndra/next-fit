"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { hashPassword, comparePasswords } from "@/lib/encrypt";
import { profileUpdateSchema, passwordUpdateSchema } from "../schema";
import type { ProfileUpdateData, PasswordUpdateData } from "../schema";

/**
 * Get user profile data
 */
export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        dob: true,
        image: true,
        created_at: true,
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch profile");
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  profileData: ProfileUpdateData
) {
  try {
    const validatedData = profileUpdateSchema.parse(profileData);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: validatedData.name,
        first_name: validatedData.first_name || null,
        last_name: validatedData.last_name || null,
        email: validatedData.email,
        phone: validatedData.phone || null,
        dob: validatedData.dob ? new Date(validatedData.dob) : null,
        updated_at: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        dob: true,
        image: true,
        created_at: true,
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
}

/**
 * Update user password
 */
export async function updateUserPassword(
  userId: string,
  passwordData: PasswordUpdateData
) {
  try {
    const validatedData = passwordUpdateSchema.parse(passwordData);

    // Get current user to verify current password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePasswords(
      validatedData.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(validatedData.newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword,
        updated_at: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}

/**
 * Check if user has admin role
 */
export async function checkUserRole(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        roles: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      return { isAdmin: false };
    }

    const isAdmin = user.roles.some(
      (role) =>
        role.name.toLowerCase() === "admin" ||
        role.name.toLowerCase() === "administrator"
    );

    return { isAdmin };
  } catch (error) {
    console.error("Error checking user role:", error);
    return { isAdmin: false };
  }
}
