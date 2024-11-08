'use server'
import db from "@/core/db/db";
import { verifySession } from "@/lib/session";

const getCollaborators = async () => {
    await verifySession();
    const collaborators = await db.collaborator.get();
    return { collaborators };
}

export interface GetCollaboratorsInterface {
    collaborators: ({
        Outputs: ({
            Product: {
                product: string;
                id: string;
                type: string;
                createdAt: Date;
                updatedAt: Date;
                service: string;
                size: string;
                unitary_value: number;
                finality: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            product_id: string;
            collaborator_id: string;
            user_id: string;
            finality: string;
            amount: number;
            status: boolean;
            obs: string;
            expiration: boolean;
            collaboratorId: string | null;
        })[];
    } & {
        id: string;
        name: string;
        cpf: string;
        type: string;
        active: boolean;
        department: string;
        canRetreat: string;
        createdAt: Date;
        updatedAt: Date;
    })
}

export default getCollaborators;