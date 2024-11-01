'use server'
import db from "@/core/db/db"
import { revalidatePath } from "next/cache"

const deleteBarcode = async (code: string, product_id: string) => {
    const deleted = await db.barcode.delete(code)
    revalidatePath('/panel/products/' + product_id)
    return deleted
}

export default deleteBarcode