import db from '@/core/db/db';
import { verifySession } from '@/lib/session';
import { hash } from 'bcryptjs';
interface CreateUserData {
    first_name: string,
    last_name: string,
    email: string,
    user: string,
    passwd: string,
    level?: number
}
const createUser = async (data: CreateUserData) => {
    await verifySession();
    const hashPasswd = await hash(data.passwd, 10);

    const pUser = await db.user.create({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        user: data.user,
        passwd: hashPasswd,
    })

    return {
        user: pUser.user
    }

}


export default createUser;