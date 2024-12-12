import { PrismaClient } from "@prisma/client"
import dbOutput, { RetreatODT } from "./outputs.db"

type OutputOrderODT = Omit<RetreatODT, 'user_id'>;
const dbOutputOrder = (db: PrismaClient) => ({
    async get() {
        return db.outputOrder.findMany({
            include: {
                Product: true,
                Collaborator: true,
            }
        });
    },
    async getGroupUser() {
        return db.collaborator.findMany({
            where: { OutputOrder: { some: {
                amount: { gt: 0 }
            } } },
            include: { 
                OutputOrder: { include: { Product: true } }
             }
        })

    },
    async getById(id: string) {
        return db.outputOrder.findFirst({
            where: { id },
        })
    },
    async doOrder({
        product,
        collaborator_id,
    }: OutputOrderODT) {

        const dataOrder = {
            amount: product.quantity,
            product_id: product.id,
            collaborator_id,
            finality: product.finality,
            status: true,
            obs: 'order',
        }

        const findOrder = product.finality === 'collaborator'
            ? await db.outputOrder.findFirst({ where: { product_id: product.id, collaborator_id } })
            : await db.outputOrder.findFirst({ where: { product_id: product.id } });

        const dataDbOrder = findOrder
            ? db.outputOrder.update({ where: { id: findOrder.id }, data: { amount: { increment: product.quantity } } })
            : db.outputOrder.create({ data: dataOrder });

        return db.$transaction([
            db.inventory.update({
                where: { product_id: product.id },
                data: {
                    amount: {
                        decrement: product.quantity
                    }
                }
            }),
            dataDbOrder,
            db.outputOrderHistory.create({ data: dataOrder })
        ])
    },
    async confirmOrder(order_id: string, user_id: string) {
        const order = await db.outputOrder.findFirst({ where: { id: order_id } });
        if (!order) throw new Error('Order not found');

        await db.$transaction([
            db.inventory.update({
                where: { product_id: order.product_id },
                data: {
                    amount: {
                        increment: order.amount
                    }
                }
            }),
            db.outputOrder.delete({ where: { id: order_id } }),

        ])
        dbOutput(db).retreat({
            product: {
                id: order.product_id,
                quantity: order.amount,
                finality: order.finality,
            },
            user_id,
            collaborator_id: order.collaborator_id,
        })
    }
})

export default dbOutputOrder