'use client'

import { actionRetreat } from '@/actions/serverActions/retreat';
import SlackMessage from '@/components/interface/SlackMessage';
import React, { useEffect, useState } from 'react'
import { useFormState } from 'react-dom';
import CardPanelCollaborator from './retreat-components/card-panel-collaborator';
import CardPanelFinality from './retreat-components/card-panel-finality';
import CardPanelRetreat from './retreat-components/card-panel-retreat';
import ConfirmModal from './retreat-components/confirm-modal';
import useFaceReader from '@/hooks/useFaceReader';
import { GetProductsInterface } from '@/core/server/product/getProducts';
import { ProductQuantity } from './retreat-components/useSelectedProductsRetreat';
import { GetCollaboratorsInterface } from '@/core/server/collaborator/getCollaborators';

interface FormRetreatProps {
  collaborators: GetCollaboratorsInterface['collaborators'][]
  products: GetProductsInterface['products'][]
}

export interface DataActionRetreatPage {
  collaborator: GetCollaboratorsInterface['collaborators'];
  finality: string;
  products: ProductQuantity[];
}

const FormRetreat = ({ collaborators, products }: FormRetreatProps) => {
  const { resultReader, clear } = useFaceReader([collaborators]);
  const initialState = { message: '', errors: {}, success: false }
  const [state, action] = useFormState(actionRetreat, initialState);
  const [message, setMessage] = useState<{
    message: string;
    errors?: undefined;
    success: boolean;
  } | null>(null)
  const [dataAction, setDataAction] = useState< DataActionRetreatPage | null>(null);

  const openModal = () => {
    (document.querySelector('.open-modal-confirmation') as HTMLElement)?.click()
  }


  const handleForm = (data: FormData) => {
    const dataObj = {
      collaborator: JSON.parse(data.get('collaborator') as string),
      finality: JSON.parse(data.get('finality') as string),
      products: JSON.parse(data.get('products') as string)
    }
    setDataAction(dataObj)
    if (!dataObj.collaborator) {
      setMessage({
        message: 'Informe o COLABORADOR para continuar',
        success: false
      })
      return
    }

    if (!dataObj.finality) {
      setMessage({
        message: 'Informe a FINALIDADE para continuar',
        success: false
      })
      return
    }

    if (!dataObj.products.length) {
      setMessage({
        message: 'Adicione ao menos um PRODUTO para continuar',
        success: false
      })
      return
    }

    openModal()
  }

  useEffect(() => {
    setMessage({
      message: state.message,
      success: state.success
    })
    if( state.success ) { clear() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <>
      <ConfirmModal products={
        dataAction?.products.map(prod => ({
          id: prod.id,
          quantity: prod.quantity ?? 0,
          product: prod.product,
          size: prod.size,
          service: prod.service
        })) || []
      } action={action} finality={dataAction?.finality || ''} collaborator={dataAction?.collaborator}  dataAction={dataAction} resultReader={resultReader} clear={clear} />
      <form action={(data) => {
        handleForm(data)
      }} className='p-5'>

        <div className='flex gap-5 mb-5'>
          <CardPanelCollaborator collaborators={collaborators} disabled clear={clear} resultReader={resultReader} />
          <CardPanelFinality disabled />
        </div>
        {
          message?.message &&
          <div className="mt-10 mb-2">
            <SlackMessage
              message={message?.message}
              type={message?.success ? 'success' : 'error'}
            />
          </div>
        }
        <CardPanelRetreat products={products} clear={clear} />
      </form>
    </>
  )
}

export default FormRetreat