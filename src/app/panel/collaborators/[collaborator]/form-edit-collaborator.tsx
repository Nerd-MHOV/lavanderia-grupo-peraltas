'use client'
import { actionEditCollaborator, StateEditCollaborator } from '@/actions/serverActions/edit-collaborator'
import SlackMessage from '@/components/interface/SlackMessage'
import { Input } from '@/components/ui/input'
import CPFInput from '@/components/ui/inputCPF'
import MultiSelect from '@/components/ui/multiSelect'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GetaCollaboratorInterface } from '@/core/server/collaborator/getaCollaborator'
import React from 'react'
import { useFormState } from 'react-dom'

export const canRetreatOptions = [
  { label: 'items de colaborador', value: 'collaborator' },
  { label: 'items de departamento', value: 'department' }
]

interface FormEditCollaboratorProps {
  collaborator: GetaCollaboratorInterface['collaborator'],
  departments: { department: string }[],
}
const FormEditCollaborator = ({ collaborator, departments }: FormEditCollaboratorProps) => {
  const [state, action] = useFormState(actionEditCollaborator, {} as StateEditCollaborator)

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
        <Input type="text" name='name' className="w-full p-2 rounded-md" defaultValue={collaborator.name} />
        {state?.errors && <p className="text-red-500">{state.errors.name}</p>}
      </label>
      <label>
        <span>CPF:</span>
        <CPFInput name='cpf' className="w-full p-2 rounded-md" placeholder='CPF do colaborador' value={collaborator.cpf} />
        {state?.errors && <p className="text-red-500">{state.errors.cpf}</p>}
      </label>

      <label>
        <span>Departamento:</span>
        <Select name='department' defaultValue={collaborator?.department}>
          <SelectTrigger>
            <SelectValue placeholder='Selecione o departamento' />
          </SelectTrigger>
          <SelectContent>
            {departments.map(department => (
              <SelectItem key={department.department} value={department.department}>{department.department}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state?.errors && <p className="text-red-500">{state.errors.department}</p>}
      </label>

      <label>
        <span>Situação:</span>
        <Select name='type' defaultValue={collaborator?.type}>
          <SelectTrigger>
            <SelectValue placeholder='Selecione a Situação do colaborador' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='pj'>PJ</SelectItem>
            <SelectItem value='registrado'>REGISTRADO</SelectItem>
            <SelectItem value='diarista'>DIARISTA</SelectItem>
          </SelectContent>
        </Select>
        {state?.errors && <p className="text-red-500">{state.errors.type}</p>}
      </label>

      <label>
        <span>Ativo:</span>
        <Select name='active' defaultValue={collaborator.active ? 'true' : 'false'}>
          <SelectTrigger>
            <SelectValue placeholder='Colabordor ativo?' />
          </SelectTrigger>
          <SelectContent>
          <SelectItem value={'true'}>Ativo</SelectItem>
          <SelectItem value={'false'}>Desativado</SelectItem>
          </SelectContent>
        </Select>
        {state?.errors && <p className="text-red-500">{state.errors.active}</p>}
      </label>

      <label>
        <span>Permissões:</span>
        <MultiSelect
          placeholder="Selecione as permissões"
          options={canRetreatOptions}
          name='canRetreat'
          defaultValue={canRetreatOptions.filter(opt => (collaborator.canRetreat as string[]).includes(opt.value))}
        />
        {state?.errors && <p className="text-red-500">{state.errors.canRetreat}</p>}
      </label>
      <button type="submit" className="bg-primary text-white p-2 rounded-md">Salvar</button>
      <input type="hidden" name="id" defaultValue={collaborator.id} />
    </form>
  )
}

export default FormEditCollaborator