import db from "@/core/db/db";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";

const makeRetreat = async (products: {
    id: string,
    quantity: number,
    name: string,
}[], collaborator_id: string, forSector: boolean) => {
    const isUser = (await verifySession()).userId
    if (!isUser) {
        throw new Error('Usuario não encontrado');
    }
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
        return await db.output.retreat({
            product,
            user_id: isUser,
            collaborator_id,
            forSector,
        })
    })


    //
    revalidatePath('/panel/retreat')
    revalidatePath('/panel/return')
    revalidatePath('/panel/products')
    return retreat;
}

export default makeRetreat