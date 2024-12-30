import { Output, PrismaClient } from "@prisma/client";
import { returnProductActionArray } from "./return.db";

const dbReturnOrder = (db: PrismaClient) => ({
  async get() {
    return db.returnOrder.findMany();
  },
  async getGroupUser() {
    return db.collaborator.findMany({
      where: {
        ResponsibleReturnOrderOut: {
          some: {
            amount: { gt: 0 },
          },
        },
      },
      include: {
        ResponsibleReturnOrderOut: {
          include: {
            Product: true,
          },
        },
      },
    });
  },
  async getById(id: string) {
    return db.returnOrder.findFirst({
      where: { id },
    });
  },
  async doOrder(
    output: Output,
    quantity: number,
    product_id: string,
    collaborator_id: string
  ) {
    const outputExists = await db.output.findFirst({
      where: { id: output.id },
    });

    if (!outputExists) throw new Error("Saída não encontrada");

    const data = {
      product_id,
      output_id: output.id,
      collaborator_id_in: output.collaborator_id,
      collaborator_id_out: collaborator_id,
      finality: output.finality,
      amount: quantity,
      amount_has: output.amount,
      amount_bad: 0,
      status_in: output.status,
      status_out: true,
      obs_in: output.obs,
      obs_out: "return",
      date_in: output.updatedAt,
    };

    const findOrder =
      data.finality === "collaborator"
        ? await db.returnOrder.findFirst({
            where: { product_id, collaborator_id_out: collaborator_id },
          })
        : await db.returnOrder.findFirst({ where: { product_id } });

    const dataOrder = findOrder
      ? db.returnOrder.update({
          where: { id: findOrder.id },
          data: {
            amount: { increment: data.amount },
            collaborator_id_out: collaborator_id,
          },
        })
      : db.returnOrder.create({ data });

    return db.$transaction([dataOrder, db.returnOrderHistory.create({ data })]);
  },
  async confirmOrder(order_id: string, user_id: string) {
    const order = await db.returnOrder.findFirst({
      where: { id: order_id },
      include: {
        Output: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    await db.$transaction([
      db.returnOrder.delete({
        where: { id: order_id },
      }),
      ...(await returnProductActionArray(
        db,
        order.Output,
        order.amount,
        order.product_id,
        order.collaborator_id_out as string,
        user_id
      )),
    ]);
  },
});

export default dbReturnOrder;
