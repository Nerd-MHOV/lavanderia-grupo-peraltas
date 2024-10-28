'use server'
import db from "@/core/db/db";
import { verifySession } from "@/lib/session";

const getCollaborators = async () => {
    await verifySession();
    const collaborators = await db.collaborator.get();
    return { collaborators };
}

export default getCollaborators;