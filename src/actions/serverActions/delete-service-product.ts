'use server'
import db from "@/core/db/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function actionDeleteServiceProduct(service: string) {
    try {
        await db.service.delete(service);
    } catch (error) {
        console.log(error)
        const message = (error as { message?: string })?.message?.includes(`products_service_fkey (index)`)
        ? 'Marca não pode ser deletada! pois está associado a um ou mais produtos.'
        :(error as { message?: string })?.message || 'Erro ao deletar marca';
        return { message: message, success: false };
    }

    revalidatePath('/panel/products')
    revalidatePath('/panel/collaborators')
    redirect('/panel/products')
}