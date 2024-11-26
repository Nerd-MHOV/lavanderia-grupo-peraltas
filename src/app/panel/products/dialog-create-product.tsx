'use client'
import { actionCreateProduct, StateActionCreateProduct } from '@/actions/serverActions/create-product'
import SlackMessage from '@/components/interface/SlackMessage'
import { Button } from '@/components/ui/button'
import ButtonSpin from '@/components/ui/buttonSpin'
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import InputMoney from '@/components/ui/inputMoney'
import MultiSelect from '@/components/ui/multiSelect'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import React, { useRef } from 'react'
import { useFormState } from 'react-dom'


interface DialogCreateProductProps {
  types: {
    type: string;
  }[];
  services: {
    service: string;
  }[],
  departments: {
    department: string;
  }[],
}
const DialogCreateProduct = ({ types, services, departments }: DialogCreateProductProps) => {
  const [state, action] = useFormState(actionCreateProduct, {} as StateActionCreateProduct)
  const ref = useRef<HTMLFormElement>(null)
  if (ref.current && state.success) {
    ref.current.reset()
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm'><Plus />Produto</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Produto</DialogTitle>
          <DialogDescription>
            Esse são os items de controle, ex: Camiseta Amarela, Lençou branco, etc.
          </DialogDescription>
        </DialogHeader>
        <form  ref={ref} action={action}>
          {
            state.message && <SlackMessage message={state.message} type={state.success ? 'success' : 'error'} />
          }
          <div className='my-4 flex flex-col gap-4'>
            <Select name='tag'>
              <SelectTrigger>
                <SelectValue placeholder='Selecione a Tag' />
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type.type} value={type.type}>{type.type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors && <p className="text-red-500">{state.errors.tag}</p>}

            <Select name='service'>
              <SelectTrigger>
                <SelectValue placeholder='Selecione a Marca' />
              </SelectTrigger>
              <SelectContent>
                {services.map(service => (
                  <SelectItem key={service.service} value={service.service}>{service.service}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors && <p className="text-red-500">{state.errors.service}</p>}

            <Select name='finality'>
              <SelectTrigger>
                <SelectValue placeholder='selecione a finalidade' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={'department'} >para departamento</SelectItem>
                <SelectItem value={'collaborator'} >para colaborador</SelectItem>
              </SelectContent>
            </Select>
            {state?.errors && <p className="text-red-500">{state.errors.finality}</p>}

            <MultiSelect
              placeholder="Selecione os departamentos"
              options={departments.map(dep => ({ label: dep.department, value: dep.department }))}
              name='departments'
            />
            {state?.errors && <p className="text-red-500">{state.errors.departments}</p>}

            <Input type='text' placeholder='Nome do produto' name='product' autoComplete='off' />
            {state?.errors && <p className="text-red-500">{state.errors.product}</p>}

            <Input type='text' placeholder='Tamanho' name='size' autoComplete='off' />
            {state?.errors && <p className="text-red-500">{state.errors.size}</p>}

            <InputMoney
              name='unitary_value'
              placeholder='Valor unitário'
            />
            {state?.errors && <p className="text-red-500">{state.errors.unitary_value}</p>}
          </div>
          <DialogFooter>
            <ButtonSpin text='Criar Produto' />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogCreateProduct