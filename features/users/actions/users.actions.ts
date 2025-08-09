"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  UserType,
  RoleType,
  CreateUserActionInput,
  createUserInputSchema,
  UpdateUserActionInput,
  updateUserInputSchema,
  DeleteUserActionInput,
  deleteUserInputSchema,
  GetUsersParams,
} from "@/features/users/schema/user.schemas";
import { auth } from "@/auth";
import { hashPassword } from "@/lib/encrypt";

// Helper function to serialize user data
const serializeUser = (user: any): UserType => {
  return {
    ...user,
    dob: user.dob ? new Date(user.dob) : null,
    email_verified: user.email_verified ? new Date(user.email_verified) : null,
    created_at: new Date(user.created_at),
    updated_at: new Date(user.updated_at),
  };
};

// Helper function to serialize user list
const serializeUserList = (users: any[]): UserType[] => {
  return users.map(serializeUser);
};

export const getAllUsers = async (
  params?: GetUsersParams
): Promise<UserType[]> => {
  try {
    const where: any = {};

    // Apply filters
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
        { first_name: { contains: params.search, mode: "insensitive" } },
        { last_name: { contains: params.search, mode: "insensitive" } },
        { phone: { contains: params.search, mode: "insensitive" } },
      ];
    }

    if (params?.role_id) {
      where.roles = {
        some: {
          id: params.role_id,
        },
      };
    }

    if (params?.email_verified !== undefined) {
      if (params.email_verified) {
        where.email_verified = { not: null };
      } else {
        where.email_verified = null;
      }
    }

    if (params?.start_date || params?.end_date) {
      where.created_at = {};
      if (params.start_date) {
        where.created_at.gte = params.start_date;
      }
      if (params.end_date) {
        where.created_at.lte = params.end_date;
      }
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        _count: {
          select: {
            orders: true,
            products: true,
            reviews: true,
            addresses: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return serializeUserList(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getUserById = async (id: string): Promise<UserType | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        _count: {
          select: {
            orders: true,
            products: true,
            reviews: true,
            addresses: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    return serializeUser(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};

export const getUserDetails = async (id: string): Promise<UserType | null> => {
  return getUserById(id);
};

export const createUser = async (input: CreateUserActionInput) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Validate input
    const validatedInput = createUserInputSchema.parse(input);
    const { data } = validatedInput;

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "A user with this email already exists.",
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Prepare user data
    const userData: any = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      dob: data.dob,
      image: data.image,
    };

    // Create user with roles if provided
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        roles: data.role_ids
          ? {
              connect: data.role_ids.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        _count: {
          select: {
            orders: true,
            products: true,
            reviews: true,
            addresses: true,
          },
        },
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User created successfully.",
      data: serializeUser(newUser),
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: "Failed to create user. Please try again.",
    };
  }
};

export const updateUser = async (input: UpdateUserActionInput) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Validate input
    const validatedInput = updateUserInputSchema.parse(input);
    const { id, data } = validatedInput;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    // Check if email is being changed and already exists
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        return {
          success: false,
          message: "A user with this email already exists.",
        };
      }
    }

    // Prepare update data
    const updateData: any = { ...data };

    // Hash password if provided
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    // Handle roles update
    if (data.role_ids) {
      updateData.roles = {
        set: data.role_ids.map((id) => ({ id })),
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
        _count: {
          select: {
            orders: true,
            products: true,
            reviews: true,
            addresses: true,
          },
        },
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${id}`);

    return {
      success: true,
      message: "User updated successfully.",
      data: serializeUser(updatedUser),
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      message: "Failed to update user. Please try again.",
    };
  }
};

export const deleteUser = async (input: DeleteUserActionInput) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Validate input
    const validatedInput = deleteUserInputSchema.parse(input);
    const { id } = validatedInput;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orders: true,
            products: true,
            reviews: true,
          },
        },
      },
    });

    if (!existingUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    // Prevent deleting user if they have orders, products, or reviews
    if (
      existingUser._count.orders > 0 ||
      existingUser._count.products > 0 ||
      existingUser._count.reviews > 0
    ) {
      return {
        success: false,
        message:
          "Cannot delete user with existing orders, products, or reviews.",
      };
    }

    // Prevent user from deleting themselves
    if (id === session.user.id) {
      return {
        success: false,
        message: "You cannot delete your own account.",
      };
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      message: "User deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message: "Failed to delete user. Please try again.",
    };
  }
};

// Get all roles for user management
export const getAllRoles = async (): Promise<RoleType[]> => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return roles.map((role) => ({
      ...role,
      created_at: new Date(role.created_at),
      updated_at: new Date(role.updated_at),
    }));
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};

// Get user statistics for dashboard
export const getUserStats = async () => {
  try {
    const [
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      todayUsers,
      usersWithOrders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { email_verified: { not: null } } }),
      prisma.user.count({ where: { email_verified: null } }),
      prisma.user.count({
        where: {
          created_at: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.user.count({
        where: {
          orders: {
            some: {},
          },
        },
      }),
    ]);

    return {
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      todayUsers,
      usersWithOrders,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      totalUsers: 0,
      verifiedUsers: 0,
      unverifiedUsers: 0,
      todayUsers: 0,
      usersWithOrders: 0,
    };
  }
};
