import db from "@/core/db/db";
import { Collaborator, Output, Product } from "@prisma/client";

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
    } & Output)
}

export default getOutputs;