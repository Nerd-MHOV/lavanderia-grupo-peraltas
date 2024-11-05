import { PrismaClient } from '@prisma/client';

const dbProduct = (db: PrismaClient) => ({
    async get() {
        return db.product.findMany({
            include: {
                BarCodes: true,
                Inventory: true,
            }
        });
    },
    async getById(id: string) {
        return db.product.findUnique({ 
            where: { id },
            include: { BarCodes: true, Input: {
                include: { User: true }
            }, Output: {
                include: { Collaborator: true }
            }, Inventory: true } 
        });
    },
    async create(data: {
        product: string,
        size: string,
        unitary_value: number,
        service: string,
        type: string,
        toSector: boolean,
    }) {
        const dbData = await db.product.create({ data })
        return { product: dbData }
    },
    async update(data:{
        id: string,
        product: string,
        size: string,
        unitary_value: number,
        service: string,
        type: string,
    }) {
        const dbData = await db.product.update({
            where: { id: data.id },
            data: data
        })
        return { product: dbData }
    }
    
})

export default dbProduct;