import { PrismaClient } from "../../app/generated/prisma";
import { parse } from "csv-parse";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type IRole = {
  name: string;
};

export async function seedRoles(prisma: PrismaClient) {
  console.log("Seeding roles...");

  const csvFilePath = path.resolve(__dirname, "./csv/roles.csv");
  console.log(csvFilePath);

  const roles = await new Promise((resolve, reject) => {
    const results: IRole[] = [];

    fs.createReadStream(csvFilePath)
      .pipe(
        parse({
          delimiter: ",",
          columns: true,
          skip_empty_lines: true,
        })
      )
      .on("data", (data) => {
        results.push({
          name: data.name,
        });
      })
      .on("error", (error) => reject(error))
      .on("end", () => resolve(results));
  });

  // console.log(districts);
  // Clear existing data
  await prisma.role.deleteMany({});

  await prisma.role.createMany({
    data: roles as IRole,
  });

  console.log(`✅ Seeded ${(roles as IRole[]).length} roles`);
}
