import { PrismaClient } from "../../app/generated/prisma";

const categoriesData = [
  // Main Categories for Clothing Shop
  {
    title: "Men's Clothing",
    desc: "Stylish clothing and fashion items for men",
    slug: "mens-clothing",
    img: "User",
    is_main_category: true,
    is_active: true,
    sort_order: 1,
  },
  {
    title: "Women's Clothing",
    desc: "Trendy clothing and fashion items for women",
    slug: "womens-clothing",
    img: "Users",
    is_main_category: true,
    is_active: true,
    sort_order: 2,
  },
  {
    title: "Footwear",
    desc: "Shoes, boots, and footwear for all occasions",
    slug: "footwear",
    img: "Footprints",
    is_main_category: true,
    is_active: true,
    sort_order: 3,
  },
  {
    title: "Accessories",
    desc: "Fashion accessories to complete your look",
    slug: "accessories",
    img: "Watch",
    is_main_category: true,
    is_active: true,
    sort_order: 4,
  },
  {
    title: "Activewear",
    desc: "Sports and fitness clothing for active lifestyle",
    slug: "activewear",
    img: "Activity",
    is_main_category: true,
    is_active: true,
    sort_order: 5,
  },
];

const subcategoriesData = [
  // Men's Clothing subcategories
  {
    title: "T-Shirts & Polos",
    desc: "Casual t-shirts, polo shirts, and tank tops for men",
    slug: "mens-tshirts-polos",
    img: "Shirt",
    parent_slug: "mens-clothing",
    is_main_category: false,
    is_active: true,
    sort_order: 1,
  },
  {
    title: "Shirts & Dress Shirts",
    desc: "Formal and casual shirts for men",
    slug: "mens-shirts",
    img: "Shirt",
    parent_slug: "mens-clothing",
    is_main_category: false,
    is_active: true,
    sort_order: 2,
  },
  {
    title: "Jeans & Pants",
    desc: "Jeans, chinos, and casual pants for men",
    slug: "mens-jeans-pants",
    img: "ShoppingBag",
    parent_slug: "mens-clothing",
    is_main_category: false,
    is_active: true,
    sort_order: 3,
  },
  {
    title: "Hoodies & Sweatshirts",
    desc: "Comfortable hoodies and sweatshirts for men",
    slug: "mens-hoodies",
    img: "Shirt",
    parent_slug: "mens-clothing",
    is_main_category: false,
    is_active: true,
    sort_order: 4,
  },
  {
    title: "Jackets & Outerwear",
    desc: "Jackets, coats, and outerwear for men",
    slug: "mens-jackets",
    img: "Shield",
    parent_slug: "mens-clothing",
    is_main_category: false,
    is_active: true,
    sort_order: 5,
  },

  // Women's Clothing subcategories
  {
    title: "Tops & Blouses",
    desc: "Stylish tops, blouses, and shirts for women",
    slug: "womens-tops-blouses",
    img: "Shirt",
    parent_slug: "womens-clothing",
    is_main_category: false,
    is_active: true,
    sort_order: 1,
  },
  {
    title: "Dresses",
    desc: "Elegant dresses for all occasions",
    slug: "womens-dresses",
    img: "Shirt",
    parent_slug: "womens-clothing",
    is_main_category: false,
    is_active: true,
    sort_order: 2,
  },
  {
    title: "Jeans & Bottoms",
    desc: "Jeans, leggings, and pants for women",
    slug: "womens-jeans-bottoms",
    img: "ShoppingBag",
    parent_slug: "womens-clothing",
    is_main_category: false,
    is_active: true,
    sort_order: 3,
  },
  {
    title: "Skirts",
    desc: "Fashionable skirts for women",
    slug: "womens-skirts",
    img: "Shirt",
    parent_slug: "womens-clothing",
    is_main_category: false,
    is_active: true,
    sort_order: 4,
  },
  {
    title: "Sweaters & Cardigans",
    desc: "Cozy sweaters and cardigans for women",
    slug: "womens-sweaters",
    img: "Shirt",
    parent_slug: "womens-clothing",
    is_main_category: false,
    is_active: true,
    sort_order: 5,
  },

  // Footwear subcategories
  {
    title: "Sneakers",
    desc: "Casual and athletic sneakers",
    slug: "sneakers",
    img: "Zap",
    parent_slug: "footwear",
    is_main_category: false,
    is_active: true,
    sort_order: 1,
  },
  {
    title: "Dress Shoes",
    desc: "Formal dress shoes for special occasions",
    slug: "dress-shoes",
    img: "Crown",
    parent_slug: "footwear",
    is_main_category: false,
    is_active: true,
    sort_order: 2,
  },
  {
    title: "Boots",
    desc: "Stylish boots for all seasons",
    slug: "boots",
    img: "Shield",
    parent_slug: "footwear",
    is_main_category: false,
    is_active: true,
    sort_order: 3,
  },
  {
    title: "Sandals",
    desc: "Comfortable sandals for warm weather",
    slug: "sandals",
    img: "Sun",
    parent_slug: "footwear",
    is_main_category: false,
    is_active: true,
    sort_order: 4,
  },

  // Accessories subcategories
  {
    title: "Bags & Backpacks",
    desc: "Stylish bags, backpacks, and purses",
    slug: "bags-backpacks",
    img: "ShoppingBag",
    parent_slug: "accessories",
    is_main_category: false,
    is_active: true,
    sort_order: 1,
  },
  {
    title: "Watches",
    desc: "Fashionable watches and timepieces",
    slug: "watches",
    img: "Watch",
    parent_slug: "accessories",
    is_main_category: false,
    is_active: true,
    sort_order: 2,
  },
  {
    title: "Jewelry",
    desc: "Beautiful jewelry and accessories",
    slug: "jewelry",
    img: "Diamond",
    parent_slug: "accessories",
    is_main_category: false,
    is_active: true,
    sort_order: 3,
  },
  {
    title: "Hats & Caps",
    desc: "Stylish hats, caps, and headwear",
    slug: "hats-caps",
    img: "Crown",
    parent_slug: "accessories",
    is_main_category: false,
    is_active: true,
    sort_order: 4,
  },
  {
    title: "Belts",
    desc: "Leather and fabric belts",
    slug: "belts",
    img: "Minus",
    parent_slug: "accessories",
    is_main_category: false,
    is_active: true,
    sort_order: 5,
  },

  // Activewear subcategories
  {
    title: "Gym Wear",
    desc: "Workout clothes and gym apparel",
    slug: "gym-wear",
    img: "Dumbbell",
    parent_slug: "activewear",
    is_main_category: false,
    is_active: true,
    sort_order: 1,
  },
  {
    title: "Running Gear",
    desc: "Running clothes and athletic wear",
    slug: "running-gear",
    img: "Zap",
    parent_slug: "activewear",
    is_main_category: false,
    is_active: true,
    sort_order: 2,
  },
  {
    title: "Yoga & Fitness",
    desc: "Yoga pants, sports bras, and fitness wear",
    slug: "yoga-fitness",
    img: "Heart",
    parent_slug: "activewear",
    is_main_category: false,
    is_active: true,
    sort_order: 3,
  },
  {
    title: "Sports Jerseys",
    desc: "Team jerseys and sports apparel",
    slug: "sports-jerseys",
    img: "Trophy",
    parent_slug: "activewear",
    is_main_category: false,
    is_active: true,
    sort_order: 4,
  },
];

