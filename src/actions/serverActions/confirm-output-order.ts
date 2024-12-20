"use server";

import confirmOutputOrder from "@/core/server/output-orders/confirmOutputOrder";
import { redirect } from "next/navigation";

interface State {
  message?: string;
  success?: boolean;
  errors?: unknown;
}
export async function actionConfirmOutpuOrder(
  state: State,
  formData: {
    orders: string[];
  }
) {
  try {
    await confirmOutputOrder(formData.orders);
    redirect("/panel/orders/retreat-orders");
  } catch (error) {
    const message =
      (error as { message?: string })?.message || "Erro ao realizar a retirada";
    console.log(error);
    return { message: message, success: false };
  }
}
