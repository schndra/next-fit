import { PrismaClient } from "../../app/generated/prisma";

export async function seedSizes(prisma: PrismaClient) {
  console.log("🌱 Seeding sizes...");

  const sizes = [
    { value: "XS", name: "Extra Small", sort_order: 1 },
    { value: "S", name: "Small", sort_order: 2 },
    { value: "M", name: "Medium", sort_order: 3 },
    { value: "L", name: "Large", sort_order: 4 },
    { value: "XL", name: "Extra Large", sort_order: 5 },
    { value: "XXL", name: "Double Extra Large", sort_order: 6 },
    { value: "28", name: "Size 28", sort_order: 10 },
    { value: "30", name: "Size 30", sort_order: 11 },
    { value: "32", name: "Size 32", sort_order: 12 },
    { value: "34", name: "Size 34", sort_order: 13 },
    { value: "36", name: "Size 36", sort_order: 14 },
    { value: "38", name: "Size 38", sort_order: 15 },
    { value: "40", name: "Size 40", sort_order: 16 },
    { value: "42", name: "Size 42", sort_order: 17 },
  ];

  for (const size of sizes) {
    await prisma.size.upsert({
      where: { value: size.value },
      update: size,
      create: size,
    });
  }

  console.log(`✅ Created ${sizes.length} sizes`);
}
