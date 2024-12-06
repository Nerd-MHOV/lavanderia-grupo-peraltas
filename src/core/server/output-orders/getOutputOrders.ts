import db from "@/core/db/db"
import { Collaborator, OutputOrder, Product } from "@prisma/client";

const getOutputOrders = async (): Promise<{
    outputOrders: GetOutputOrdersInterface['outputOrders'][]
}> => {
    const outputOrders = await db.outputOrder.get();
  return { outputOrders }
}

interface GetOutputOrdersInterface {
    outputOrders: {
        Collaborator: Collaborator;
        Product: Product;
    } & OutputOrder
}
export default getOutputOrders