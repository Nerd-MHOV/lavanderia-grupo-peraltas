import db from "@/core/db/db";
import { verifySession } from "@/lib/session";
import { revalidatePath } from "next/cache";

const confirmOutputOrder = async (orders: string[]) => {
  const isUser = (await verifySession()).userId;
  if (!isUser) {
    throw new Error("Usuario não encontrado");
  }

  // verify if order exists
  await Promise.all(
    orders.map((order) => {
      const find = db.outputOrder.getById(order);
      if (!find) {
        throw new Error("Pedido não encontrado");
      }
    })
  );

  // confirm order
  const retreat = await Promise.all(
    orders.map(async (order) => {
      return await db.outputOrder.confirmOrder(order, isUser);
    })
  );

  //
  revalidatePath("/panel/return");
  revalidatePath("/panel/retreat");
  revalidatePath("/panel/products");
  revalidatePath("/panel/orders/retreat-orders");
  return retreat;
};

export default confirmOutputOrder;
