'use server'
import db from "@/core/db/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function actiondeleteCollaborator(collaborator_id: string) {
    try {
        await db.collaborator.delete(collaborator_id);
    } catch (error) {
        console.log(error)
        const message = (error as { message?: string })?.message?.includes('outputs_collaborator_id_fkey (index)')
        ? 'O Colaborador não pode ser deletado! pois está associado a uma ou mais retiradas.'
        :(error as { message?: string })?.message || 'Erro ao deletar produto';
        return { message: message, success: false };
    }

    revalidatePath('/panel/collaborators')
    redirect('/panel/collaborators')
}