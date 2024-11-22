'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator';
import { Edit, Settings2 } from 'lucide-react';
import DialogDeleteDepartment from './dialog-delete-department';

const DialogListDepartment = ({ departments }: {
    departments: {
        department: string
    }[]
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size='sm' variant='link'><Settings2 />gerenciar</Button>
            </DialogTrigger>


            <DialogContent className='max-h-screen overflow-auto'>
                <DialogHeader>
                    <DialogTitle>Gerenciar Departamentos</DialogTitle>
                    {/* <DialogDescription>
                        Crie um novo departamento, para cadastrar seus colaboradores.
                    </DialogDescription> */}
                </DialogHeader>
                <ol>
                    {departments.map(({ department }, index) => <li key={index}>

                        <div className='flex justify-between w-full mt-2'>
                            <p>{department}</p>
                            <div className='flex gap-2'>
                                <Button size='sm' variant='link'><Edit /></Button>
                                <DialogDeleteDepartment department={department} />
                            </div>
                        </div>
                        <Separator />

                    </li>)}
                </ol>
            </DialogContent>
        </Dialog>
    )
}

export default DialogListDepartment