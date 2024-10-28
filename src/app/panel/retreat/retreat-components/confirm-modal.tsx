import { Button } from '@/components/ui/button';
import { DialogHeader, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import React, { useEffect } from 'react'
import { DataActionRetreatPage } from '../form-retreat';
import { FaceReader } from '@/hooks/useFaceReader';
import CPFOnlyNumber from '@/lib/cpf_only_number';

const ConfirmModal = ({ dataAction, action, resultReader, clear }: {
  dataAction: DataActionRetreatPage | null,
  action: (data: DataActionRetreatPage) => void
  resultReader: FaceReader | null
  clear: () => void
}) => {

  const [waiting, setWaiting] = React.useState(false)

  const handleConfirm = () => {
    setWaiting(true);
  }

  const closeModal = () => {
    (document.querySelector('.close-modal-confirmation') as HTMLElement)?.click()
  }


  useEffect(() => {
    if ( resultReader && waiting && dataAction?.collaborator ) {
      if ( CPFOnlyNumber(resultReader.id) === CPFOnlyNumber(dataAction?.collaborator?.cpf) ) {
        setWaiting(false);
        action(dataAction!);
        closeModal();
      }
      clear()
    }
  }, [action, dataAction, resultReader, waiting, clear])
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{
          waiting
            ? 'Confirme sua face!'
            : 'Esta tudo correto ?'
        }</DialogTitle>
        <DialogDescription>
          <h1 className='mt-2 mb-0 pl-4'>{dataAction?.collaborator?.name || ''}</h1>
          <h3 className='pl-10 mb-4'> --- {dataAction?.finality}</h3>
        </DialogDescription>
      </DialogHeader>

      {
        waiting 
        ? 'Coloque a face no leitor....'
        :  <ol className='my-5 divide-y '>
        {dataAction?.products.map(prod => (
          <li key={prod.id}> {prod.quantity}x {prod.product} {prod.size} {prod.service}</li>
        ))}
      </ol>
      }

      <DialogFooter>
        <Button disabled={waiting} className='mr-3 bg-btnGreen hover:bg-btnGreenHover' onClick={handleConfirm}>
          {
            waiting
              ? <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status">
                <span
                  className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                >Loading...</span>
              </div>
              : 'Confirmar'
          }
        </Button>
        <DialogClose>
          <Button className='bg-btnRed hover:bg-btnRedHover close-modal-confirmation'>Cancelar</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

export default ConfirmModal