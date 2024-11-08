import { PrismaClient } from '@prisma/client';

const dbCollaborator = (db: PrismaClient) => ({
    async get() {
        return db.collaborator.findMany({
            include: {
                Outputs: {
                    include:{
                        Product: true,
                    }
                },
            }
        });
    },

    async geta( id: string ) {
        return db.collaborator.findFirst({ where: { id } });
    },

    async create( data: {
        name: string;
        cpf: string;
        type: string;
        department: string;
        canRetreat: string;
    } ) {
        return db.collaborator.create({ data });
    },

    async update( id: string, data: {
        name: string;
        cpf: string;
        type: string;
        active: boolean;
        department: string;
        canRetreat: string;
    }) {
        return db.collaborator.update({ where: { id }, data });
    }
})

export default dbCollaborator;