export async function seedCategories(prisma: PrismaClient) {
  console.log("🏷️  Seeding categories...");

  try {
    // First, delete all existing categories (this will cascade delete subcategories due to foreign key constraints)
    console.log("🗑️  Deleting existing categories...");
    await prisma.category.deleteMany({});
    console.log("✅ Deleted all existing categories");

    // First, create main categories
    const mainCategories = [];
    for (const categoryData of categoriesData) {
      const category = await prisma.category.create({
        data: categoryData,
      });
      mainCategories.push(category);
      console.log(`✅ Created main category: ${category.title}`);
    }

    // Then, create subcategories
    for (const subcategoryData of subcategoriesData) {
      const { parent_slug, ...rest } = subcategoryData;

      // Find the parent category
      const parentCategory = mainCategories.find(
        (cat) => cat.slug === parent_slug
      );
      if (!parentCategory) {
        console.log(
          `⚠️  Parent category not found for: ${subcategoryData.title}`
        );
        continue;
      }

      const subcategory = await prisma.category.create({
        data: {
          ...rest,
          parent_id: parentCategory.id,
        },
      });
      console.log(
        `✅ Created subcategory: ${subcategory.title} under ${parentCategory.title}`
      );
    }

    console.log(`✅ Categories seeding completed`);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
  }
}
