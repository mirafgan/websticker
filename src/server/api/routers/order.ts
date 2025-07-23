import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {z} from "zod";

export const orderRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({
            name: z.string(),
            quantity: z.number(),
            size: z.string(),
            price: z.number(),
            material: z.string(),
            notes: z.string(),
            customerId: z.number()
        }))
        .mutation(async ({ctx, input}) => {
                try {
                    const {name, quantity, size, price, material, notes, customerId} = input;
                    await
                        ctx.db.orders.create({
                            data: {
                                name,
                                quantity,
                                size,
                                price,
                                material,
                                notes,
                                statusId: 1,
                                customerId
                            }
                        })
                } catch (e) {
                    console.log(e)
                }
            }
        )
})