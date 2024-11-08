'use client';

import { actionCreateDepartment, StateActionCreateDepartment } from '@/actions/serverActions/create-department';
import SlackMessage from '@/components/interface/SlackMessage';
import { Button } from '@/components/ui/button';
import ButtonSpin from '@/components/ui/buttonSpin';
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import React, { useRef } from 'react'
import { useFormState } from 'react-dom';

const DialogCreateDepartment = () => {
    const [state, action] = useFormState(actionCreateDepartment, {} as StateActionCreateDepartment)
    const ref = useRef<HTMLFormElement>(null)
    if (ref.current && state.success) {
        ref.current.reset()
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size='sm'><Plus />Departamento</Button>
            </DialogTrigger>


            <DialogContent className='max-h-screen overflow-auto'>
                <DialogHeader>
                    <DialogTitle>Criar Departamento</DialogTitle>
                    <DialogDescription>
                        Crie um novo departamento, para cadastrar seus colaboradores.
                    </DialogDescription>
                </DialogHeader>
                <form ref={ref} action={action}>
                    {
                        state.message && <SlackMessage message={state.message} type={state.success ? 'success' : 'error'} />
                    }
                    <div className='my-4 flex flex-col gap-4'>
                       
                        <Input type='text' placeholder='informe o nome do departamento' name='department' autoComplete='off' />
                        {state?.errors && <p className="text-red-500">{state.errors.department}</p>}

                    </div>
                    <DialogFooter>
                        <ButtonSpin text='Criar Departamento' />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default DialogCreateDepartment