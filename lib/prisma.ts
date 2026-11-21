import path from "node:path"
import { PrismaClient } from "@prisma/client"

/**
 * Prisma CLI uses `file:./dev.db` (relative to prisma/).
 * Next.js must use an absolute file URL so SQLite can open the DB on Windows.
 */
function resolveDatabaseUrl() {
  const raw = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, "")
  if (raw && !raw.startsWith("file:")) {
    return raw
  }

  const absolute = path
    .join(process.cwd(), "prisma", "dev.db")
    .replace(/\\/g, "/")
  return `file:${absolute}`
}

const databaseUrl = resolveDatabaseUrl()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaUrl: string | undefined
}

if (globalForPrisma.prisma && globalForPrisma.prismaUrl !== databaseUrl) {
  void globalForPrisma.prisma.$disconnect()
  globalForPrisma.prisma = undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaUrl = databaseUrl
}
