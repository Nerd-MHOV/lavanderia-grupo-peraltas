'use server'
import db from "@/core/db/db";
import { verifySession } from "@/lib/session";

const getService = async (service: string) => {
    await verifySession();
    const created = await db.service.create({ service});
    return { service: created };
}

export default getService;