import db from "@/core/db/db";
import { verifySession } from "@/lib/session"
import { Collaborator } from "@prisma/client";

const getaCollaborator = async (id: string) => {
    await verifySession();
    const collaborator = await db.collaborator.geta(id);
    return { collaborator }
}

export interface GetaCollaboratorInterface {
    collaborator: Collaborator
}

export default getaCollaborator