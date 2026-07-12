// ============================================================================
// Prisma Client Singleton — AssetFlow
// ============================================================================
// Usage anywhere in the backend:
//   const { prisma } = require("../config/prisma");
//
// IMPORTANT: Always start your app/script with:
//   node --experimental-strip-types <file>
// Prisma 7 generates TypeScript-only output.
// ============================================================================

require("dotenv/config");
const { PrismaClient } = require("../generated/prisma/client.ts");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["warn", "error"],
});

module.exports = { prisma };
