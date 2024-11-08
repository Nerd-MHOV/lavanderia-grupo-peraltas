'use server'
import db from "@/core/db/db"
import { revalidatePath } from "next/cache";

const updateCollaborator = async (data: {
    id: string;
    name: string;
    cpf: string;
    type: string;
    active: boolean;
    department: string;
    canRetreat: string;
}) => {
    const updated = await db.collaborator.update(data.id, data)
    revalidatePath('/panel/collaborators')
    return updated;
}

export default updateCollaborator