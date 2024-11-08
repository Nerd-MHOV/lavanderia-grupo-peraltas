import { Output, PrismaClient } from "@prisma/client"

const dbReturn = (db: PrismaClient) => ({
    async get() {
        return await db.return.findMany();
    },
    async create(data: {
        product_id: string,
        user_id: string,
        collaborator_id_in: string,
        collaborator_id_out: string,
        finality: string,
        amount: number,
        amount_has: number,
        amount_bad: number,
        status_in: boolean,
        status_out: boolean,
        obs_in: string,
        obs_out: string,
        date_in: Date,
    }) {
        return await db.return.create({ data });
    },

    async returnProduct(output: Output, quantity: number, product_id: string, collaborator_id: string, user_id: string) {

        const data = {
            product_id,
            user_id,
            collaborator_id_in: output.collaborator_id,
            collaborator_id_out: collaborator_id,
            finality: output.finality,
            amount: quantity,
            amount_has: output.amount,
            amount_bad: 0,
            status_in: output.status,
            status_out: true,
            obs_in: output.obs,
            obs_out: 'return',
            date_in: output.updatedAt,
        }

        const outputData = (quantity === output.amount) 
            ? db.output.delete({ where: { id: output.id } }) 
            : db.output.update({ where: { id: output.id }, data: { amount: output.amount - quantity } })

        return await db.$transaction([
            db.return.create({ data }),
            db.inventory.update({
                where: { product_id },
                data: {
                    amount: {
                        increment: quantity
                    }
                }
            }),
            outputData
        ])
    }
})

export default dbReturn