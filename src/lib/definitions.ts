import z from 'zod';

export const LoginFormSchema = z.object({
    user: z.string().min(3, { message: 'Informe o usuário' }),
    passwd: z.string().min(3, { message: 'Informe a senha' }),
})

