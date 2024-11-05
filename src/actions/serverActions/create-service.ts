'use server'
import db from "@/core/db/db";
import { CreateServiceFormSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
export interface StateActionCreateService {
    errors?: {
        service?: string[] | undefined;
    },
    message?: string;
    success?: boolean;
}
export async function actionCreateService(state: StateActionCreateService | null, formData: FormData) {
    // 1. validate fields
    const validationFormData = CreateServiceFormSchema.safeParse({
        service: formData.get('service'),
    })
    if (!validationFormData.success) {
        console.error(validationFormData.error)
        return {
            errors: validationFormData.error.flatten().fieldErrors,
            message: 'Erro ao validar campos',
            success: false
        }
    }

    // 2. create service
    try {
        const service = await db.service.create({ service: validationFormData.data.service });
        revalidatePath('/panel/products')
        return { message: `Marca ${service.service.service} criada com sucesso` , success: true};
    } catch (error) {
        const message = (error as { message?: string })?.message?.includes('Unique constraint failed on the fields: (`service`)') ? 'Marca já existe' : 'Erro ao criar a marca';
        return { message: message, success: false };
    }
}