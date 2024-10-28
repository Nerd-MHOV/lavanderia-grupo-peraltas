import { PrismaClient } from '@prisma/client';
import dbUser from './user.db';
import dbCollaborator from './collaborators.db';
import dbProduct from './products.db';
import dbBarcodes from './barcodes.db';
import dbOutput from './outputs.db';
import dbInventory from './inventory.db';

const prismaClient = new PrismaClient();

const db = ({
    user: dbUser(prismaClient),
    collaborator: dbCollaborator(prismaClient),
    product:  dbProduct(prismaClient),
    barcode: dbBarcodes(prismaClient),
    inventory: dbInventory(prismaClient),
    output: dbOutput(prismaClient),
});

export default db;