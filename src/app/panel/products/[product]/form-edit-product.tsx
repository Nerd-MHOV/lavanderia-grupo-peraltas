'use client'
import { actionEditProduct, StateEditProduct } from '@/actions/serverActions/edit-product'
import SlackMessage from '@/components/interface/SlackMessage'
import { Input } from '@/components/ui/input'
import MoneyInput from '@/components/ui/inputMoney'
import MultiSelect from '@/components/ui/multiSelect'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GetaProductInterface } from '@/core/server/product/getaProduct'
import React from 'react'
import { useFormState } from 'react-dom'

interface FormEditProductProps {
  product: GetaProductInterface['product'],
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
  departments: {
    department: string;
  }[],
}
const FormEditProduct = ({ product, services, types, departments }: FormEditProductProps) => {
  const [state, action] = useFormState(actionEditProduct, {} as StateEditProduct)

  return (
    <form method='post' action={action} className="flex flex-col gap-5">
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

      <label>
        <span>Finalidade:</span>
        <Select name='finality' defaultValue={product.finality}>
          <SelectTrigger>
            <SelectValue placeholder='Selecione a finaliade' />
          </SelectTrigger>
          <SelectContent>
            <SelectContent>
              <SelectItem value={'department'} >para departamento</SelectItem>
              <SelectItem value={'collaborator'} >para colaborador</SelectItem>
            </SelectContent>
          </SelectContent>
        </Select>
        {state?.errors && <p className="text-red-500">{state.errors.finality}</p>}
      </label>

      <label>
        <span>Departamentos:</span>
        <MultiSelect
          placeholder="Selecione os departamentos"
          options={departments.map(dep => ({ label: dep.department, value: dep.department }))}
          name='departments'
          defaultValue={product.Departments.map( dep => ({ label: dep.department, value: dep.department }) )}
        />
        {state?.errors && <p className="text-red-500">{state.errors.departments}</p>}
      </label>
      <button type="submit" className="bg-primary text-white p-2 rounded-md">Salvar</button>
      <input type="hidden" name="id" defaultValue={product.id} />
    </form>
  )
}

export default FormEditProduct