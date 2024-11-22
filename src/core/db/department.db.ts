import { PrismaClient } from "@prisma/client";

const dbDepartment = (db: PrismaClient) => ({
    async get() {
        return db.department.findMany({
            orderBy: {department: 'asc'}
        });
    },

    async geta( department: string ) {
        return db.department.findFirst({ where: { department } });
    },

    async create( data: {
        department: string;
    } ) {
        return db.department.create({ data });
    },

    async delete( department: string ) {
        return db.department.delete({ where: { department } });
    }
})

export default dbDepartment;