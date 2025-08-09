"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  CreateCategoryInput,
  createCategorySchema,
  UpdateCategoryInput,
  updateCategorySchema,
} from "@/features/categories/schema/category.schemas";
import { CategoryType } from "../components/column";

export const getAllCategories = async (): Promise<CategoryType[]> => {
  try {
    const categories: CategoryType[] = await prisma.category.findMany({
      include: {
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            sub_categories: true,
            products: true,
          },
        },
      },
      orderBy: [
        {
          is_main_category: "desc",
        },
        {
          sort_order: "asc",
        },
      ],
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getCategoryById = async (
  id: string
): Promise<CategoryType | null> => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            sub_categories: true,
            products: true,
          },
        },
      },
    });

    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
};

export const getCategoryDetails = async (id: string) => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        sub_categories: {
          select: {
            id: true,
            title: true,
            slug: true,
            is_active: true,
            created_at: true,
          },
          orderBy: {
            sort_order: "asc",
          },
        },
        products: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            is_active: true,
            created_at: true,
          },
          orderBy: {
            created_at: "desc",
          },
          take: 10, // Limit to latest 10 products
        },
        _count: {
          select: {
            sub_categories: true,
            products: true,
          },
        },
      },
    });

    if (!category) {
      return null;
    }

    return {
      ...category,
      subcategoryCount: category._count.sub_categories,
      productCount: category._count.products,
    };
  } catch (error) {
    console.error("Error fetching category details:", error);
    return null;
  }
};

export const getMainCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parent_id: null,
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        sort_order: "asc",
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching main categories:", error);
    return [];
  }
};

export const createCategory = async (
  data: CreateCategoryInput
): Promise<{
  success: boolean;
  message: string;
  category?: CategoryType;
}> => {
  try {
    // Validate input
    const validatedData = createCategorySchema.parse(data);

    // Check if category slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        slug: validatedData.slug,
      },
    });

    if (existingCategory) {
      return {
        success: false,
        message: "A category with this slug already exists",
      };
    }

    // Validate parent category exists if provided
    if (validatedData.parent_id) {
      const parentCategory = await prisma.category.findUnique({
        where: {
          id: validatedData.parent_id,
        },
      });

      if (!parentCategory) {
        return {
          success: false,
          message: "Parent category not found",
        };
      }
    }

    // Create the category
    const category = await prisma.category.create({
      data: {
        title: validatedData.title,
        desc: validatedData.desc,
        img: validatedData.img,
        slug: validatedData.slug,
        parent_id: validatedData.parent_id,
        is_main_category: validatedData.is_main_category ?? false,
        is_active: validatedData.is_active ?? true,
        sort_order: validatedData.sort_order ?? 0,
      },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            sub_categories: true,
            products: true,
          },
        },
      },
    });

    // Revalidate the categories page
    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Category created successfully",
      category,
    };
  } catch (error) {
    console.error("Error creating category:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Failed to create category. Please try again.",
    };
  }
};

export const updateCategory = async (
  data: UpdateCategoryInput
): Promise<{
  success: boolean;
  message: string;
  category?: CategoryType;
}> => {
  try {
    // Validate input
    const validatedData = updateCategorySchema.parse(data);

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        id: validatedData.id,
      },
    });

    if (!existingCategory) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    // Check if slug is being changed and if new slug already exists
    if (validatedData.slug !== existingCategory.slug) {
      const categoryWithSameSlug = await prisma.category.findUnique({
        where: {
          slug: validatedData.slug,
        },
      });

      if (categoryWithSameSlug) {
        return {
          success: false,
          message: "A category with this slug already exists",
        };
      }
    }

    // Validate parent category exists if provided and prevent self-reference
    if (validatedData.parent_id) {
      if (validatedData.parent_id === validatedData.id) {
        return {
          success: false,
          message: "A category cannot be its own parent",
        };
      }

      const parentCategory = await prisma.category.findUnique({
        where: {
          id: validatedData.parent_id,
        },
      });

      if (!parentCategory) {
        return {
          success: false,
          message: "Parent category not found",
        };
      }

      // Check for circular reference
      const checkCircularReference = async (
        parentId: string,
        currentId: string
      ): Promise<boolean> => {
        const parent = await prisma.category.findUnique({
          where: { id: parentId },
          select: { parent_id: true },
        });

        if (!parent) return false;
        if (parent.parent_id === currentId) return true;
        if (parent.parent_id) {
          return await checkCircularReference(parent.parent_id, currentId);
        }
        return false;
      };

      const hasCircularReference = await checkCircularReference(
        validatedData.parent_id,
        validatedData.id
      );
      if (hasCircularReference) {
        return {
          success: false,
          message:
            "Circular reference detected. A category cannot be a child of its own subcategory.",
        };
      }
    }

    // Update the category
    const category = await prisma.category.update({
      where: {
        id: validatedData.id,
      },
      data: {
        title: validatedData.title,
        desc: validatedData.desc,
        img: validatedData.img,
        slug: validatedData.slug,
        parent_id: validatedData.parent_id,
        is_main_category: validatedData.is_main_category ?? false,
        is_active: validatedData.is_active ?? true,
        sort_order: validatedData.sort_order ?? 0,
      },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            sub_categories: true,
            products: true,
          },
        },
      },
    });

    // Revalidate the categories page
    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Category updated successfully",
      category,
    };
  } catch (error) {
    console.error("Error updating category:", error);

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Failed to update category. Please try again.",
    };
  }
};

export const deleteCategory = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        sub_categories: true,
        products: true,
      },
    });

    if (!existingCategory) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    // Check if category has subcategories
    if (existingCategory.sub_categories.length > 0) {
      return {
        success: false,
        message: `Cannot delete category. ${existingCategory.sub_categories.length} subcategory(ies) are using this category as parent.`,
      };
    }

    // Check if category has products assigned
    if (existingCategory.products.length > 0) {
      return {
        success: false,
        message: `Cannot delete category. ${existingCategory.products.length} product(s) are assigned to this category.`,
      };
    }

    // Delete the category
    await prisma.category.delete({
      where: {
        id,
      },
    });

    // Revalidate the categories page
    revalidatePath("/admin/categories");

    return {
      success: true,
      message: "Category deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting category:", error);

    return {
      success: false,
      message: "Failed to delete category. Please try again.",
    };
  }
};
