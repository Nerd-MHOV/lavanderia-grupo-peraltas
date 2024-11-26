'use client'
import { actionCreateService, StateActionCreateService } from '@/actions/serverActions/create-service'
import SlackMessage from '@/components/interface/SlackMessage'
import { Button } from '@/components/ui/button'
import ButtonSpin from '@/components/ui/buttonSpin'
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import React, { useRef } from 'react'
import { useFormState } from 'react-dom'
import DialogListServicesProducts from './dialog-list-services-products'

const DialogCreateServiceProduct = ({ services }: {
  services: {
    service: string
  }[]
}) => {
  const [state, action] = useFormState(actionCreateService, {} as StateActionCreateService)
  const ref = useRef<HTMLFormElement>(null)
  if (ref.current && state.success) {
    ref.current.reset()
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm'><Plus />Marca</Button>
      </DialogTrigger>


      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Marca</DialogTitle>
          <DialogDescription>
            Usamos as `marcas` para identificar a empresa que esta sendo tratada, ex: Brotas Eco, CEU, Peraltas, etc.
          </DialogDescription>

          <div className='absolute top-1 right-3'>
            <DialogListServicesProducts services={services} />

          </div>
        </DialogHeader>
        <form  ref={ref} action={action}>
          {
            state.message && <SlackMessage message={state.message} type={state.success ? 'success' : 'error'} />
          }
          <div className='my-4'>
            <Input type='text' placeholder='Nome da marca' name='service' autoComplete='off' />
            {state?.errors && <p className="text-red-500">{state.errors.service}</p>}
          </div>
          <DialogFooter>
            <ButtonSpin text='Criar Marca' />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogCreateServiceProduct