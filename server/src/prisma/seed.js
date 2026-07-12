// ============================================================================
// Seed Script — AssetFlow
// ============================================================================
// Run:  npx prisma db seed
//
// Seeds the database with demo departments, categories, and an admin user
// so the team can start building features immediately.
// ============================================================================

require("dotenv/config");
const { PrismaClient } = require("../generated/prisma/client.ts");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database …");

  // ── Departments ──────────────────────────────────────────────────────────
  const departments = await Promise.all(
    [
      { name: "Engineering" },
      { name: "Human Resources" },
      { name: "Finance" },
      { name: "Marketing" },
      { name: "Operations" },
    ].map((dept) =>
      prisma.department.upsert({
        where: { name: dept.name },
        update: {},
        create: dept,
      })
    )
  );

  console.log(`✅ ${departments.length} departments seeded`);

  // ── Categories ───────────────────────────────────────────────────────────
  const categories = await Promise.all(
    [
      { name: "Laptops", description: "Portable computers" },
      { name: "Desktops", description: "Desktop workstations" },
      { name: "Monitors", description: "Display screens" },
      { name: "Projectors", description: "Meeting room projectors" },
      { name: "Printers", description: "Printers and scanners" },
      { name: "Phones", description: "Mobile devices and desk phones" },
      { name: "Furniture", description: "Desks, chairs, cabinets" },
      { name: "Vehicles", description: "Company vehicles" },
      { name: "Software Licenses", description: "Purchased software licenses" },
      { name: "Networking", description: "Routers, switches, access points" },
    ].map((cat) =>
      prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: cat,
      })
    )
  );

  console.log(`✅ ${categories.length} categories seeded`);

  // ── Admin User ───────────────────────────────────────────────────────────
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
  const hashedPassword = await bcrypt.hash("admin@123", saltRounds);

  const admin = await prisma.user.upsert({
    where: { email: "admin@assetflow.local" },
    update: {},
    create: {
      email: "admin@assetflow.local",
      password: hashedPassword,
      name: "System Admin",
      role: "ADMIN",
      departmentId: departments[0].id, // Engineering
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email}`);

  // ── Demo Users (one per role) ────────────────────────────────────────────
  const demoUsers = [
    {
      email: "manager@assetflow.local",
      name: "Asset Manager",
      role: "ASSET_MANAGER",
      departmentId: departments[4].id, // Operations
    },
    {
      email: "head@assetflow.local",
      name: "Department Head",
      role: "DEPARTMENT_HEAD",
      departmentId: departments[0].id, // Engineering
    },
    {
      email: "employee@assetflow.local",
      name: "Jane Employee",
      role: "EMPLOYEE",
      departmentId: departments[0].id, // Engineering
    },
  ];

  for (const u of demoUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        password: await bcrypt.hash("demo@123", saltRounds),
      },
    });
  }

  console.log(`✅ ${demoUsers.length} demo users seeded`);
  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
