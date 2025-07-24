import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {z} from "zod";

export const orderRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({
            notes: z.string(),
            customerId: z.number(),
            products: z.array(z.object({
                name: z.string(),
                quantity: z.number(),
                size: z.string(),
                material: z.string(),
                price: z.number(),
            })),
            total: z.number(),
        }))
        .mutation(async ({ctx, input}) => {
                try {
                    const {notes, customerId, total} = input;

                    const products = input.products.map(product => ({
                        name: product.name,
                        material: product.material,
                        size: product.size,
                        price: product.price,
                    }));
                    const order = await
                        ctx.db.order.create({
                            data: {
                                notes,
                                total,
                                statusId: 1,
                                customerId,
                                products: {
                                    create: products
                                }
                            }
                        });

                    return {message: "Order created successfully", order}
                } catch (e) {
                    console.log(e);
                    return ({message: "Something went wrong"})
                }
            }
        ),
    getOrderDetail: publicProcedure
        .input(z.object({
            id: z.number()
        }))
        .query(async ({input, ctx}) => {
            try {
                const order = await ctx.db.order.findFirst({where: {id: input.id}});
                return {message: "Order found", order}
            } catch (e) {
                console.log(e)
                return ({message: "Not Found", status: 404, order: null})
            }
        }),
    getAllOrders: publicProcedure
        .query(async ({ctx}) => {
            try {
                const orders = await ctx.db.order.findMany({
                    where: {deletedAt: null},
                    select: {
                        products: true,
                        status: true,
                        contact: true,
                        id: true,
                        total: true,
                        notes: true,
                        createdAt: true
                    }
                });
                return {message: "Orders found", data: orders}
            } catch (e) {
                console.log(e);
                return ({message: "Not Found", status: 404, data: []})
            }
        }),
    deleteOrder: publicProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({input, ctx}) => {
            try {
                const customer = await ctx.db.customer.update({where: {id: input.id}, data: {deletedAt: new Date()}});
                return {message: "Order successfully deleted", customer}
            } catch (e) {
                console.log(e)
                return ({message: "Not Found", status: 404, customer: null})
            }
        })
})