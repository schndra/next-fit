"use server";

import prisma from "@/lib/prisma";
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
