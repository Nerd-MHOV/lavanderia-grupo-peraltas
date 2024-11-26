'use client'
import { actionCreateTag, StateActionCreateTag } from '@/actions/serverActions/create-tag'
import SlackMessage from '@/components/interface/SlackMessage'
import { Button } from '@/components/ui/button'
import ButtonSpin from '@/components/ui/buttonSpin'
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import React, { useRef } from 'react'
import { useFormState } from 'react-dom'
import DialogListTypesProducts from './dialog-list-types-products'

const DialogCreateTypeProduct = ({ types }: {
  types: {
    type: string
  }[]
}) => {
  const [state, action] = useFormState(actionCreateTag, {} as StateActionCreateTag)
  const ref = useRef<HTMLFormElement>(null)
  if ( ref.current && state.success ) {
    ref.current.reset()
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm'><Plus />Tag</Button>
      </DialogTrigger>


      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Tag</DialogTitle>
          <DialogDescription>
            as tags, são usadas para identificar o tipo de peça que esta sendo tratada, ex: camisa, calça, etc.
          </DialogDescription>
          <div className='absolute top-1 right-3'>
                    <DialogListTypesProducts types={types} />

                    </div>
        </DialogHeader>
        <form  ref={ref} action={action}>
          {
            state.message && <SlackMessage message={state.message} type={state.success ? 'success' : 'error'} />
          }
          <div className='my-4'>
            <Input type='text' placeholder='Nome da Tag' name='tag' autoComplete='off' />
                {state?.errors && <p className="text-red-500">{state.errors.tag}</p>}
          </div>
          <DialogFooter>
              <ButtonSpin text='Criar Tag' />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogCreateTypeProduct