'use server'
import db from "@/core/db/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export async function actionDeleteDepartment(department: string) {
    try {
        await db.department.delete(department);
    } catch (error) {
        console.log(error)
        const message = (error as { message?: string })?.message?.includes('collaborators_department_fkey (index)')
        ? 'Departamento não pode ser deletado! pois está associado a um ou mais colaboradores.'
        : (error as { message?: string })?.message?.includes('products_departments_department_fkey (index)')
        ? 'Departamento não pode ser deletado! pois está associado a um ou mais produtos.'
        :(error as { message?: string })?.message || 'Erro ao deletar departamento';
        return { message: message, success: false };
    }

    revalidatePath('/panel/products')
    revalidatePath('/panel/collaborators')
    redirect('/panel/collaborators')
}