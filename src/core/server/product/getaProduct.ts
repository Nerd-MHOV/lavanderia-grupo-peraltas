'use server'
import db from "@/core/db/db";
import { verifySession } from "@/lib/session";
import { BarCode, Collaborator, Department, Input, Inventory, Output, Product, User } from "@prisma/client";

const getaProduct = async (id: string): Promise<GetaProductInterface | null> => {
    await verifySession();
    const product = await db.product.getById(id);
    if (!product) return null;
    return { product };
}

export interface GetaProductInterface {
    product: ({
        BarCodes: BarCode[];
        Inventory: Inventory[];
        Input: ({
            User: User;
        } & Input)[];
        Output: ({
            Collaborator: Collaborator;
        } & Output)[];
        Departments: Department[];
        
    } & Product);
}
export default getaProduct;