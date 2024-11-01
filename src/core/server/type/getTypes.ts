'use server'
import db from "@/core/db/db";
import { verifySession } from "@/lib/session";

const getTypes = async () => {
    await verifySession();
    const find = await db.type.get();
    return { types: find.type };
}

export default getTypes;