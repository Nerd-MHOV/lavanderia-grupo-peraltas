'use client'


import React, { useCallback, useEffect } from 'react'
import CardPanelCollaborator from '../retreat/retreat-components/card-panel-collaborator'
import useFaceReader from '@/hooks/useFaceReader'
import { GetCollaboratorsInterface } from '@/core/server/collaborator/getCollaborators'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import finalityProductTypeMap from '@/core/server/product/finalityProductTypeMap'
import { CircleMinus } from 'lucide-react'
import { useFormState } from 'react-dom'
import { actionReturnProducts, StateActionReturnProducts } from '@/actions/serverActions/return-products'
import SlackMessage from '@/components/interface/SlackMessage'


type OutputsQuantity = (
  GetCollaboratorsInterface['collaborators']['Outputs'][0] & { quantity?: number }
)
const RetrunProduct = ({ collaborators }: {
  collaborators: GetCollaboratorsInterface['collaborators'][]
}) => {
  const [state, action] = useFormState(actionReturnProducts, {} as StateActionReturnProducts)
  const { resultReader, clear } = useFaceReader([collaborators]);
  const [selectedCollaborator, setSelectedCollaborator] = React.useState<GetCollaboratorsInterface['collaborators'] | null>(null);
  const [outputToReturn, setOutputToReturn] = React.useState<OutputsQuantity[] | []>([]);
  
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


  useEffect(() => {
    if (state.success) {
      window.location.reload();
    }
  }, [state.success])
  return (
    <>
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
          <div className='bg-panelWhite shadow-2xl p-7 mt-10 rounded-xl'>

            <div className='lg:max-h-[calc(100vh-300px)] max-h-screen overflow-auto'>
              <Table>
                <TableCaption>Lista de pendências</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Tag</TableHead>
                    <TableHead>Finalidade</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead className='text-end'>Devolver</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    selectedCollaborator?.Outputs.map(output => {
                      const prodFind = outputToReturn.find((p) => p.id === output.id)
                      return (
                        <TableRow key={output.id}>
                          <TableCell>{output.Product.product}</TableCell>
                          <TableCell>{output.Product.size}</TableCell>
                          <TableCell>{output.Product.service}</TableCell>
                          <TableCell>{output.Product.type}</TableCell>
                          <TableCell>{finalityProductTypeMap[output.finality]}</TableCell>
                          <TableCell className='font-bold'>{output.amount} unidades</TableCell>
                          <TableCell className='flex justify-end'>{
                            !prodFind ? (
                              <Button
                                className='bg-slate-200 hover:bg-slate-300 text-slate-500 font-bold py-2 px-4 rounded'
                                size='sm'
                                onClick={() => addOutputReturn(output)}
                              >Devolver</Button>
                            ) : (
                              <div className='flex gap-2 justify-between'>
                                <Button
                                  className='bg-red-200 hover:bg-red-300 text-red-500 font-bold py-2 px-4 rounded'
                                  size='sm'
                                  onClick={() => removeOutputReturn(output)}
                                ><CircleMinus /></Button>
                                <Button
                                  className='bg-green-200 hover:bg-green-300 text-green-800 font-bold py-2 px-4 rounded'
                                  size='sm'
                                  onClick={() => addOutputReturn(output)}
                                >Devolver: {prodFind?.quantity}</Button>
                              </div>
                            )
                          }</TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
              <form action={action} className='w-full flex justify-end pr-5'>
                <input type="hidden" name="collaborator_id" value={selectedCollaborator?.id} />
                <input type="hidden" name="products" value={JSON.stringify(outputToReturn)} />
                <Button disabled={!outputToReturn.length}>Confirmar</Button>
              </form>
            </div>
          </div>

        </>
      }
    </>
  )
}

export default RetrunProduct