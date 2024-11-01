
import { PrismaClient } from '@prisma/client';

const dbUser = (db: PrismaClient) => ({
    async create(data: {
        first_name: string,
        last_name: string,
        email: string,
        user: string
        passwd: string,
        level: number
    }) {
        const dbData = await db.user.create({ data })

        return { user: dbData }
    },

    async getByUser(data: { user: string }) {
        const dbData = await db.user.findUnique({
            where: {
                user: data.user
            }
        })

        if (!dbData) return null 
        return { user: dbData };
    },
})

export default dbUser;