import { PrismaClient } from '@prisma/client';

const dbProduct = (db: PrismaClient) => ({
    async get() {
        return db.product.findMany({
            include: {
                BarCodes: true
            }
        });
    }
})

export default dbProduct;