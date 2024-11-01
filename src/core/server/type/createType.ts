'use server'
import db from "@/core/db/db";
import { verifySession } from "@/lib/session";

const getType = async (type: string) => {
    await verifySession();
    const created = await db.type.create({ type });
    return { type: created };
}

export default getType;