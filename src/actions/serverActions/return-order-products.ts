'use server'
import { OutputsQuantity } from "@/app/panel/return/return-product";
import makeReturnOrder from "@/core/server/return-orders/makeReturnOrder";
import { ReturnProductsSchema } from "@/lib/definitions";
export interface StateActionReturnOrderProducts {
    errors?: {
        products?: string[] | undefined;
        collaborator_id?: string[] | undefined;
    },
    message?: string;
    success?: boolean;
}
export async function actionReturnOrderProducts(state: StateActionReturnOrderProducts | null, formData: {
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

    // 2. create return order products
    try {
        const result = await makeReturnOrder(
            JSON.parse(validationFormData.data.products),
            validationFormData.data.collaborator_id
        );
        return { message: `Pedido de devolução de ${result.total_amount} efetuada` , success: true};
    } catch (error) {
        console.log(error);
        const message = (error as { message?: string })?.message || 'Erro ao devolver produtos';
        return { message: message, success: false };
    }
}