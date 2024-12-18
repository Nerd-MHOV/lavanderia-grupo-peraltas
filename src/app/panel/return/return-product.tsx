'use client'
import React, { useCallback, useEffect } from 'react'
import CardPanelCollaborator from '../retreat/retreat-components/card-panel-collaborator'
import useFaceReader from '@/hooks/useFaceReader'
import { GetCollaboratorsInterface } from '@/core/server/collaborator/getCollaborators'
import { Button } from '@/components/ui/button'
import { useFormState } from 'react-dom'
import { actionReturnProducts, StateActionReturnProducts } from '@/actions/serverActions/return-products'
import SlackMessage from '@/components/interface/SlackMessage'
import ConfirmModal from '../retreat/retreat-components/confirm-modal'
import TableReturnProducts from './table-return-products'
import { GetOutputsInterface } from '@/core/server/outputs/getOutputs'


export type OutputsQuantity = (
  GetCollaboratorsInterface['collaborators']['Outputs'][0] & { quantity?: number }
)

export interface DataActionReturnPage {
  collaborator_id: string;
  products: OutputsQuantity[];
}


const RetrunProduct = ({ collaborators, outputs }: {
  collaborators: GetCollaboratorsInterface['collaborators'][]
  outputs: GetOutputsInterface['outputs'][]
}) => {
  const [state, action] = useFormState(actionReturnProducts, {} as StateActionReturnProducts)
  const { resultReader, clear } = useFaceReader([collaborators]);
  const [selectedCollaborator, setSelectedCollaborator] = React.useState<GetCollaboratorsInterface['collaborators'] | null>(null);
  const [outputToReturn, setOutputToReturn] = React.useState<OutputsQuantity[] | []>([]);
  const [dataAction, setDataAction] = React.useState<DataActionReturnPage | null>(null);
  const addOutputReturn = useCallback((output: OutputsQuantity) => {
    setOutputToReturn((prev) => {
      const out = prev.find((o) => o.id === output.id)
      if (out) {
        const quantity = out.quantity || 0
        out.quantity = out.amount >= quantity + 1 ? quantity + 1 : quantity
        return prev.map((p) => p.id === output.id ? out : p)
      }
      if (!output.amount) return prev
      return [...prev, {
        ...output,
        quantity: 1
      }]
    })

  }, [])

  const removeOutputReturn = useCallback((output: OutputsQuantity) => {
    setOutputToReturn((prev) => {
      const out = prev.find((p) => p.id === output.id)
      if (out) {
        out.quantity = out.quantity ? out.quantity - 1 : 0
        if (out.quantity === 0) return prev.filter((p) => p.id !== output.id)
        return prev.map((p) => p.id === output.id ? out : p)
      }
      return prev
    })
  }, [])

  const handleForm = (data: FormData) => {
    const dataObj = {
      collaborator_id: data.get('collaborator_id') as string,
      products: JSON.parse(data.get('products') as string)
    }

    console.log('DATA OBJ', dataObj)
    setDataAction(dataObj)

    openModal()
  }

  const openModal = () => {
    (document.querySelector('.open-modal-confirmation') as HTMLElement)?.click()
  }


  const outputsCollaborator = useCallback((collaborator: GetCollaboratorsInterface['collaborators']) => {
    return collaborator.Outputs.filter(out => out.finality === 'collaborator')
  }, [])

  const outputsDepartment = useCallback((collaborator: GetCollaboratorsInterface['collaborators']) => {
    return outputs.filter(out => out.Collaborator.department === collaborator.department && out.finality === 'department')
  }, [outputs])

  useEffect(() => {
    if (state.success) {
      window.location.reload();
    }
  }, [state.success])
  return (
    <>
      <ConfirmModal
        action={action}
        products={
          outputToReturn.map(prod => ({
            id: prod.id,
            quantity: prod.quantity ?? 0,
            product: prod.Product.product,
            size: prod.Product.size,
            service: prod.Product.service,
            finality: prod.Product.finality,
          }))
        }
        finality='Devolução'
        collaborator={selectedCollaborator}
        dataAction={dataAction}
        resultReader={resultReader}
        clear={clear}
      />
      <CardPanelCollaborator collaborators={collaborators} onSelect={setSelectedCollaborator} disabled clear={clear} resultReader={resultReader} />

      {
        selectedCollaborator && <>
          {
            state?.message &&
            <div className="mt-10 mb-2">
              <SlackMessage
                message={state?.message}
                type={state?.success ? 'success' : 'error'}
              />
            </div>
          }
          <div className='bg-panelWhite shadow-2xl p-7 mt-10 rounded-xl bg-white'>

            <div className='lg:max-h-[calc(100vh-335px)] max-h-screen overflow-auto'>
              {outputsCollaborator(selectedCollaborator).length > 0 &&
                <><p className='text-slate-700'>Pendências do colaborador:</p>
                  <TableReturnProducts
                    title='Lista de pendências do colaborador'
                    outputs={outputsCollaborator(selectedCollaborator)}
                    addOutputReturn={addOutputReturn}
                    removeOutputReturn={removeOutputReturn}
                    outputToReturn={outputToReturn}
                  />
                </>
              }
              {
                outputsDepartment(selectedCollaborator).length > 0 &&
                <><p className='text-slate-700'>Pendências do departamento:</p>
                  <TableReturnProducts
                    title='Lista de pendências do departamento'
                    outputs={outputsDepartment(selectedCollaborator)}
                    addOutputReturn={addOutputReturn}
                    removeOutputReturn={removeOutputReturn}
                    outputToReturn={outputToReturn}
                  />
                </>
              }
            </div>
              <form  action={handleForm} className='w-full flex justify-end pr-5'>
                <input type="hidden" name="collaborator_id" value={selectedCollaborator?.id} />
                <input type="hidden" name="products" value={JSON.stringify(outputToReturn)} />
                <Button disabled={!outputToReturn.length}>Confirmar</Button>
              </form>
          </div>

        </>
      }
    </>
  )
}

export default RetrunProduct