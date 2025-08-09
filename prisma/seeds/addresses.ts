import { PrismaClient } from "@/app/generated/prisma";

export async function seedAddresses(prisma: PrismaClient) {
  console.log("Seeding addresses...");

  // First, get some existing users
  const users = await prisma.user.findMany({
    where: {
      email: {
        in: ["admin@example.com", "user@example.com", "john.doe@example.com"],
      },
    },
  });

  if (users.length === 0) {
    console.log("No users found for address seeding");
    return;
  }

  // Sample addresses for each user
  const addressData = [
    {
      user_id: users[0].id, // admin@example.com
      first_name: "Admin",
      last_name: "User",
      address1: "123 Main Street",
      address2: "Apartment 4B",
      city: "Colombo",
      state: "Western Province",
      postal_code: "00100",
      country: "Sri Lanka",
      phone: "+94 11 123 4567",
      is_default: true,
    },
    {
      user_id: users[0].id, // admin@example.com - second address
      first_name: "Admin",
      last_name: "User",
      company: "Tech Company Ltd",
      address1: "456 Business Avenue",
      city: "Kandy",
      state: "Central Province",
      postal_code: "20000",
      country: "Sri Lanka",
      phone: "+94 81 987 6543",
      is_default: false,
    },
  ];

  // Add addresses for other users if they exist
  if (users[1]) {
    addressData.push({
      user_id: users[1].id, // user@example.com
      first_name: "Regular",
      last_name: "User",
      address1: "789 User Street",
      city: "Galle",
      state: "Southern Province",
      postal_code: "80000",
      country: "Sri Lanka",
      phone: "+94 91 456 7890",
      is_default: true,
    });
  }

  if (users[2]) {
    addressData.push({
      user_id: users[2].id, // john.doe@example.com
      first_name: "John",
      last_name: "Doe",
      address1: "321 Home Lane",
      address2: "House No. 15",
      city: "Negombo",
      state: "Western Province",
      postal_code: "11500",
      country: "Sri Lanka",
      phone: "+94 31 234 5678",
      is_default: true,
    });
  }

  // Create addresses
  for (const address of addressData) {
    try {
      await prisma.address.create({
        data: address,
      });
      console.log(
        `✅ Created address for ${address.first_name} ${address.last_name} in ${address.city}`
      );
    } catch (error) {
      console.log(
        `❌ Error creating address for ${address.first_name}: ${error}`
      );
    }
  }

  console.log("✅ Address seeding completed!");
}
