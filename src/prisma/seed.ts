import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  // Clear data in correct order
  await prisma.user.deleteMany();
  // Create user with hashed password
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@invoice.com",
      password: adminPassword,
      status: "active",
      created_by: "System",
    },
  });

  console.log("🌱 Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
