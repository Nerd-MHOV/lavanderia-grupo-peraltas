import { PrismaClient } from "@prisma/client";

const dbInventory = (db: PrismaClient) => ({
    async get() {
        return await db.inventory.findMany();
    },
    async getByProduct( product_id: string ) {
        return await db.inventory.findFirst({
            where: { product_id }
        })
    },
    async upsert(id: string, data: {
        product_id: string,
        amount: number,
    }) {
        return await db.inventory.upsert({
            where: { id },
            update: data,
            create: data,
        });
    },
    async update(id: string, data: {
        product_id: string,
        amount: number,
    }) {
        return await db.inventory.update({
            where: { id },
            data
        });
    }
})

export default dbInventory;