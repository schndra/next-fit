"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  CreateSizeInput,
  createSizeSchema,
  UpdateSizeInput,
  updateSizeSchema,
} from "@/features/sizes/schema/size.schemas";
import { SizeType } from "../components/column";

export const getAllSizes = async (): Promise<SizeType[]> => {
  try {
    const sizes: SizeType[] = await prisma.size.findMany({
      orderBy: {
        sort_order: "asc",
      },
    });

    return sizes;
  } catch (error) {
    console.error("Error fetching sizes:", error);
    return [];
  }
};

export const getSizeById = async (id: string): Promise<SizeType | null> => {
  try {
    const size = await prisma.size.findUnique({
      where: {
        id,
      },
    });

    return size;
  } catch (error) {
    console.error("Error fetching size:", error);
    return null;
  }
};

export const getSizeDetails = async (id: string) => {
  try {
    const size = await prisma.size.findUnique({
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

    if (!size) {
      return null;
    }

    return {
      ...size,
      productCount: size._count.products,
    };
  } catch (error) {
    console.error("Error fetching size details:", error);
    return null;
  }
};

export const createSize = async (
  data: CreateSizeInput
): Promise<{
  success: boolean;
  message: string;
  size?: SizeType;
}> => {
  try {
    // Validate input
    const validatedData = createSizeSchema.parse(data);

    // Check if size value already exists
    const existingSize = await prisma.size.findUnique({
      where: {
        value: validatedData.value,
      },
    });

    if (existingSize) {
      return {
        success: false,
        message: "A size with this value already exists",
      };
    }

    // Create the size
    const size = await prisma.size.create({
      data: {
        value: validatedData.value,
        name: validatedData.name,
        sort_order: validatedData.sort_order ?? 0,
      },
    });

    // Revalidate the sizes page
    revalidatePath("/admin/sizes");

    return {
      success: true,
      message: "Size created successfully",
      size,
    };
  } catch (error) {
    console.error("Error creating size:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Failed to create size. Please try again.",
    };
  }
};

export const updateSize = async (
  data: UpdateSizeInput
): Promise<{
  success: boolean;
  message: string;
  size?: SizeType;
}> => {
  try {
    // Validate input
    const validatedData = updateSizeSchema.parse(data);

    // Check if size exists
    const existingSize = await prisma.size.findUnique({
      where: {
        id: validatedData.id,
      },
    });

    if (!existingSize) {
      return {
        success: false,
        message: "Size not found",
      };
    }

    // Check if value is being changed and if new value already exists
    if (validatedData.value !== existingSize.value) {
      const sizeWithSameValue = await prisma.size.findUnique({
        where: {
          value: validatedData.value,
        },
      });

      if (sizeWithSameValue) {
        return {
          success: false,
          message: "A size with this value already exists",
        };
      }
    }

    // Update the size
    const size = await prisma.size.update({
      where: {
        id: validatedData.id,
      },
      data: {
        value: validatedData.value,
        name: validatedData.name,
        sort_order: validatedData.sort_order ?? 0,
      },
    });

    // Revalidate the sizes page
    revalidatePath("/admin/sizes");

    return {
      success: true,
      message: "Size updated successfully",
      size,
    };
  } catch (error) {
    console.error("Error updating size:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Failed to update size. Please try again.",
    };
  }
};

export const deleteSize = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Check if size exists
    const existingSize = await prisma.size.findUnique({
      where: {
        id,
      },
      include: {
        products: true,
      },
    });

    if (!existingSize) {
      return {
        success: false,
        message: "Size not found",
      };
    }

    // Check if size has products assigned
    if (existingSize.products.length > 0) {
      return {
        success: false,
        message: `Cannot delete size. ${existingSize.products.length} product(s) are using this size.`,
      };
    }

    // Delete the size
    await prisma.size.delete({
      where: {
        id,
      },
    });

    // Revalidate the sizes page
    revalidatePath("/admin/sizes");

    return {
      success: true,
      message: "Size deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting size:", error);

    return {
      success: false,
      message: "Failed to delete size. Please try again.",
    };
  }
};
