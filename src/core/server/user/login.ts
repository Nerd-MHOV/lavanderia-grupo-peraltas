import db from "@/core/db/db";
import { compare } from 'bcryptjs';

const login = async (data: { user: string, passwd: string }) => {
    try {
        const dUser = await db.user.getByUser({ user: data.user });
        if(!dUser) throw new Error('Usuário ou Senha não conferem!');
        const passwdMatch = await compare(data.passwd, dUser.user.passwd);
        if(!passwdMatch) throw new Error('Usuário ou Senha não conferem!');
        return {
            user: {
                id: dUser.user.id,
                first_name: dUser.user.first_name,
                last_name: dUser.user.last_name,
                email: dUser.user.email,
                user: dUser.user.user,
                level: dUser.user.level,
            }
        }
    } catch {
        return {
            error: 'Usuário ou Senha não conferem!',
        }
    }
}

export default login;