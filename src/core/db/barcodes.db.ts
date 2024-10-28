
import { PrismaClient } from '@prisma/client';

const dbBarcodes = (db: PrismaClient) => ({
    async get() {
        return await db.barCode.findMany();
    }
})

export default dbBarcodes;