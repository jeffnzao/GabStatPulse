/**
 * lib/prisma.ts
 * Client Prisma avec gestion gracieuse des erreurs de connexion.
 * En mode dev sans DB configurée → log un warning, ne crash pas.
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Vérifie si la DB est accessible.
 * Retourne false sans planter si la connexion échoue.
 */
export async function isDatabaseConnected(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("[PRISMA] Database not reachable — using mock data fallback");
    }
    return false;
  }
}
