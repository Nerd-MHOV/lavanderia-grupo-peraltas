import { PrismaClient } from '@prisma/client';
import dbUser from './user.db';
import dbCollaborator from './collaborators.db';
import dbProduct from './products.db';
import dbBarcodes from './barcodes.db';
import dbOutput from './outputs.db';
import dbOutputOrder from './output-orders.db';
import dbInventory from './inventory.db';
import dbService from './service.db';
import dbType from './type.db';
import dbInput from './inputs.db';
import dbDepartment from './department.db';
import dbReturn from './return.db';

const prismaClientSingleton = () => {
  return new PrismaClient()
}
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma



const db = ({
    user: dbUser(prisma),
    collaborator: dbCollaborator(prisma),
    department: dbDepartment(prisma),
    product:  dbProduct(prisma),
    barcode: dbBarcodes(prisma),
    inventory: dbInventory(prisma),
    input: dbInput(prisma),
    output: dbOutput(prisma),
    outputOrder: dbOutputOrder(prisma),
    return: dbReturn(prisma),
    service: dbService(prisma),
    type: dbType(prisma),
    $transaction: prisma.$transaction,
});

export default db;