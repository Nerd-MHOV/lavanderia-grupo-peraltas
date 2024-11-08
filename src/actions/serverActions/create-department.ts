'use server'
import db from "@/core/db/db";
import { CreateDepartmentSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
export interface StateActionCreateDepartment {
    errors?: {
        department?: string[] | undefined;
    },
    message?: string;
    success?: boolean;
}
export async function actionCreateDepartment(state: StateActionCreateDepartment | null, formData: FormData) {
    // 1. validate fields
    const validationFormData = CreateDepartmentSchema.safeParse({
        department: formData.get('department'),
    })
    if (!validationFormData.success) {
        console.error(validationFormData.error)
        return {
            errors: validationFormData.error.flatten().fieldErrors,
            message: 'Erro ao validar campos',
            success: false
        }
    }

    // 2. create department
    try {
        const department = await db.department.create({ 
            department: validationFormData.data.department,
         });
        revalidatePath('/panel/collaborators')
        return { message: `Departamento ${department.department} criado(a) com sucesso` , success: true};
    } catch (error) {
        const message = (error as { message?: string })?.message || 'Erro ao criar departamento';
        return { message: message, success: false };
    }
}