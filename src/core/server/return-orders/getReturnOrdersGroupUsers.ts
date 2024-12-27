import db from "@/core/db/db";
import { Collaborator, Product, ReturnOrder } from "@prisma/client";

const getReturnOrdersGroupUser = async (): Promise<{
  returnOrdersGroupUser: GetReturnOrdersGroupUserInterface["returnOrdersGroupUser"][];
}> => {
  const returnOrdersGroupUser = await db.returnOrder.getGroupUser();
  return { returnOrdersGroupUser };
};

export interface GetReturnOrdersGroupUserInterface {
  returnOrdersGroupUser: {
    ResponsibleReturnOrderOut: ({
      Product: Product;
    } & ReturnOrder)[];
  } & Collaborator;
}
export default getReturnOrdersGroupUser;
