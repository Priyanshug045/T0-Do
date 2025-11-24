// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client"

// 1️⃣ Declare a global variable so we don’t create multiple Prisma instances in dev
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

// 2️⃣ Create a new PrismaClient if not already created
export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  })

// 3️⃣ In development, store the Prisma instance in the global variable
if (process.env.NODE_ENV === "development") global.__prisma = prisma