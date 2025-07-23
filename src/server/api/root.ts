import {authRouter} from "@/server/api/routers/auth";
import {createCallerFactory, createTRPCRouter} from "@/server/api/trpc";
import {customerRouter} from "@/server/api/routers/customer";
import {orderRouter} from "@/server/api/routers/order";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    auth: authRouter,
    customer: customerRouter,
    order: orderRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
