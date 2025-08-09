"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  CreateRoleInput,
  createRoleSchema,
  UpdateRoleInput,
  updateRoleSchema,
} from "@/features/roles/schema/role.schemas";
import { RoleType } from "../components/column";

export const getAllRoles = async (): Promise<RoleType[]> => {
  try {
    const roles: RoleType[] = await prisma.role.findMany({
      orderBy: {
        created_at: "asc",
      },
    });

    return roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};

export const getRoleById = async (id: string): Promise<RoleType | null> => {
  try {
    const role = await prisma.role.findUnique({
      where: {
        id,
      },
    });

    return role;
  } catch (error) {
    console.error("Error fetching role:", error);
    return null;
  }
};

export const getRoleDetails = async (id: string) => {
  try {
    const role = await prisma.role.findUnique({
      where: {
        id,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            created_at: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!role) {
      return null;
    }

    return {
      ...role,
      userCount: role._count.users,
    };
  } catch (error) {
    console.error("Error fetching role details:", error);
    return null;
  }
};

export const createRole = async (
  data: CreateRoleInput
): Promise<{
  success: boolean;
  message: string;
  role?: RoleType;
}> => {
  try {
    // Validate input
    const validatedData = createRoleSchema.parse(data);

    // Check if role name already exists
    const existingRole = await prisma.role.findUnique({
      where: {
        name: validatedData.name,
      },
    });

    if (existingRole) {
      return {
        success: false,
        message: "A role with this name already exists",
      };
    }

    // Create the role
    const role = await prisma.role.create({
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
      },
    });

    // Revalidate the roles page
    revalidatePath("/admin/roles");

    return {
      success: true,
      message: "Role created successfully",
      role,
    };
  } catch (error) {
    console.error("Error creating role:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Failed to create role. Please try again.",
    };
  }
};

export const updateRole = async (
  data: UpdateRoleInput
): Promise<{
  success: boolean;
  message: string;
  role?: RoleType;
}> => {
  try {
    // Validate input
    const validatedData = updateRoleSchema.parse(data);

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: {
        id: validatedData.id,
      },
    });

    if (!existingRole) {
      return {
        success: false,
        message: "Role not found",
      };
    }

    // Check if name is being changed and if new name already exists
    if (validatedData.name !== existingRole.name) {
      const roleWithSameName = await prisma.role.findUnique({
        where: {
          name: validatedData.name,
        },
      });

      if (roleWithSameName) {
        return {
          success: false,
          message: "A role with this name already exists",
        };
      }
    }

    // Update the role
    const role = await prisma.role.update({
      where: {
        id: validatedData.id,
      },
      data: {
        name: validatedData.name,
        description: validatedData.description || null,
      },
    });

    // Revalidate the roles page
    revalidatePath("/admin/roles");

    return {
      success: true,
      message: "Role updated successfully",
      role,
    };
  } catch (error) {
    console.error("Error updating role:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Failed to update role. Please try again.",
    };
  }
};

export const deleteRole = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: {
        id,
      },
      include: {
        users: true,
      },
    });

    if (!existingRole) {
      return {
        success: false,
        message: "Role not found",
      };
    }

    // Check if role has users assigned
    if (existingRole.users.length > 0) {
      return {
        success: false,
        message: `Cannot delete role. ${existingRole.users.length} user(s) are assigned to this role.`,
      };
    }

    // Delete the role
    await prisma.role.delete({
      where: {
        id,
      },
    });

    // Revalidate the roles page
    revalidatePath("/admin/roles");

    return {
      success: true,
      message: "Role deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting role:", error);

    return {
      success: false,
      message: "Failed to delete role. Please try again.",
    };
  }
};
