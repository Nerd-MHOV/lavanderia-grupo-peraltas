import { Output, PrismaClient } from "@prisma/client";
import dbReturn from "./return.db";


const dbReturnOrder = (db: PrismaClient) => ({
    async get() {
        return db.returnOrder.findMany();
    },
    async getById(id: string) {
        return db.returnOrder.findFirst({
            where: { id },
        })
    },
    async doOrder(
        output: Output,
        quantity: number,
        product_id: string,  
        collaborator_id: string,
    ) {

        const outputExists = await db.output.findFirst({
            where: { id: output.id }
        })

        if(!outputExists) throw new Error('Saída não encontrada');

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
            obs_out: 'return',
            date_in: output.updatedAt,
        }

        return db.$transaction([
            db.returnOrder.create({data}),
            db.returnOrderHistory.create({data}),
        ])

        
    },
    async confirmOrder(order_id: string, user_id: string) {
        const order = await db.returnOrder.findFirst({
            where: { id: order_id },
            include: {
                Output: true,
            }
        });

        if (!order) {
            throw new Error('Order not found');
        }


        db.$transaction([
            db.returnOrder.delete({
                where: { id: order_id }
            }),
            dbReturn(db).returnProduct(
                order.Output,
                order.amount,
                order.product_id,
                order.collaborator_id_out as string,
                user_id
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as any
        ])
    }

});


export default dbReturnOrder;