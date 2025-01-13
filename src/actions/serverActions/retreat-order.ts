"use server";

import { ProductQuantity } from "@/app/panel/retreat/retreat-components/useSelectedProductsRetreat";
import { GetCollaboratorsInterface } from "@/core/server/collaborator/getCollaborators";
import makeOutputOrder from "@/core/server/output-orders/makeOutputOrder";

interface State {
  message?: string;
  success?: boolean;
  errors?: unknown;
}
export async function actionRetreatOrder(
  state: State,
  formData: {
    collaborator: GetCollaboratorsInterface["collaborators"];
    products: ProductQuantity[];
  }
) {
  try {
    await makeOutputOrder(
      formData.products.map((prod) => ({
        id: prod.id,
        quantity: prod.quantity || 0,
        finality: prod.finality,
        name: `${prod.product} ${prod.service} ${prod.size}`,
      })),
      formData.collaborator.id
    );

    return { message: "Pedido realizado", success: true };
  } catch (error) {
    const message =
      (error as { message?: string })?.message || "Erro ao realizar a retirada";
    console.log(error);
    return { message: message, success: false };
  }
}
