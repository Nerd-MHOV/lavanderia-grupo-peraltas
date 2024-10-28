import { PrismaClient } from '@prisma/client';

const dbCollaborator = (db: PrismaClient) => ({
    async get() {
        return db.collaborator.findMany();
    },

    async geta( id: string ) {
        return db.collaborator.findFirst({ where: { id } });
    }
})

export default dbCollaborator;