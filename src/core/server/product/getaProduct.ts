"use server";
import db from "@/core/db/db";
import { verifySession } from "@/lib/session";
import {
  BarCode,
  Collaborator,
  Department,
  Input,
  Inventory,
  Output,
  OutputOrder,
  Product,
  ReturnOrder,
  User,
} from "@prisma/client";

const getaProduct = async (
  id: string
): Promise<GetaProductInterface | null> => {
  await verifySession();
  const product = await db.product.getById(id);
  if (!product) return null;
  return { product };
};

export interface GetaProductInterface {
  product: {
    BarCodes: BarCode[];
    Inventory: Inventory[];
    ReturnOrder: ({
      CollaboratorOut: Collaborator | null;
    } & ReturnOrder)[];
    OutputOrder: ({
      Collaborator: Collaborator;
    } & OutputOrder)[];
    Input: ({
      User: User;
    } & Input)[];
    Output: ({
      Collaborator: Collaborator;
    } & Output)[];
    Departments: Department[];
  } & Product;
}
export default getaProduct;
