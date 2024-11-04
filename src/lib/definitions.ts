import z from 'zod';

export const LoginFormSchema = z.object({
    user: z.string().min(3, { message: 'Informe o usuário' }),
    passwd: z.string().min(3, { message: 'Informe a senha' }),
})


export const CreateTagFormSchema = z.object({
    tag: z.string().min(2, { message: 'Informe o nome da tag' }),
})

export const CreateServiceFormSchema = z.object({
    service: z.string().min(2, { message: 'Informe o nome da marca' }),
})

export const CreateProductFormSchema = z.object({
    service: z.string().min(2, { message: 'Informe a marca' }),
    tag: z.string().min(2, { message: 'Informe a tag' }),
    product: z.string().min(2, { message: 'Informe o produto' }),
    size: z.string().min(1, { message: 'Informe o tamanho' }),
    unitary_value: z.number().min(0.01, { message: 'Informe o valor unitário' }),
})

export const UpdateProductFormSchema = z.object({
    id: z.string().min(1, { message: 'Informe o id' }),
    service: z.string().min(2, { message: 'Informe a marca' }),
    tag: z.string().min(2, { message: 'Informe a tag' }),
    product: z.string().min(2, { message: 'Informe o produto' }),
    size: z.string().min(1, { message: 'Informe o tamanho' }),
    unitary_value: z.number().min(0.01, { message: 'Informe o valor unitário' }),
})

export const RegisterBarcodeSchema = z.object({
    product_id: z.string().min(1, { message: 'Informe o id do produto' }),
    barcodes: z.string().min(5, { message: 'Informe os Códigos' } ),
})

export const AddInventoryProductSchema = z.object({
    product_id: z.string().min(1, { message: 'Informe o id do produto' }),
    amount: z.number().min(1, { message: 'Informe a quantidade' } ),
})

