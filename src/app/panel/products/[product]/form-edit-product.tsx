'use client'
import { actionEditProduct, StateEditProduct } from '@/actions/serverActions/edit-product'
import SlackMessage from '@/components/interface/SlackMessage'
import { Input } from '@/components/ui/input'
import MoneyInput from '@/components/ui/inputMoney'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import { useFormState } from 'react-dom'

interface FormEditProductProps {
  product: {
    product: string;
    id: string;
    service: string;
    type: string;
    size: string;
    unitary_value: number;
    createdAt: Date;
    updatedAt: Date;
    Inventory: {
      id: string;
      product_id: string;
      amount: number;
      createdAt: Date;
      updatedAt: Date;
    }[];
    Input: {
      id: string;
      product_id: string;
      amount: number;
      createdAt: Date;
      updatedAt: Date;
      user: string;
    }[];
    Output: {
      id: string;
      product_id: string;
      amount: number;
      createdAt: Date;
      updatedAt: Date;
      user_id: string;
      collaborator_id: string;
      forSector: boolean;
      status: boolean;
      obs: string;
      expiration: boolean;
      collaboratorId: string | null;
    }[],
    BarCodes: {
      code: string;
      product_id: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  },
  services: {
    service: string;
    createdAt: Date;
    updatedAt: Date;
  }[],
  types: {
    type: string;
    createdAt: Date;
    updatedAt: Date;
  }[],
}
const FormEditProduct = ({ product, services, types }: FormEditProductProps) => {
  const [state, action] = useFormState(actionEditProduct, {} as StateEditProduct)

  return (
    <form action={action} className="flex flex-col gap-5">
      {
        state?.message &&
        <div className='my-5'>
          <SlackMessage
            message={state.message}
            type={state.success ? 'success' : 'error'}
          />
        </div>
      }
      <label>
        <span>Nome:</span>
        <Input type="text" name='product' className="w-full p-2 rounded-md" defaultValue={product?.product} />
        {state?.errors && <p className="text-red-500">{state.errors.product}</p>}
      </label>
      <label>
        <span>Tamanho:</span>
        <Input type="text" name='size' className="w-full p-2 rounded-md" defaultValue={product?.size} />
        {state?.errors && <p className="text-red-500">{state.errors.size}</p>}
      </label>
      <label>
        <span>Valor Unitário:</span>
        <MoneyInput placeholder='Informe o valor' name='unitary_value' className="w-full p-2 rounded-md" value={product?.unitary_value} />
        {state?.errors && <p className="text-red-500">{state.errors.unitary_value}</p>}
      </label>

      <label>
        <span>Marca:</span>
        <Select name='service' defaultValue={product?.service}>
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
      </label>

      <label>
        <span>Tag:</span>
        <Select name='tag' defaultValue={product?.type}>
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
      </label>
      <button type="submit" className="bg-primary text-white p-2 rounded-md">Salvar</button>
      <input type="hidden" name="id" defaultValue={product.id} />
    </form>
  )
}

export default FormEditProduct