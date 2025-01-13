"use server";

import { ProductQuantity } from "@/app/panel/retreat/retreat-components/useSelectedProductsRetreat";
import { GetCollaboratorsInterface } from "@/core/server/collaborator/getCollaborators";
import makeRetreat from "@/core/server/outputs/makeRetreat";

interface State {
  message?: string;
  success?: boolean;
  errors?: unknown;
}
export async function actionRetreat(
  state: State,
  formData: {
    collaborator: GetCollaboratorsInterface["collaborators"];
    products: ProductQuantity[];
  }
) {
  try {
    await makeRetreat(
      formData.products.map((prod) => ({
        id: prod.id,
        quantity: prod.quantity || 0,
        finality: prod.finality,
        name: `${prod.product} ${prod.service} ${prod.size}`,
      })),
      formData.collaborator.id
    );

    return { message: "Retirada realizada com sucesso", success: true };
  } catch (error) {
    const message =
      (error as { message?: string })?.message || "Erro ao realizar a retirada";
    return { message: message, success: false };
  }
}
