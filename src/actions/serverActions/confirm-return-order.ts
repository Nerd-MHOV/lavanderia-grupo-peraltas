"use server";

import confirmReturnOrder from "@/core/server/return-orders/confirmReturnOrder";
import { redirect } from "next/navigation";

interface State {
  message?: string;
  success?: boolean;
  errors?: unknown;
}
export async function actionConfirmReturnOrder(
  state: State,
  formData: {
    orders: string[];
  }
) {
  try {
    await confirmReturnOrder(formData.orders);
    redirect("/panel/orders/return-orders");
  } catch (error) {
    const message =
      (error as { message?: string })?.message || "Erro ao realizar a retirada";
    console.log(error);
    return { message: message, success: false };
  }
}
