import db from "@/core/db/db";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";

const returnProducts = async (outputs: {
    id: string,
    quantity: number,
    name: string,
}[], collaborator_id: string) => {
    const isUser = (await verifySession()).userId
    if (!isUser) {
        throw new Error('Usuario não encontrado');
    }
    const verifyCollaborator = await db.collaborator.geta(collaborator_id);
    if (!verifyCollaborator) {
        throw new Error('Colaborador não encontrado');
    }
    const verifyOutputs = await Promise.all(outputs.map(async output => {
        const isOutput = await db.output.geta(output.id);
        if (!isOutput) {
            throw new Error(`Não temos esse produto no estoque: ${output.name}`);
        }

        return isOutput;
    }))


    const returns = await Promise.all(outputs.map(async product => {
        const output = verifyOutputs.find(output => output.id === product.id);
        if (!output) {
            throw new Error(`Não temos saida desse produto no registro: ${product.name}`);
        }
        const returnOutput = await db.return.returnProduct(output, product.quantity, output.product_id, collaborator_id, isUser)
        return returnOutput;
    }))


    //
    revalidatePath('/panel/returns')
    revalidatePath('/panel/retreat')
    revalidatePath('/panel/return')
    revalidatePath('/panel/products')
    return {
        returns,
        total_amount: returns.reduce((acc, curr) => acc + curr[0].amount, 0)
    };
}

export default returnProducts