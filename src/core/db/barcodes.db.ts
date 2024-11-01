
import { PrismaClient } from '@prisma/client';

const dbBarcodes = (db: PrismaClient) => ({
    async get() {
        return await db.barCode.findMany();
    },
    async create(data: {
        code: string,
        product_id: string,
    }) {
        const pbarcode = await db.barCode.create({data})
        return pbarcode
    },
    async createMany(data: {
        code: string,
        product_id: string,
    }[]) {
        const pbarcodes = await db.barCode.createMany({data})
        return pbarcodes
    },
    async delete(code: string) {
        const deleted = await db.barCode.delete({where: {code}})
        return deleted
    }
})

export default dbBarcodes;