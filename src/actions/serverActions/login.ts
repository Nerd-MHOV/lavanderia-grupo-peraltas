'use server'
import login from "@/core/server/user/login";
import { LoginFormSchema } from "@/lib/definitions";
import { createSession } from "@/lib/session";
interface State {
    errors?: {
        user?: string[] | undefined;
        passwd?: string[] | undefined;
    },
    message?: string;
}
export async function actionLogin(state: State | null, formData: FormData) {
    // 1. validate fields
    const validationFormData = LoginFormSchema.safeParse({
        user: formData.get('user'),
        passwd: formData.get('passwd'),
    })
    if (!validationFormData.success) {
        console.error(validationFormData.error)
        return {
            errors: validationFormData.error.flatten().fieldErrors,
            message: 'Erro ao validar campos'
        }
    }

    // 2. login
    const user = await login(validationFormData.data);
    if (user.error || !user.user) return {
        message: user.error || 'Erro: tente de novo!'
    }
    // 3. create a session
    await createSession(user.user.id);
    return { message: 'Logado com sucesso', success: true };
}