'use server'
import { Collaborator_CanRetreat, Collaborator_Type } from "@/core/db/collaborators.db";
import db from "@/core/db/db"
import { revalidatePath } from "next/cache";

const updateCollaborator = async (data: {
    id: string;
    name: string;
    cpf: string;
    type: Collaborator_Type;
    active: boolean;
    department: string;
    canRetreat: Collaborator_CanRetreat[];
}) => {
    const updated = await db.collaborator.update(data.id, data)
    revalidatePath('/panel/collaborators')
    return updated;
}

export default updateCollaborator