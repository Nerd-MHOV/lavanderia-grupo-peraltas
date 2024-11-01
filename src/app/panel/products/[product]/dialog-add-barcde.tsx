'use client'
import { actionRegisterBarcode, StateActionRegisterBarcode } from '@/actions/serverActions/register-barcode'
import SlackMessage from '@/components/interface/SlackMessage'
import { Button } from '@/components/ui/button'
import ButtonSpin from '@/components/ui/buttonSpin'
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useFormState } from 'react-dom'

const DialogAddBarcode = ({ product_id }: { product_id: string }) => {
  const [state, action] = useFormState(actionRegisterBarcode, {} as StateActionRegisterBarcode)
  const [barcodes, setBarcodes] = useState<string[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  // input with enter key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const barcode = ref?.current?.value
        if (barcode) {
          ref.current.value = '';

          setBarcodes(prev => {
            if (prev.includes(barcode)) return prev
            return [...prev, barcode]
          })
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  useEffect(() => {
    if (state.success) {
      setBarcodes([])
    }
  }, [state.success])
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm'><Plus /> Cadastrar</Button>
      </DialogTrigger>


      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Código </DialogTitle>
          <DialogDescription>
            Use o leitor de códigos para inserir um novo código de barras.
          </DialogDescription>
        </DialogHeader>
        <form action={action}>
          {
            state.message && <SlackMessage message={state.message} type={state.success ? 'success' : 'error'} />
          }
          <div className='my-4'>
            <Input ref={ref} type='text' placeholder='000021390' autoComplete='off' />
            {state?.errors && <p className="text-red-500">{state.errors.barcodes}</p>}
          </div>
          <ul className=' max-h-48 overflow-auto'>
            {barcodes.map(bc => (
              <ol className='hover:bg-red-100 cursor-pointer p-1' onClick={() => {
                setBarcodes(prev => prev.filter(pv => pv !== bc))
              }}>{bc}</ol>
            ))}
          </ul>
          <input type="hidden" name="barcodes" value={JSON.stringify(barcodes)} />
          <input type="hidden" name="product_id" value={product_id} />
          <DialogFooter>
            <ButtonSpin text='Cadastrar' />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogAddBarcode