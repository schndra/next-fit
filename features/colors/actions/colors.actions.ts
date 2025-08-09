"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  CreateColorInput,
  createColorSchema,
  UpdateColorInput,
  updateColorSchema,
} from "@/features/colors/schema/color.schemas";

export type ColorType = {
  id: string;
  value: string;
  name: string;
  sort_order: number;
  created_at?: Date;
  updated_at?: Date;
};

export const getAllColors = async (): Promise<ColorType[]> => {
  try {
    const colors: ColorType[] = await prisma.color.findMany({
      orderBy: {
        sort_order: "asc",
      },
    });

    return colors;
  } catch (error) {
    console.error("Error fetching colors:", error);
    return [];
  }
};

export const getColorById = async (id: string): Promise<ColorType | null> => {
  try {
    const color = await prisma.color.findUnique({
      where: {
        id,
      },
    });

    return color;
  } catch (error) {
    console.error("Error fetching color:", error);
    return null;
  }
};

export const getColorDetails = async (id: string) => {
  try {
    const color = await prisma.color.findUnique({
      where: {
        id,
      },
      include: {
        products: {
          select: {
            id: true,
            title: true,
            slug: true,
            created_at: true,
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!color) {
      return null;
    }

    return {
      ...color,
      productCount: color._count.products,
    };
  } catch (error) {
    console.error("Error fetching color details:", error);
    return null;
  }
};

export const createColor = async (
  data: CreateColorInput
): Promise<{
  success: boolean;
  message: string;
  color?: ColorType;
}> => {
  try {
    // Validate input
    const validatedData = createColorSchema.parse(data);

    // Check if color value already exists
    const existingColor = await prisma.color.findUnique({
      where: {
        value: validatedData.value,
      },
    });

    if (existingColor) {
      return {
        success: false,
        message: "A color with this value already exists",
      };
    }

    // Create the color
    const color = await prisma.color.create({
      data: {
        value: validatedData.value,
        name: validatedData.name,
        sort_order: validatedData.sort_order ?? 0,
      },
    });

    // Revalidate the colors page
    revalidatePath("/admin/colors");

    return {
      success: true,
      message: "Color created successfully",
      color,
    };
  } catch (error) {
    console.error("Error creating color:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Failed to create color. Please try again.",
    };
  }
};

export const updateColor = async (
  data: UpdateColorInput
): Promise<{
  success: boolean;
  message: string;
  color?: ColorType;
}> => {
  try {
    // Validate input
    const validatedData = updateColorSchema.parse(data);

    // Check if color exists
    const existingColor = await prisma.color.findUnique({
      where: {
        id: validatedData.id,
      },
    });

    if (!existingColor) {
      return {
        success: false,
        message: "Color not found",
      };
    }

    // Check if value is being changed and if new value already exists
    if (validatedData.value !== existingColor.value) {
      const colorWithSameValue = await prisma.color.findUnique({
        where: {
          value: validatedData.value,
        },
      });

      if (colorWithSameValue) {
        return {
          success: false,
          message: "A color with this value already exists",
        };
      }
    }

    // Update the color
    const color = await prisma.color.update({
      where: {
        id: validatedData.id,
      },
      data: {
        value: validatedData.value,
        name: validatedData.name,
        sort_order: validatedData.sort_order ?? 0,
      },
    });

    // Revalidate the colors page
    revalidatePath("/admin/colors");

    return {
      success: true,
      message: "Color updated successfully",
      color,
    };
  } catch (error) {
    console.error("Error updating color:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Failed to update color. Please try again.",
    };
  }
};

export const deleteColor = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Check if color exists
    const existingColor = await prisma.color.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
      },
    });

    if (!existingColor) {
      return {
        success: false,
        message: "Color not found",
      };
    }

    // Check if color has products assigned
    if (existingColor.products.length > 0) {
      return {
        success: false,
        message: `Cannot delete color. ${existingColor.products.length} product(s) are using this color.`,
      };
    }

    // Delete the color
    await prisma.color.delete({
      where: {
        id,
      },
    });

    // Revalidate the colors page
    revalidatePath("/admin/colors");

    return {
      success: true,
      message: "Color deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting color:", error);

    return {
      success: false,
      message: "Failed to delete color. Please try again.",
    };
  }
};
