import { Button } from '@/components/ui/button'
import React from 'react'
import { useFormStatus } from 'react-dom';

const ButtonFormLogin = () => {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending} variant='outline' className="bg-btnGreen hover:bg-btnGreenHover hover:text-white font-bold text-white border-none">
            {pending ? 'Carregando...' : 'Logar-se'}
        </Button>
    )
}

export default ButtonFormLogin