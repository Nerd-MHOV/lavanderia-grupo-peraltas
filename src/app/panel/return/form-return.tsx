import { Button } from '@/components/ui/button'
import React from 'react'
import { OutputsQuantity } from './return-product'

const FormReturn = ({
    onForm,
    collaborator_id,
    outputToReturn,
}:{
    onForm(data: {
        collaborator_id: string,
        products: OutputsQuantity[],
    }): void,
    collaborator_id?: string,
    outputToReturn: OutputsQuantity[]
}) => {
    const handleForm = (data: FormData) => {
        const dataObj = {
            collaborator_id: data.get('collaborator_id') as string,
            products: JSON.parse(data.get('products') as string)
        }
        onForm(dataObj)
        openModal()
    }
    const openModal = () => {
        (document.querySelector('.open-modal-confirmation') as HTMLElement)?.click()
    }
    return (
        <form action={handleForm} className='w-full flex justify-end pr-5'>
            <input type="hidden" name="collaborator_id" value={collaborator_id} />
            <input type="hidden" name="products" value={JSON.stringify(outputToReturn)} />
            <Button disabled={!outputToReturn.length}>Confirmar</Button>
        </form>
    )
}

export default FormReturn