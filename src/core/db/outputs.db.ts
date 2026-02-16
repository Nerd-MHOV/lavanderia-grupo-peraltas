import { PrismaClient } from "@prisma/client";

export interface RetreatODT {
  product: {
    id: string;
    quantity: number;
    finality: string;
  };
  user_id: string;
  collaborator_id: string;
}
const dbOutput = (db: PrismaClient) => ({
  async get() {
    return db.output.findMany({
      include: {
        Collaborator: true,
        Product: {
          include: {
            BarCodes: true,
          },
        },
        ReturnOrder: true,
      },
    });
  },

  async geta(id: string) {
    return db.output.findFirst({
      where: { id },
      include: { ReturnOrder: true },
    });
  },

  async create(data: {
    product_id: string;
    collaborator_id: string;
    user_id: string;
    finality: string;
    amount: number;
    status: boolean;
    obs: string;
  }) {
    return db.output.create({ data });
  },

  async delete(id: string) {
    return db.output.delete({ where: { id } });
  },

  async retreat({ product, user_id, collaborator_id }: RetreatODT) {
    return db.$transaction(
      await retreatActionsArray(db, { product, user_id, collaborator_id })
    );
  },
});

export const retreatActionsArray = async (
  db: PrismaClient,
  { product, user_id, collaborator_id }: RetreatODT
) => {
  const dataOutput = {
    amount: product.quantity,
    product_id: product.id,
    collaborator_id,
    user_id,
    finality: product.finality,
    status: true,
    obs: "retreat",
  };

  const findOutput =
    product.finality === "collaborator"
      ? await db.output.findFirst({
          where: { product_id: product.id, collaborator_id },
        })
      : await db.output.findFirst({ where: { product_id: product.id } });

  const outputData = findOutput
    ? db.output.update({
        where: { id: findOutput.id },
        data: { amount: { increment: product.quantity } },
      })
    : db.output.create({ data: dataOutput });

  return [
    db.inventory.update({
      where: { product_id: product.id },
      data: {
        amount: {
          decrement: product.quantity,
        },
      },
    }),
    outputData,
    db.outputHistory.create({ data: dataOutput }),
  ];
};

export default dbOutput;
