'use client'
import { actionDeleteDepartment } from '@/actions/serverActions/delete-department'
import { Button } from '@/components/ui/button'
import ButtonSpin from '@/components/ui/buttonSpin'
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'


const DialogDeleteDepartment = ({ department }: { department: string }) => {
  const [message, setMessage] = useState('')
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' variant='link'><Trash2 /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deseja deletar o Departamento ?</DialogTitle>
          <DialogDescription>

            {department}

            {/* <p className='p-2 text-red-400 bg-zinc-100 border-red-300 border rounded-md my-2'><b>Atenção</b> ao deletar o produto, será <b>apagado</b> todas as <b>entradas</b>, <b>logs</b> de <b>devolução</b> e <b>retiradas</b>, referente ao mesmo!</p> */}
            {
              message && <p className='text-red-800 bg-red-200 p-2'>{message}</p>
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' >Cancelar</Button>
          </DialogClose>
          <ButtonSpin onClick={async () => {
            const response =  actionDeleteDepartment(department)
            setMessage((await response)?.message || '')
          }} text='deletar' className='bg-red-200 text-red-800 hover:bg-red-300' />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DialogDeleteDepartment