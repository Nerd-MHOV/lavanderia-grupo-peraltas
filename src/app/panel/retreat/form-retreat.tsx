'use client'

import { actionRetreat } from '@/actions/serverActions/retreat';
import SlackMessage from '@/components/interface/SlackMessage';
import React, { useEffect, useState } from 'react'
import { useFormState } from 'react-dom';
import CardPanelCollaborator, { CardPanelCollaborators } from './retreat-components/card-panel-collaborator';
import CardPanelFinality from './retreat-components/card-panel-finality';
import CardPanelRetreat, { CardRetreatProducts } from './retreat-components/card-panel-retreat';
import ConfirmModal from './retreat-components/confirm-modal';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import useFaceReader from '@/hooks/useFaceReader';

interface FormRetreatProps {
  collaborators: CardPanelCollaborators[]
  products: CardRetreatProducts[]
}

export interface DataActionRetreatPage {
  collaborator: CardPanelCollaborators;
  finality: string;
  products: CardRetreatProducts[];
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
  }, [state])
  return (
    <Dialog>
      <ConfirmModal action={action} dataAction={dataAction} resultReader={resultReader} clear={clear} />
      <DialogTrigger className='open-modal-confirmation' />
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
        <CardPanelRetreat products={products} />
      </form>
    </Dialog>
  )
}

export default FormRetreat