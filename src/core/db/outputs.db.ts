import { Inventory, PrismaClient } from "@prisma/client";



interface RetreatODT {
    product: {
        id: string,
        quantity: number
    },
    inventory: Inventory,
    user_id: string,
    collaborator_id: string,
    forSector: boolean
}
const dbOutput = (db: PrismaClient) => ({
    async get() {
        return db.output.findMany();
    },

    async create(data: {
        product_id: string,
        collaborator_id: string,
        user_id: string,
        forSector: boolean,
        amount: number,
        status: boolean,
        obs: string,
    }) {
        return db.output.create({ data });
    },

    async delete(id: string) {
        return db.output.delete({ where: { id } });
    },

    async retreat({
        product,
        inventory,
        user_id,
        collaborator_id,
        forSector,
    }: RetreatODT) {

        const dataOutput = {
            amount: product.quantity,
            product_id: product.id,
            collaborator_id,
            user_id,
            forSector,
            status: true,
            obs: 'retreat',
        }
        return db.$transaction([
            db.inventory.update({
                where: {product_id: product.id},
                data: {
                    amount: inventory.amount - product.quantity
                }
            }),
            db.output.create({ data: dataOutput }),
            db.outputHistory.create({ data: dataOutput})
        ])
    }
})

export default dbOutput;