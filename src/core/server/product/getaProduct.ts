'use server'
import db from "@/core/db/db";
import { verifySession } from "@/lib/session";

const getaProduct = async (id: string) => {
    await verifySession();
    const product = await db.product.getById(id);
    return { product };
}

export interface GetaProductInterface {
    product: {
        BarCodes: {
            product_id: string;
            createdAt: Date;
            updatedAt: Date;
            code: string;
        }[];
        Inventory: {
            product_id: string;
            amount: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        Input: ({
            User: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                user: string;
                first_name: string;
                last_name: string;
                passwd: string;
                level: number;
            };
        } & {
            product_id: string;
            amount: number;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            user_id: string;
        })[];
        Output: ({
            Collaborator: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                cpf: string;
                isDiarist: boolean;
                active: boolean;
                department: string;
            };
        } & {
            id: string;
            product_id: string;
            amount: number;
            createdAt: Date;
            updatedAt: Date;
            user_id: string;
            collaborator_id: string;
            forSector: boolean;
            status: boolean;
            obs: string;
            expiration: boolean;
            collaboratorId: string | null;
        })[],
        product: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        service: string;
        type: string;
        size: string;
        unitary_value: number;
    }
}
export default getaProduct;