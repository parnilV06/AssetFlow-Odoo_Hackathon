// ============================================================================
// Prisma Configuration — AssetFlow
// https://www.prisma.io/docs/orm/reference/prisma-config-reference
// ============================================================================
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/prisma/schema.prisma",
  migrations: {
    path: "src/prisma/migrations",
    seed: "node --experimental-strip-types src/prisma/seed.js",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
