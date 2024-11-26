'use server'
import db from "@/core/db/db";
import { BarCode, Department, Inventory, Product } from "@prisma/client";

const getProducts = async () => {
    // await verifySession();
    const products = await db.product.get();
    return { products };
}

export interface GetProductsInterface {
    products: ({
        Inventory: Inventory[];
        BarCodes: BarCode[];
        Departments: Department[];
    } & Product)
}



export default getProducts;