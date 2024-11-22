
import { PrismaClient } from '@prisma/client';

const dbType = (db: PrismaClient) => ({
    async create(data: {
        type: string,
    }) {
        const dbData = await db.type.create({ data })
        return { type: dbData }
    },
    async get() {
        const dbData = await db.type.findMany()
        return { type: dbData }
    },
    async delete(type: string) {
        const dbData = await db.type.delete({ where: { type } })
        return { type: dbData }
    }
})

export default dbType;