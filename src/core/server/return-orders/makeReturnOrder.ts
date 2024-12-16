import db from "@/core/db/db";
import { revalidatePath } from "next/cache";

const makeReturnOrder = async (outputs: {
    id: string,
    quantity: number,
    name: string,
}[], collaborator_id: string) => {
    const verifyCollaborator = await db.collaborator.geta(collaborator_id);
    if (!verifyCollaborator) {
        throw new Error('Colaborador não encontrado');
    }
    const verifyOutputs = await Promise.all(outputs.map(async output => {
        const isOutput = await db.output.geta(output.id);
        if (!isOutput) {
            throw new Error(`Essa Saida não existe: ${output.name}`);
        }
        return isOutput;
    }))


    const returns = await Promise.all(outputs.map(async product => {
        const output = verifyOutputs.find(output => output.id === product.id);
        if (!output) {
            throw new Error(`Não temos saida desse produto no registro: ${product.name}`);
        }
        const returnOutput = await db.returnOrder.doOrder(output, product.quantity, output.product_id, collaborator_id)
        return returnOutput;
    }))


    //
    revalidatePath('/panel/returns')
    revalidatePath('/panel/retreat')
    revalidatePath('/panel/return')
    revalidatePath('/panel/products')
    revalidatePath('/self/return')
    return {
        returns,
        total_amount: returns.reduce((acc, curr) => acc + curr[0].amount, 0)
    };
}

export default makeReturnOrder