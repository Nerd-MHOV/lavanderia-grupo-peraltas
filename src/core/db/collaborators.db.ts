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
        type: Collaborator_Type,
        department: string;
        canRetreat: Collaborator_CanRetreat[];
    } ) {
        return db.collaborator.create({ data });
    },

    async update( id: string, data: {
        name: string;
        cpf: string;
        type: Collaborator_Type;
        active: boolean;
        department: string;
        canRetreat: Collaborator_CanRetreat[];
    }) {
        return db.collaborator.update({ where: { id }, data });
    }
})

type Collaborator_Type = 'diarista' | 'pj' | 'registrado';
type Collaborator_CanRetreat = 'collaborator' | 'department';

export default dbCollaborator;