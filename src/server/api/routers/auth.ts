import {z} from "zod";

import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import {cookies} from "next/headers";


export const authRouter = createTRPCRouter({
    login: publicProcedure
        .input(z.object({
            email: z.string().email(),
            password: z.string().min(6)
        }))
        .mutation(async ({input, ctx}) => {
            try {
                const user = await ctx.db.user.findFirstOrThrow({where: {email: input.email}});

                const parsedPassword = await bcrypt.compare(input.password, user.password);
                if (!parsedPassword) return ({
                    error: {
                        status: 401,
                        message: "Authentication failed",
                        details: "Invalid password"
                    },
                    user: null
                });
                if (parsedPassword) {
                    const token = jwt.sign(
                        {
                            id: user.id,
                            email: user.email,
                            role: user.role,
                        },
                        process.env.JWT_SECRET as string,
                        {
                            expiresIn: "30d",
                        }
                    );
                    return ({token, user})
                }
            } catch (e) {
                return ({
                    message: "User does not exist",
                    user: null
                })
            }
        }),
    create: publicProcedure
        .input(z.object({
            email: z.string().email(),
            password: z.string().min(6),
            name: z.string(),
        }))
        .mutation(async ({ctx, input}) => {
            const hashedPassword = await bcrypt.hash(input.password, 10)
            try {
                const res = await ctx.db.user.create({
                    data: {
                        name: input.name,
                        email: input.email,
                        emailVerified: false,
                        password: hashedPassword,
                        username: input.name.split("@")[0],
                        role: "user",
                        banned: false
                    },
                });
                return ({
                    message: "User Create successfully",
                    id: res.id
                })
            } catch (e) {
                console.log(e);
                return ({
                    message: "Something went wrong",
                    error: e
                })
            }
        }),
    getUser: publicProcedure.query(async ({ctx}) => {
        const cookieStore = await cookies();
        const token = cookieStore.get("Authorization")?.value as string;
        if (!token) return ({token: null, message: "Unauthenticated", status: 401});
        const verify = jwt.verify(token, process.env.JWT_SECRET as string) as {
            email: string;
            exp: number;
            iat: number;
            id: number;
            role: string
        };
        if (!verify) return ({token: null, message: "Unauthenticated", status: 401});
        try {
            const user = await ctx.db.user.findFirst({where: {id: verify.id}});
            return ({success: true, user});
        } catch (e) {
            console.log(e);
            return ({token: null, message: "Unauthenticated", status: 401});
        }
    })
});
