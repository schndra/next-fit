import { parse } from "csv-parse";
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@/app/generated/prisma";
import { hashPassword } from "@/lib/encrypt";

type IUser = {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  name: string;
  phone?: string;
  roles: string[];
};

export async function seedUsers(prisma: PrismaClient) {
  console.log("Seeding users...");

  const csvFilePath = path.resolve(__dirname, "./csv/users.csv");
  console.log(csvFilePath);

  const users = await new Promise<IUser[]>((resolve, reject) => {
    const results: IUser[] = [];

    fs.createReadStream(csvFilePath)
      .pipe(
        parse({
          delimiter: ",",
          columns: true,
          skip_empty_lines: true,
        })
      )
      .on("data", (data) => {
        // Parse roles as comma-separated values within quotes
        const roles = data.roles
          ? data.roles.split("|").map((r: string) => r.trim())
          : ["ROLE_USER"];

        results.push({
          email: data.email,
          password: data.password,
          first_name: data.first_name,
          last_name: data.last_name,
          name: data.first_name + " " + data.last_name,
          phone: data.mobile, // Map mobile to phone field
          roles,
        });
      })
      .on("error", (error) => reject(error))
      .on("end", () => resolve(results));
  });

  // Clear existing data
  await prisma.user.deleteMany({});

  // Create users with roles only
  for (const user of users) {
    // Hash password using the encrypt function
    const hashedPassword = await hashPassword(user.password);

    // Create user
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        first_name: user.first_name,
        last_name: user.last_name,
        name: user.name,
        phone: user.phone,
        roles: {
          connect: user.roles.map((roleName) => ({ name: roleName })),
        },
      },
    });

    console.log(`Created user: ${createdUser.email}`);
  }

  console.log(`✅ Seeded ${users.length} users`);
}
