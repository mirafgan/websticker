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
                    const order = await
                        ctx.db.order.create({
                            data: {
                                notes,
                                total,
                                statusId: 1,
                                customerId,
                                products: {
                                    create: input.products
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
    getAllOrdersStatus: publicProcedure.query(async ({ctx}) => {
        try {
            const statuses = await ctx.db.orderStatus.findMany({where: {deletedAt: null}});
            return ({message: "Statuses found", data: statuses})
        } catch (e) {
            console.log(e)
            return ({message: "Not Found", status: 404, data: []})
        }
    }),
    getAllOrders: publicProcedure
        .query(async ({ctx}) => {
            try {
                const orders = await ctx.db.order.findMany({
                    where: {deletedAt: null},
                    select: {
                        products: {
                            select: {
                                id: true,
                                name: true,
                                quantity: true,
                                size: true,
                                material: true,
                                price: true,
                            }
                        },
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
    updateOrderStatus: publicProcedure
        .input(z.object({
            id: z.number(),
            statusId: z.number()
        }))
        .mutation(async ({input, ctx}) => {
            try {
                const {id, statusId} = input
                await ctx.db.order.update({where: {id}, data: {statusId}});
                return ({message: "Order status updated successfully"})
            } catch (e) {
                console.log(e);
                return ({message: "Something went wrong"})
            }
        }),
    updateOrder: publicProcedure
        .input(z.object({
            id: z.number(),
            notes: z.string(),
            customerId: z.number(),
            total: z.number(),
            products: z.array(z.object({
                id: z.number(),
                name: z.string(),
                quantity: z.number(),
                size: z.string(),
                material: z.string(),
                price: z.number(),
            })),
        }))
        .mutation(async ({ctx, input}) => {
            try {
                const updateProductsQueries = input.products.map(({id, ...rest}) =>
                    id > 0 ? ctx.db.product
                        .update({
                            where: {id},
                            data: {...rest},
                        }) : ctx.db.product
                        .create({
                            data: {...rest, orderId: input.id},
                        })
                );

                await ctx.db.$transaction([
                    ...updateProductsQueries,
                    ctx.db.order.update({
                        where: {id: input.id},
                        data: {notes: input.notes, customerId: input.customerId, total: input.total}
                    })
                ])

            } catch (e) {
                console.log(e)
            }
        }),
    deleteOrder: publicProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({input, ctx}) => {
            try {
                const customer = await ctx.db.order.update({where: {id: input.id}, data: {deletedAt: new Date()}});
                return {message: "Order successfully deleted", customer}
            } catch (e) {
                console.log(e)
                return ({message: "Not Found", status: 404, customer: null})
            }
        })
})