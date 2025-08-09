import { PrismaClient } from "./app/generated/prisma";

const prisma = new PrismaClient();

async function createTestUser() {
  console.log("Creating test user without addresses...");

  try {
    // First check if user exists
    let user = await prisma.user.findUnique({
      where: { email: "test@example.com" },
    });

    if (!user) {
      // Create test user
      user = await prisma.user.create({
        data: {
          email: "test@example.com",
          name: "Test User",
          password:
            "$2a$10$CwTycUXWue0Thq9StjUM0uJ8eQ6hIIpSxf5QGMqhF6.HgdtFfWOBO", // Test@123
        },
      });
      console.log("✅ Created test user:", user.email);
    } else {
      console.log("✅ Test user already exists:", user.email);
    }

    // Delete any existing addresses for this user to test the "no addresses" scenario
    await prisma.address.deleteMany({
      where: { user_id: user.id },
    });
    console.log("🗑️  Cleared addresses for test user");

    console.log("✅ Test user ready for checkout testing");
    console.log("📧 Email: test@example.com");
    console.log("🔑 Password: Test@123");
  } catch (error) {
    console.error("❌ Error creating test user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
