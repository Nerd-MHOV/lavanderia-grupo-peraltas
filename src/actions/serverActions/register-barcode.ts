'use server'
import db from "@/core/db/db";
import registerBarcodes from "@/core/server/barcode/registerBarcode";
import { RegisterBarcodeSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
export interface StateActionRegisterBarcode {
    errors?: {
        barcodes?: string[] | undefined;
        product_id?: string[] | undefined;
    },
    message?: string;
    success?: boolean;
}
export async function actionRegisterBarcode(state: StateActionRegisterBarcode | null, formData: FormData) {
    // 1. validate fields
    const validationFormData = RegisterBarcodeSchema.safeParse({
        barcodes: formData.get('barcodes'),
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
        const created = await registerBarcodes({
            barcodes: JSON.parse(validationFormData.data.barcodes),
            product_id: validationFormData.data.product_id
        })
        revalidatePath('/panel/product/' + validationFormData.data.product_id)
        return { message: `Cadastrado ${created.count} criado com sucesso`, success: true };
    } catch (error) {
        const message = (error as { message?: string })?.message ?? 'Erro ao criar a produto';
        return { message: message, success: false };
    }
}