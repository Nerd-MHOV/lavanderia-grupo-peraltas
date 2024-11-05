'use server'
import db from "@/core/db/db";
import { CreateTagFormSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
export interface StateActionCreateTag {
    errors?: {
        tag?: string[] | undefined;
    },
    message?: string;
    success?: boolean;
}
export async function actionCreateTag(state: StateActionCreateTag | null, formData: FormData) {
    // 1. validate fields
    const validationFormData = CreateTagFormSchema.safeParse({
        tag: formData.get('tag'),
    })
    if (!validationFormData.success) {
        console.error(validationFormData.error)
        return {
            errors: validationFormData.error.flatten().fieldErrors,
            message: 'Erro ao validar campos',
            success: false
        }
    }

    // 2. create tag
    try {
        const tag = await db.type.create({ type: validationFormData.data.tag });
        revalidatePath('/panel/products')
        return { message: `Tag ${tag.type.type} criada com sucesso` , success: true};
    } catch (error) {
        const message = (error as { message?: string })?.message?.includes('Unique constraint failed on the fields: (`type`)') ? 'Tag já existe' : 'Erro ao criar tag';
        return { message: message, success: false };
    }
}