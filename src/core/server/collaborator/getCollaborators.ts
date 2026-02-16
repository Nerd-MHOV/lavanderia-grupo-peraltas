'use server'
import db from "@/core/db/db";
import { BarCode, Collaborator, Output, Product, ReturnOrder } from "@prisma/client";

const getCollaborators = async (activeOnly = true): Promise<{
    collaborators: GetCollaboratorsInterface['collaborators'][];
}> => {
    const collaborators = await db.collaborator.get();
    return {
        collaborators: activeOnly
            ? collaborators.filter(collaborator => collaborator.active)
            : collaborators
    };
}

export interface GetCollaboratorsInterface {
    collaborators: ({
        Outputs: ({
            Product: Product & { BarCodes: BarCode[] },
            ReturnOrder: ReturnOrder[]
        } & Output)[];
    } & Collaborator)
}

export default getCollaborators;