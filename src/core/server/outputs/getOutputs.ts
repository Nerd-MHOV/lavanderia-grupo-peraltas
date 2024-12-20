import db from "@/core/db/db";
import { Collaborator, Output, Product, ReturnOrder } from "@prisma/client";

const getOutputs = async (): Promise<{
    outputs: GetOutputsInterface['outputs'][]
}> => {
    const outputs = await db.output.get();
    return { outputs };
}

export interface GetOutputsInterface {
    outputs: ({
        Collaborator: Collaborator,
        Product: Product,
        ReturnOrder: ReturnOrder[],
    } & Output)
}

export default getOutputs;