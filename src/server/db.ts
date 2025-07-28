import {PrismaClient} from "@prisma/client";

import {env} from "@/env";

const createPrismaClient = () =>
    new PrismaClient({
        log:
            env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

const globalForPrisma = globalThis as unknown as {
    prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();


db.$use(async (params, next) => {
    if (params.model === "Customer") {
        if (params.args.data?.deletedAt && params.action === "update") {
            params.args["data"].deletedAt = new Date();
            await db.order.updateMany({where: {customerId: params.args.where.id}, data: {deletedAt: new Date()}});
            return next(params);
        }
    }
    console.log(params)
    return next(params);
})
if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
