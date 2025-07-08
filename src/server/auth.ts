import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/server/db";
import { username, admin,  } from "better-auth/plugins";
import { env } from "@/env";
import { headers } from "next/headers";
import { nextCookies } from "better-auth/next-js";

const colors = {
    info: "\x1b[36m",
    warn: "\x1b[33m",
    error: "\x1b[31m",
    debug: "\x1b[34m",
    reset: "\x1b[0m",
};

export const auth = betterAuth({
    database: prismaAdapter(db, { provider: "postgresql" }),
    plugins: [username(), admin(),  nextCookies()],
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        autoSignIn: false,
        maxPasswordLength: 32,
    },
    logger: {
        level: env.NODE_ENV === "development" ? "debug" : "error",
        log(level, message, ...args) {
            const timestamp = new Date().toISOString();
            const color = colors[level] || colors.info;
            const levelLabel = `[${level.toUpperCase()}]`;

            console.log(
                `${color}${levelLabel}${colors.reset} ${timestamp} - ${message}`
            );

            if (args.length > 0) {
                console.log(
                    `${colors.debug}Additional Arguments:${colors.reset}`,
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    ...args
                );
            }
        },
    },
    databaseHooks: {
        user: {
            create: {
                async before(_) {
                    return undefined;
                },
            },
        },
        account: {
            create: {
                async before(_) {
                    return undefined;
                },
            },
        },
    },
});

export async function getServerSession() {
    const _headers = await headers();

    console.log(_headers.get("cookie"))

    return auth.api.getSession({
        headers: _headers,
    });
}