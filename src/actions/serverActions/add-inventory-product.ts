'use server'
import makeInput from "@/core/server/inputs/makeInput";
import { AddInventoryProductSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
export interface StateActionAddInventoryProduct {  
    errors?: {
        amount?: string[] | undefined;
        product_id?: string[] | undefined;
    },
    message?: string;
    success?: boolean;
}
export async function actionAddInventoryProduct(state: StateActionAddInventoryProduct | null, formData: FormData) {
    // 1. validate fields
    const validationFormData = AddInventoryProductSchema.safeParse({
        amount: Number(formData.get('amount')),
        product_id: formData.get('product_id'),
    })
    if (!validationFormData.success) {
        console.error(validationFormData.error)
        return {
            errors: validationFormData.error.flatten().fieldErrors,
            message: 'Erro ao validar campos',
            success: false
        }
    }

    // 3. create barcode
    try {
        await makeInput({
            amount: validationFormData.data.amount,
            product_id: validationFormData.data.product_id
        })
        revalidatePath('/panel/product/' + validationFormData.data.product_id)
        return { message: `Entrada de ${validationFormData.data.amount} para o produto`, success: true };
    } catch (error) {
        const message = (error as { message?: string })?.message ?? 'Erro ao fazer entrada';
        return { message: message, success: false };
    }
}