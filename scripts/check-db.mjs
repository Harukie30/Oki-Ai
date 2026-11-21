import path from "node:path"
import { PrismaClient } from "@prisma/client"

const url = `file:${path.join(process.cwd(), "prisma", "dev.db")}`
const prisma = new PrismaClient({
  datasources: { db: { url } },
})

const count = await prisma.user.count()
console.log("users", count)
await prisma.$disconnect()
