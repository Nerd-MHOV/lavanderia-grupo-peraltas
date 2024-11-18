'use server'
import db from "@/core/db/db";
import { UpdateCollaboratorSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
export interface StateEditCollaborator {
    errors?: {
        id?: string[] | undefined;
        active?: string[] | undefined;
        name?: string[] | undefined;
        cpf?: string[] | undefined;
        type?: string[] | undefined;
        department?: string[] | undefined;
        canRetreat?: string[] | undefined;
    },
    message?: string;
    success?: boolean;
}
export async function actionEditCollaborator(state: StateEditCollaborator | null, formData: FormData) {
      // 1. validate fields
      const validationFormData = UpdateCollaboratorSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        cpf: formData.get('cpf'),
        type: formData.get('type'),
        active: formData.get('active') === 'true',
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

    // 2. edit collaborator
    try {
        const collaborator = await db.collaborator.update(validationFormData.data.id, { 
            name: validationFormData.data.name,
            cpf: validationFormData.data.cpf,
            type: validationFormData.data.type,
            active: validationFormData.data.active,
            department: validationFormData.data.department,
            canRetreat: validationFormData.data.canRetreat,
         });

        revalidatePath('/panel/collaborators/'+validationFormData.data.id)
        return { message: `Colaborador ${collaborator.name} editado com sucesso` , success: true};
    } catch (error) {
        console.log(error)
        const message = (error as { message?: string }).message || 'Erro ao editar o  Colaborador';
        return { message: message, success: false };
    }
}