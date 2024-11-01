'use server'
import db from "@/core/db/db";
import { verifySession } from "@/lib/session";

const getServices = async () => {
    await verifySession();
    const find = await db.service.get();
    return { services: find.service };
}

export default getServices;