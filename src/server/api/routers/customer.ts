import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {z} from "zod";

export const customerRouter = createTRPCRouter({
    createCustomer: publicProcedure
        .input(z.object({
            name: z.string(),
            surname: z.string(),
            email: z.string().email(),
            company: z.string().nullable(),
            contact: z.string(),
            cargoAddress: z.string(),
            billingAddress: z.string(),
            ico: z.number().nullable(),
            dico: z.string().nullable(),
            country: z.string(),
        }))
        .mutation(async ({ctx, input}) => {
                try {
                    const {
                        name,
                        email,
                        ico,
                        dico,
                        billingAddress,
                        cargoAddress,
                        company,
                        contact,
                        surname,
                        country
                    } = input;

                    const customer = await
                        ctx.db.customer.create({
                            data: {
                                name,
                                email,
                                ico,
                                dico,
                                billingAddress,
                                cargoAddress,
                                company,
                                contact,
                                surname,
                                country
                            }
                        });
                    return ({message: "Customer created successfully", customer})
                } catch (e) {
                    console.log(e)
                    return ({message: "Something went wrong"})
                }
            }
        ),
    getAllCustomer: publicProcedure.query(async ({ctx}) => {
        try {
            const customers = await ctx.db.customer.findMany({where: {deletedAt: null}});
            return {message: "Customers found", data: customers}
        } catch (e) {
            console.log(e);
            return ({message: "Not Found", status: 404, data: []})
        }
    }),
    getCustomerDetail: publicProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({input, ctx}) => {
            try {
                const customer = await ctx.db.customer.findFirst({where: {id: input.id}});
                return {message: "Customer found", customer}
            } catch (e) {
                console.log(e)
                return ({message: "Not Found", status: 404, customer: null})
            }
        }),

    deleteCustomer: publicProcedure
        .input(z.object({
            id: z.number()
        }))
        .mutation(async ({input, ctx}) => {
            try {
                const customer = await ctx.db.customer.update({where: {id: input.id}, data: {deletedAt: new Date()}});
                return {message: "Customer successfully deleted", customer}
            } catch (e) {
                console.log(e)
                return ({message: "Not Found", status: 404, customer: null})
            }
        })

})