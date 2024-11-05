'use server'
import db from "@/core/db/db";
import { verifySession } from "@/lib/session";

const getProducts = async () => {
    await verifySession();
    const products = await db.product.get();
    return { products };
}

export interface GetProductsInterface {
    products: ({
        Inventory: {
            product_id: string;
            amount: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        BarCodes: {
            product_id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        }[];
    } & {
        product: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        service: string;
        type: string;
        size: string;
        unitary_value: number;
        finality: string;
    })
}

export default getProducts;