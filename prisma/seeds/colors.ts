import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export const seedColors = async () => {
  console.log("🎨 Seeding colors...");

  const colorsData = [
    { value: "#FF0000", name: "Red", sort_order: 1 },
    { value: "#00FF00", name: "Green", sort_order: 2 },
    { value: "#0000FF", name: "Blue", sort_order: 3 },
    { value: "#FFFF00", name: "Yellow", sort_order: 4 },
    { value: "#FF00FF", name: "Magenta", sort_order: 5 },
    { value: "#00FFFF", name: "Cyan", sort_order: 6 },
    { value: "#800000", name: "Maroon", sort_order: 7 },
    { value: "#008000", name: "Dark Green", sort_order: 8 },
    { value: "#000080", name: "Navy", sort_order: 9 },
    { value: "#808000", name: "Olive", sort_order: 10 },
    { value: "#800080", name: "Purple", sort_order: 11 },
    { value: "#008080", name: "Teal", sort_order: 12 },
    { value: "#C0C0C0", name: "Silver", sort_order: 13 },
    { value: "#808080", name: "Gray", sort_order: 14 },
    { value: "#000000", name: "Black", sort_order: 15 },
    { value: "#FFFFFF", name: "White", sort_order: 16 },
    { value: "#FFA500", name: "Orange", sort_order: 17 },
    { value: "#FFC0CB", name: "Pink", sort_order: 18 },
    { value: "#A52A2A", name: "Brown", sort_order: 19 },
    { value: "#D2691E", name: "Chocolate", sort_order: 20 },
  ];

  try {
    for (const colorData of colorsData) {
      await prisma.color.upsert({
        where: { value: colorData.value },
        update: {},
        create: colorData,
      });
    }

    console.log("✅ Colors seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding colors:", error);
  }
};
