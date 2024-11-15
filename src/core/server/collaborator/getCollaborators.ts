'use server'
import db from "@/core/db/db";
import { verifySession } from "@/lib/session";
import { Collaborator, Output, Product } from "@prisma/client";

const getCollaborators = async (): Promise<{
    collaborators: GetCollaboratorsInterface['collaborators'][];
}>=> {
    await verifySession();
    const collaborators = await db.collaborator.get();
    return { collaborators };
}

export interface GetCollaboratorsInterface {
    collaborators: ({
        Outputs: ({
            Product: Product
        } & Output)[];
    } & Collaborator)
}

export default getCollaborators;