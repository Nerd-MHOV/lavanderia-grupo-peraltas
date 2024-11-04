import db from "@/core/db/db";
import { verifySession } from "@/lib/session";

const makeInput = async ({
    amount, product_id
}: { amount: number, product_id: string}) => {
    const isUser = (await verifySession()).userId
    if (!isUser) {
        throw new Error('Usuario não encontrado');
    }
    const input = await db.input.input({
        amount,
        product_id,
        user_id: isUser,
    });

    return input;
}

export default makeInput;