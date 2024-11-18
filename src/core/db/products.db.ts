import { PrismaClient } from '@prisma/client';


type product_finality = 'collaborator' | 'department';

const dbProduct = (db: PrismaClient) => ({
    async get() {
        return db.product.findMany({
            include: {
                BarCodes: true,
                Inventory: true,
                Departments: true,
            }
        });
    },
    async getById(id: string) {
        return db.product.findUnique({
            where: { id },
            include: {
                BarCodes: true, 
                Inventory: true,
                Input: {
                    include: { User: true }
                }, Output: {
                    include: { Collaborator: true }
                }, 
                Departments: true

            }
        });
    },
    async create(data: {
        product: string,
        size: string,
        unitary_value: number,
        service: string,
        type: string,
        finality: product_finality,
        departments: string[],
    }) {
        const { departments, ...dataInfo } = data;

        const dbData = await db.product.create({
            data: {
                ...dataInfo,
                Departments: {
                    create: departments.map(department => ({ department }))
                }
            }
        })

        return { product: dbData }
    },
    async update(data: {
        id: string,
        product: string,
        size: string,
        unitary_value: number,
        service: string,
        type: string,
        finality: product_finality,
        departments: string[],
    }) {
        const { departments, ...dataInfo } = data;

        const dbData = await db.$transaction([
            db.productsOnDepartments.deleteMany({
                where: { product_id: data.id }
            }),
            db.product.update({
                where: { id: data.id },
                data: {
                    ...dataInfo,
                    Departments: {
                        create: departments.map(department => ({ department }))
                    }
                }
            })
        ])
        return { product: dbData[1] }
    }

})

export default dbProduct;