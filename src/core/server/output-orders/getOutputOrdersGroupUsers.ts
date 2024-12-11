import db from "@/core/db/db"
import { Collaborator, OutputOrder, Product } from "@prisma/client";

const getOutputOrdersGroupUser = async (): Promise<{
    outputOrdersGroupUser: GetOutputOrdersGroupUserInterface['outputOrdersGroupUser'][]
}> => {
 const outputOrdersGroupUser = await db.outputOrder.getGroupUser();
  return { outputOrdersGroupUser }
}

export interface GetOutputOrdersGroupUserInterface {
    outputOrdersGroupUser: {
        OutputOrder: ({
            Product: Product;
        } & OutputOrder)[];
    } & Collaborator
}
export default getOutputOrdersGroupUser