'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator';
import { Settings2 } from 'lucide-react';
import DialogDeleteTypeProduct from './dialog-delete-type-product';

const DialogListTypesProducts = ({ types }: {
    types: {
        type: string
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
                    {types.map(({ type }, index) => <li key={index}>

                        <div className='flex justify-between w-full mt-2 px-4'>
                            <p>{type}</p>
                            <div className='flex gap-2'>
                                {/* <Button size='sm' variant='link'><Edit /></Button> */}
                                <DialogDeleteTypeProduct type={type} />
                            </div>
                        </div>
                        <Separator />

                    </li>)}
                </ol>
            </DialogContent>
        </Dialog>
    )
}

export default DialogListTypesProducts