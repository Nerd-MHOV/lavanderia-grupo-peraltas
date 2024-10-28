'use server'

import { deleteSession } from "@/lib/session"

export async function actionLogout() {
    await deleteSession();
}