import prisma from "../../lib/prisma";
import { Decimal } from "../../app/generated/prisma/runtime/library";

export const couponsData = [
  {
    code: "WELCOME10",
    type: "PERCENTAGE" as const,
    value: new Decimal(10),
    description: "Welcome discount for new customers",
    usage_limit: 100,
    usage_limit_per_user: 1,
    is_active: true,
    starts_at: new Date(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    minimum_amount: new Decimal(5000), // LKR 5,000
    maximum_amount: null,
  },
  {
    code: "SAVE2000",
    type: "FIXED_AMOUNT" as const,
    value: new Decimal(2000), // LKR 2,000
    description: "Save LKR 2,000 on your next purchase",
    usage_limit: 50,
    usage_limit_per_user: 2,
    is_active: true,
    starts_at: new Date(),
    expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    minimum_amount: new Decimal(10000), // LKR 10,000
    maximum_amount: null,
  },
  {
    code: "FREESHIP",
    type: "FREE_SHIPPING" as const,
    value: new Decimal(0),
    description: "Free shipping on any order",
    usage_limit: null,
    usage_limit_per_user: 3,
    is_active: true,
    starts_at: new Date(),
    expires_at: null,
    minimum_amount: new Decimal(2500), // LKR 2,500
    maximum_amount: null,
  },
  {
    code: "SUMMER25",
    type: "PERCENTAGE" as const,
    value: new Decimal(25),
    description: "Summer sale - 25% off everything",
    usage_limit: 200,
    usage_limit_per_user: 1,
    is_active: true,
    starts_at: new Date(),
    expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    minimum_amount: null,
    maximum_amount: new Decimal(100000), // LKR 100,000
  },
  {
    code: "EXPIRED10",
    type: "PERCENTAGE" as const,
    value: new Decimal(10),
    description: "Expired coupon for testing",
    usage_limit: 10,
    usage_limit_per_user: 1,
    is_active: true,
    starts_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    expires_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    minimum_amount: null,
    maximum_amount: null,
  },
  {
    code: "INACTIVE15",
    type: "PERCENTAGE" as const,
    value: new Decimal(15),
    description: "Inactive coupon for testing",
    usage_limit: 20,
    usage_limit_per_user: 1,
    is_active: false,
    starts_at: new Date(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    minimum_amount: new Decimal(7500), // LKR 7,500
    maximum_amount: null,
  },
];

export const seedCoupons = async () => {
  try {
    console.log("🎫 Seeding coupons...");

    // Get the first admin user to assign as creator
    const adminUser = await prisma.user.findFirst({
      where: {
        email: "admin@example.com", // Use specific admin email
      },
    });

    if (!adminUser) {
      console.log("❌ No admin user found. Please seed users first.");
      return;
    }

    // Coupons are already cleared in main seed function

    const coupons = await Promise.all(
      couponsData.map((couponData) =>
        prisma.coupon.create({
          data: {
            ...couponData,
            created_by: adminUser.id,
          },
        })
      )
    );

    console.log(`✅ Created ${coupons.length} coupons`);
    return coupons;
  } catch (error) {
    console.error("❌ Error seeding coupons:", error);
    throw error;
  }
};
