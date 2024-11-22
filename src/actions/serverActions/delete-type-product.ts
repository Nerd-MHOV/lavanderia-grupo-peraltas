'use server'
import db from "@/core/db/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function actionDeleteTypeProduct(type: string) {
    try {
        await db.type.delete(type);
    } catch (error) {
        console.log(error)
        const message = (error as { message?: string })?.message?.includes(`products_type_fkey (index)`)
        ? 'Tag não pode ser deletada! pois está associado a um ou mais produtos.'
        :(error as { message?: string })?.message || 'Erro ao deletar tag';
        return { message: message, success: false };
    }

    revalidatePath('/panel/products')
    revalidatePath('/panel/collaborators')
    redirect('/panel/collaborators')
}