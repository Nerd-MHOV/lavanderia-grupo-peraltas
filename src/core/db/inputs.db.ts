import { PrismaClient } from "@prisma/client";



interface inputODT {
    product_id: string,
    user_id: string,
    amount: number,
}
const dbInput = (db: PrismaClient) => ({
    async get() {
        return db.input.findMany();
    },

    async create(data: {
        product_id: string,
        user_id: string,
        amount: number,
    }) {
        return db.input.create({ data });
    },

    async delete(id: string) {
        return db.input.delete({ where: { id } });
    },

    async input({
        product_id,
        amount,
        user_id,
    }: inputODT) {

        return db.$transaction([
            db.inventory.upsert({
                where: { product_id },
                create: {
                    product_id,
                    amount
                },
                update: {
                    amount: {
                        increment: amount
                    }
                }
            }),
            db.input.create({
                data: {
                    amount,
                    product_id,
                    user_id,
                }
            }),
        ])
    }
})

export default dbInput;