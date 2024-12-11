import { Button } from '@/components/ui/button'
import { GetOutputOrdersGroupUserInterface } from '@/core/server/output-orders/getOutputOrdersGroupUsers'
import { ArrowLeft, User } from 'lucide-react'
import React from 'react'

const OutputOrderDescribe = ({
    close,
    selected
}: {
    close: VoidFunction,
    selected: GetOutputOrdersGroupUserInterface['outputOrdersGroupUser']
}) => {
    return (
        <div>
            <div
                className='shadow-lg p-3 rounded-md ease-linear transition-all duration-300'
            >
                <div className='block sm:hidden'>
                    <ArrowLeft
                        onClick={close}
                        className='cursor-pointer text-slate-500'
                        width={30}
                        height={20}
                    />
                </div>
                <div className='flex gap-5'>
                    <div>

                        <UserOrderDescriber
                            name={selected.name}
                            department={selected.department}
                        />
                        <div className='p-4 text-lg mb-8 mt-4'>
                            {
                                selected.OutputOrder
                                    .some(o => o.Product.finality === 'collaborator') &&
                                <ListProductsOrderDescribe 
                                    title='Items de Colaborador:'
                                    list={selected.OutputOrder
                                            .filter(o => o.Product.finality === 'collaborator')}
                                />
                            }

                            {
                                selected.OutputOrder
                                    .some(o => o.Product.finality === 'department') &&
                                <ListProductsOrderDescribe 
                                    title='Items de Departamento:'
                                    list={selected.OutputOrder
                                            .filter(o => o.Product.finality === 'department')}
                                />
                            }
                        </div>
                        <ButtonsOrderDescribe />
                    </div>
                </div>
            </div>
        </div>
    )
}



const ButtonsOrderDescribe = () => (
    <div className='flex justify-between px-8 '>
        <Button className='bg-btnRed hover:bg-btnRedHover font-bold '> Remover</Button>
        <Button className='bg-btnGreen hover:bg-btnGreenHover font-bold '>Entregar</Button>
    </div>
)

const UserOrderDescriber = (props: { name: string, department: string }) => (
    <div className='flex gap-10 p-5 justify-center items-center'>
        <User className='bg-slate-100 shadow-sm rounded-full text-slate-600' width={70} height={50} />
        <div className='text-center font-bold'>
            <h1 className='text-lg'>{props.name}</h1>
            <h2 className='tracking-widest uppercase'>{props.department}</h2>
        </div>
    </div>
)

const ListProductsOrderDescribe = (props: { title: string, list: {
    id: string,
    amount: number,
    Product: {
        product: string,
        size: string,
        service: string
    }
}[]}) => (
    <>
        <label htmlFor="" className='tracking-widest underline underline-offset-4'>
            {props.title}
        </label>

        <ol className='my-5 divide-y pl-5'>
            {props.list.map(prod => (
                <li key={prod.id}> <b>{prod.amount}x</b> -- {prod.Product.product} {prod.Product.size} {prod.Product.service}</li>
            ))}
        </ol>
    </>
)

export default OutputOrderDescribe