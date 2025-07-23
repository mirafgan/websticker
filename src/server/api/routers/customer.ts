import {createTRPCRouter, publicProcedure} from "@/server/api/trpc";
import {z} from "zod";

export const customerRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({
            name: z.string(),
            surname: z.string(),
            email: z.string().email(),
            company: z.string().optional(),
            contact: z.string(),
            cargoAddress: z.string(),
            billingAddress: z.string(),
            ico: z.number().optional(),
            dico: z.string().optional(),
        }))
        .mutation(async ({ctx, input}) => {
                try {
                    const {name, email, ico, dico, billingAddress, cargoAddress, company, contact, surname} = input
                    await
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
                                surname
                            }
                        })
                } catch (e) {
                    console.log(e)
                }
            }
        )
})