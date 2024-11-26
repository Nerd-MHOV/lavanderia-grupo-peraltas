'use client';

import { actionCreateCollaborator, StateActionCreateCollaborator } from '@/actions/serverActions/create-collaborator';
import SlackMessage from '@/components/interface/SlackMessage';
import { Button } from '@/components/ui/button';
import ButtonSpin from '@/components/ui/buttonSpin';
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input';
import CPFInput from '@/components/ui/inputCPF';
import MultiSelect from '@/components/ui/multiSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDepartments } from '@/core/server/department/getDepartments';
import { Plus } from 'lucide-react';
import React, { useRef } from 'react'
import { useFormState } from 'react-dom';

const permissions = [
    { label: "items de colaborador", value: "collaborator" },
    { label: "items de departamento", value: "department" },
];

const DialogCreateCollaborator = ({ departments }: {
    departments: getDepartments['departments']
}) => {
    const [state, action] = useFormState(actionCreateCollaborator, {} as StateActionCreateCollaborator)
    const ref = useRef<HTMLFormElement>(null)
    if (ref.current && state.success) {
        ref.current.reset()
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size='sm'><Plus />Colaborador</Button>
            </DialogTrigger>


            <DialogContent className='max-h-screen overflow-auto'>
                <DialogHeader>
                    <DialogTitle>Criar Colaborador</DialogTitle>
                    <DialogDescription>
                        Informe os dados do colaborador.
                    </DialogDescription>
                </DialogHeader>
                <form method='post' ref={ref} action={action}>
                    {
                        state.message && <SlackMessage message={state.message} type={state.success ? 'success' : 'error'} />
                    }
                    <div className='my-4 flex flex-col gap-4'>
                        <Select name='department'>
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

                        <Select name='type'>
                            <SelectTrigger>
                                <SelectValue placeholder='Selecione a situação do colaborador' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='pj'>PJ</SelectItem>
                                <SelectItem value='registrado'>REGISTRADO</SelectItem>
                                <SelectItem value='diarista'>DIARISTA</SelectItem>
                            </SelectContent>
                        </Select>
                        {state?.errors && <p className="text-red-500">{state.errors.type}</p>}

                        <MultiSelect
                            placeholder="Selecione as permissões"
                            options={permissions}
                            name='canRetreat'
                        />
                        {state?.errors && <p className="text-red-500">{state.errors.canRetreat}</p>}


                        <Input type='text' placeholder='Nome completo' name='name' autoComplete='off' />
                        {state?.errors && <p className="text-red-500">{state.errors.name}</p>}

                        <CPFInput
                            name='cpf'
                            placeholder='CPF'
                        />
                        {state?.errors && <p className="text-red-500">{state.errors.cpf}</p>}

                    </div>
                    <DialogFooter>
                        <ButtonSpin text='Cadastrar Colaborador' />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default DialogCreateCollaborator