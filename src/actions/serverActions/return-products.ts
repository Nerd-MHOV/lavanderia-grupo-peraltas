'use server'
import { OutputsQuantity } from "@/app/panel/return/return-product";
import returnProducts from "@/core/server/return/returnProducts";
import { ReturnProductsSchema } from "@/lib/definitions";
export interface StateActionReturnProducts {
    errors?: {
        products?: string[] | undefined;
        collaborator_id?: string[] | undefined;
    },
    message?: string;
    success?: boolean;
}
export async function actionReturnProducts(state: StateActionReturnProducts | null, formData: {
    collaborator_id: string,
    products: OutputsQuantity[];
}) {
    // 1. validate fields
    const validationFormData = ReturnProductsSchema.safeParse({
        products: JSON.stringify(formData.products),
        collaborator_id: formData.collaborator_id,
    })
    if (!validationFormData.success) {
        console.error(validationFormData.error)
        return {
            errors: validationFormData.error.flatten().fieldErrors,
            message: 'Erro ao validar campos',
            success: false
        }
    }

    // 2. create return products
    try {
        const result = await returnProducts(
            JSON.parse(validationFormData.data.products),
            validationFormData.data.collaborator_id
        );
        return { message: `Devolução de ${result.total_amount} efetuada com sucesso` , success: true};
    } catch (error) {
        const message = (error as { message?: string })?.message || 'Erro ao devolver produtos';
        return { message: message, success: false };
    }
}