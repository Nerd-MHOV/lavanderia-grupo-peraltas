'use server'

import { CardPanelCollaborators } from "@/app/panel/retreat/retreat-components/card-panel-collaborator";
import { CardRetreatProducts } from "@/app/panel/retreat/retreat-components/card-panel-retreat";
import makeRetreat from "@/core/server/outputs/makeRetreat";

interface State {
    message?: string;
    success?: boolean;
    errors?: unknown;
}
export async function actionRetreat(state: State, formData: {
    collaborator: CardPanelCollaborators;
    finality: string;
    products: CardRetreatProducts[];
}
) {
    console.log('chamou a retirada');
    const forSector = formData.finality === 'sector';
    try {
        await makeRetreat(formData.products.map( prod => ({
            id: prod.id,
            quantity: prod.quantity || 0,
            name: `${prod.product} ${prod.service} ${prod.size}`
        })), formData.collaborator.id, forSector )

        return { message: 'Retirada realizada com sucesso', success: true }
    } catch (error) {
        const message = (error as { message?: string })?.message || 'Erro ao realizar a retirada'
        return { message: message, success: false }
    }
}