'use client'
import { actionAddInventoryProduct, StateActionAddInventoryProduct } from '@/actions/serverActions/add-inventory-product'
import SlackMessage from '@/components/interface/SlackMessage'
import { Button } from '@/components/ui/button'
import ButtonSpin from '@/components/ui/buttonSpin'
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { useFormState } from 'react-dom'

const DialogAddInventory = ({ product_id }: { product_id: string }) => {
  const [state, action] = useFormState(actionAddInventoryProduct, {} as StateActionAddInventoryProduct )

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm'><Plus /> Adicionar</Button>
      </DialogTrigger>


      <DialogContent>
        <DialogHeader>
          <DialogTitle>Entrada de Produto</DialogTitle>
          <DialogDescription>
            Coloque a quantidade de itens entrando para o estoque.
          </DialogDescription>
        </DialogHeader>
        <form action={action}>
          {
            state.message && <SlackMessage message={state.message} type={state.success ? 'success' : 'error'} />
          }
          <div className='my-4'>
            <Input name='amount' type='number' placeholder='Quantidade de itens para entrada' autoComplete='off' />
            {state?.errors && <p className="text-red-500">{state.errors.amount}</p>}
          </div>
          <input type="hidden" name="product_id" value={product_id} />
          <DialogFooter>
            <ButtonSpin text='Cadastrar' />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogAddInventory