import { PrismaClient } from "../app/generated/prisma";
import { seedRoles } from "./seeds/roles";
import { seedUsers } from "./seeds/users";
import { seedSizes } from "./seeds/sizes";
import { seedColors } from "./seeds/colors";
import { seedCategories } from "./seeds/categories";
import { seedCoupons } from "./seeds/coupons";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Delete coupons first to avoid foreign key constraints
  await prisma.coupon.deleteMany({});
  console.log("🗑️  Cleared existing coupons");

  // Seed in order of dependencies
  await seedRoles(prisma);
  await seedSizes(prisma);
  await seedColors();
  await seedCategories(prisma);
  // await seedGroups(prisma);
  // await seedOrganizations(prisma);
  // await seedDepartments(prisma);
  // await seedDivisions(prisma);
  await seedUsers(prisma);
  await seedCoupons();
  // await seedTransferTypesLive(prisma);
  // await seedProducts(prisma);
  // await seedTransferTypes(prisma);

  console.log("✅ Seeding completed");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
