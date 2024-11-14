'use server'
import db from "@/core/db/db";
import { CreateCollaboratorSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
export interface StateActionCreateCollaborator {
    errors?: {
        name?: string[] | undefined;
        cpf?: string[] | undefined;
        type?: string[] | undefined;
        department?: string[] | undefined;
        canRetreat?: string[] | undefined;
    },
    message?: string;
    success?: boolean;
}
export async function actionCreateCollaborator(state: StateActionCreateCollaborator | null, formData: FormData) {
    // 1. validate fields
    const validationFormData = CreateCollaboratorSchema.safeParse({
        name: formData.get('name'),
        cpf: formData.get('cpf'),
        type: formData.get('type'),
        department: formData.get('department'),
        canRetreat: JSON.parse(formData.get('canRetreat') as string)
    })
    if (!validationFormData.success) {
        console.error(validationFormData.error)
        return {
            errors: validationFormData.error.flatten().fieldErrors,
            message: 'Erro ao validar campos',
            success: false
        }
    }

    // 2. create collaborator
    try {
        const collaborator = await db.collaborator.create({ 
            name: validationFormData.data.name,
            cpf: validationFormData.data.cpf,
            type: validationFormData.data.type,
            department: validationFormData.data.department,
            canRetreat: validationFormData.data.canRetreat
         });
        revalidatePath('/panel/collaborators')
        return { message: `Colaborador ${collaborator.name} criado(a) com sucesso` , success: true};
    } catch (error) {
        const message = (error as { message?: string })?.message || 'Erro ao criar collaborador';
        return { message: message, success: false };
    }
}