import {PrismaClient} from "@/generated/prisma/client";

import {env} from "@/env";
import {withAccelerate} from "@prisma/extension-accelerate";

// const adapter = new PrismaPg({connectionString: env.DATABASE_PRISMA_DATABASE_URL})
const createPrismaClient = () =>
    new PrismaClient({
        log:
            env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    }).$extends(withAccelerate());

const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
