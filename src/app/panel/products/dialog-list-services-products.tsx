'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator';
import { Settings2 } from 'lucide-react';
import DialogDeleteServiceProduct from './dialog-delete-service-product';

const DialogListServicesProducts = ({ services }: {
    services: {
        service: string
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
                    {services.map(({ service }, index) => <li key={index}>

                        <div className='flex justify-between w-full mt-2 px-4'>
                            <p>{service}</p>
                            <div className='flex gap-2'>
                                {/* <Button size='sm' variant='link'><Edit /></Button> */}
                                <DialogDeleteServiceProduct service={service} />
                            </div>
                        </div>
                        <Separator />

                    </li>)}
                </ol>
            </DialogContent>
        </Dialog>
    )
}

export default DialogListServicesProducts