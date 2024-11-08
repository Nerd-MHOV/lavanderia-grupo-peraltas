import { PrismaClient } from "@prisma/client";

const dbDepartment = (db: PrismaClient) => ({
    async get() {
        return db.department.findMany();
    },

    async geta( department: string ) {
        return db.department.findFirst({ where: { department } });
    },

    async create( data: {
        department: string;
    } ) {
        return db.department.create({ data });
    }
})

export default dbDepartment;