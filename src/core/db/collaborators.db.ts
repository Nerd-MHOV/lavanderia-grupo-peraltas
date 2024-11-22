import { PrismaClient } from '@prisma/client';

const dbCollaborator = (db: PrismaClient) => ({
    async get() {
        return db.collaborator.findMany({
            include: {
                Outputs: {
                    include: {
                        Product: true,
                    }
                },
            },
            orderBy: [
                { name: 'asc' },
                { department: 'asc' }
            ]
        });
    },

    async geta(id: string) {
        return db.collaborator.findFirst({ where: { id } });
    },

    async create(data: {
        name: string;
        cpf: string;
        type: Collaborator_Type,
        department: string;
        canRetreat: Collaborator_CanRetreat[];
    }) {
        return db.collaborator.create({ data });
    },

    async update(id: string, data: {
        name: string;
        cpf: string;
        type: Collaborator_Type;
        active: boolean;
        department: string;
        canRetreat: Collaborator_CanRetreat[];
    }) {
        return db.collaborator.update({
            where: { id }, data: {
                name: data.name,
                cpf: data.cpf,
                type: data.type,
                active: data.active,
                department: data.department,
                canRetreat: data.canRetreat,
            }
        });
    },

    async delete(id: string) {
        return db.collaborator.delete({ where: { id } });
    }
});

export type Collaborator_Type = 'diarista' | 'pj' | 'registrado';
export type Collaborator_CanRetreat = 'collaborator' | 'department';

export default dbCollaborator;