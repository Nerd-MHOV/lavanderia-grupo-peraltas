'use server'
import db from "@/core/db/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function actionDeleteProduct(product_id: string) {
    try {
        await db.product.delete(product_id);
    } catch (error) {
        console.log(error)
        const message = (error as { message?: string })?.message?.includes('outputs_product_id_fkey (index)')
        ? 'Produto não pode ser deletado! pois está associado a uma ou mais retiradas.'
        :(error as { message?: string })?.message || 'Erro ao deletar produto';
        return { message: message, success: false };
    }

    revalidatePath('/panel/products')
    redirect('/panel/products')
}