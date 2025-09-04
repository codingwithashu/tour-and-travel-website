import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
    return { userId: "user_123" };
});
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

// Middleware to catch unexpected errors
const errorMiddleware = t.middleware(async ({ path, next }) => {
    try {
        return await next();
    } catch (err) {
        console.error(`❌ tRPC failed on ${path}:`, err);

        if (err instanceof TRPCError) {
            throw err;
        }

        // Otherwise wrap it
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Please try again later.",
            cause: err,
        });
    }
});

export const baseProcedure = t.procedure;

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
