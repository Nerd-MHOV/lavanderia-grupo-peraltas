'use server'
import db from "@/core/db/db";
import { verifySession } from "@/lib/session";

const getaProduct = async (id: string) => {
    await verifySession();
    const product = await db.product.getById(id);
    return { product };
}

export default getaProduct;