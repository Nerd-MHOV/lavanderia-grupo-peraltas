'use server'
import db from "@/core/db/db";
import { verifySession } from "@/lib/session";

const getProducts = async () => {
    await verifySession();
    const products = await db.product.get();
    return { products };
}

export default getProducts;