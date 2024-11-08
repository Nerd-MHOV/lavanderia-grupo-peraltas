import { PrismaClient } from '@prisma/client';
import dbUser from './user.db';
import dbCollaborator from './collaborators.db';
import dbProduct from './products.db';
import dbBarcodes from './barcodes.db';
import dbOutput from './outputs.db';
import dbInventory from './inventory.db';
import dbService from './service.db';
import dbType from './type.db';
import dbInput from './inputs.db';
import dbDepartment from './department.db';
import dbReturn from './return.db';

const prismaClient = new PrismaClient();

const db = ({
    user: dbUser(prismaClient),
    collaborator: dbCollaborator(prismaClient),
    department: dbDepartment(prismaClient),
    product:  dbProduct(prismaClient),
    barcode: dbBarcodes(prismaClient),
    inventory: dbInventory(prismaClient),
    input: dbInput(prismaClient),
    output: dbOutput(prismaClient),
    return: dbReturn(prismaClient),
    service: dbService(prismaClient),
    type: dbType(prismaClient),
    $transaction: prismaClient.$transaction,
});

export default db;