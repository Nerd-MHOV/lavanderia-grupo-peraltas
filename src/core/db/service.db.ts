
import { PrismaClient } from '@prisma/client';

const dbService = (db: PrismaClient) => ({
    async create(data: {
        service: string,
    }) {
        const dbData = await db.service.create({ data })
        return { service: dbData }
    },
    async get() {
        const dbData = await db.service.findMany()
        return { service: dbData }
    } 
})

export default dbService;