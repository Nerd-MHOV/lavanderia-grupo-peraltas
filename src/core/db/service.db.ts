
import { PrismaClient } from '@prisma/client';

const dbService = (db: PrismaClient) => ({
    async create(data: {
        service: string,
    }) {
        const dbData = await db.service.create({ data })
        return { service: dbData }
    },
    async get() {
        const dbData = await db.service.findMany({
            orderBy: { service: 'asc' }
        })
        return { service: dbData }
    },
    async delete(service: string) {
        const dbData = await db.service.delete({ where: { service } })
        return { service: dbData }
    }
})

export default dbService;