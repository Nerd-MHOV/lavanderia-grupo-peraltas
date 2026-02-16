import { Button } from '@/components/ui/button';
import { DialogHeader, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogClose, Dialog, DialogTrigger } from '@/components/ui/dialog';
import React, { useEffect } from 'react'
import { FaceReader } from '@/hooks/useFaceReader';
import { CPFOnlyNumber } from '@/lib/cpf';
import Spin from '@/components/interface/Spin';

const ConfirmModal = <T,>({ dataAction, action, resultReader, products, collaborator, finality, clear }: {
  products: {
    id: string,
    quantity: number,
    product: string,
    size: string,
    service: string,
    finality: string,
  }[],
  collaborator?: {
    name: string,
    cpf: string,
  } | null;
  finality: string;
  dataAction: T | null,
  action: (data: T) => void
  resultReader: FaceReader | null
  clear: () => void
}) => {

  const [waiting, setWaiting] = React.useState(false)

  const handleConfirm = () => {
    setWaiting(true);
  }

  const handleCancel = () => {
    setWaiting(false);
  }

  const closeModal = () => {
    (document.querySelector('.close-modal-confirmation') as HTMLElement)?.click()
  }


  useEffect(() => {
    if (
        // resultReader &&
        waiting && collaborator) {
      // if (CPFOnlyNumber(resultReader.id) === CPFOnlyNumber(collaborator?.cpf)) {
        setWaiting(false);
        action(dataAction!);
        closeModal();
      // }
      clear()
    }
  }, [action, dataAction, resultReader, waiting, clear, collaborator])
  return (
    <Dialog>
      <DialogTrigger className='open-modal-confirmation' />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{
            waiting
              ? 'Confirme sua face!'
              : 'Esta tudo correto ?'
          }</DialogTitle>
          <DialogDescription>
            <h1 className='mt-2 mb-0 pl-4'>{collaborator?.name || ''}</h1>
            <h3 className='pl-10 mb-4'> --- {finality}</h3>
          </DialogDescription>
        </DialogHeader>

        {
          waiting
            ? 'Coloque a face no leitor....'
            : <>

              {
                products.some(p => p.finality === 'collaborator') &&
                <ol className='my-5 divide-y '>
                  {products.filter(p => p.finality === 'collaborator').map(prod => (
                    <li key={prod.id}> {prod.quantity}x {prod?.product} {prod.size} {prod.service}</li>
                  ))}
                </ol>
              }

              {
                products.some(p => p.finality === 'department') &&
                <ol className='my-5 divide-y '>
                  {products.filter(p => p.finality === 'department').map(prod => (
                    <li key={prod.id}> {prod.quantity}x {prod?.product} {prod.size} {prod.service}</li>
                  ))}
                </ol>
              }



            </>
        }

        <DialogFooter>
          <div className='flex gap-2 justify-end'>
            <Button disabled={waiting} className='mr-3 bg-btnGreen hover:bg-btnGreenHover' onClick={handleConfirm}>
              {
                waiting
                  ? <Spin />
                  : 'Confirmar'
              }
            </Button>
            <DialogClose>
              <Button className='bg-btnRed hover:bg-btnRedHover close-modal-confirmation' onClick={handleCancel}>Cancelar</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>

    </Dialog>

  )
}

export default ConfirmModal
