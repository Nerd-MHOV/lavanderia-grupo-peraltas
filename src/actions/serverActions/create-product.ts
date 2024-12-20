'use server'
import db from "@/core/db/db";
import { CreateProductFormSchema } from "@/lib/definitions";
import { revalidatePath } from "next/cache";
export interface StateActionCreateProduct {
    errors?: {
        service?: string[] | undefined;
        tag?: string[] | undefined;
        product?: string[] | undefined;
        unitary_value?: string[] | undefined;
        size?: string[] | undefined;
        finality?: string[] | undefined;
        departments?: string[] | undefined;
    },
    message?: string;
    success?: boolean;
}
export async function actionCreateProduct(state: StateActionCreateProduct | null, formData: FormData) {
    // 1. validate fields
    const validationFormData = CreateProductFormSchema.safeParse({
        service: formData.get('service'),
        tag: formData.get('tag'),
        product: formData.get('product'),
        size: formData.get('size'),
        unitary_value: Number(formData.get('unitary_value')),
        finality: formData.get('finality'),
        departments: JSON.parse(formData.get('departments') as string)
    })
    if (!validationFormData.success) {
        console.error(validationFormData.error)
        return {
            errors: validationFormData.error.flatten().fieldErrors,
            message: 'Erro ao validar campos',
            success: false
        }
    }

    // 2. create product
    try {
        const product = await db.product.create({ 
            product: validationFormData.data.product,
            service: validationFormData.data.service,
            type: validationFormData.data.tag,
            size: validationFormData.data.size.toUpperCase(),
            unitary_value: validationFormData.data.unitary_value,
            finality: validationFormData.data.finality,
            departments: validationFormData.data.departments,
         });

         revalidatePath('/panel/products')
        return { message: `Produto ${product.product.product} -- ${product.product.size} criado com sucesso` , success: true};
    } catch (error) {
        console.log(error);
        const message = (error as { message?: string })?.message?.includes('Unique constraint failed on the fields: (`product`)') ? 'Produto já existe' : 'Erro ao criar o produto';
        return { message: message, success: false };
    }
}