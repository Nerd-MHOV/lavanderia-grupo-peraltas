import db from "@/core/db/db";
import { revalidatePath } from "next/cache";

const makeOutputOrder = async (products: {
    id: string,
    quantity: number,
    finality: string,
    name: string,
}[], collaborator_id: string) => {
    const verifyCollaborator = await db.collaborator.geta(collaborator_id);
    if (!verifyCollaborator) {
        throw new Error('Colaborador não encontrado');
    }

    const productWithInventory = await Promise.all(products.map(async product => {
        const isProductInInventory = await db.inventory.getByProduct(product.id);
        if (!isProductInInventory) {
            throw new Error(`Não temos esse produto no estoque: ${product.name}`);
        }
        const isEnoughAmount = isProductInInventory.amount >= product.quantity;
        if (!isEnoughAmount) {
            throw new Error('Não possuimos essa quantidade em estoque');
        }

        return {
            ...product,
            inventory: isProductInInventory
        }
    }))
    const retreat = productWithInventory.map(async product => {
        return await db.outputOrder.doOrder({
            product,
            collaborator_id,
        })
    })


    //
    revalidatePath('/panel/return')
    revalidatePath('/panel/retreat')
    revalidatePath('/panel/products')
    return retreat;
}

export default makeOutputOrder