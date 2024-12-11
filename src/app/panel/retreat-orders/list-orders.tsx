import { GetOutputOrdersGroupUserInterface } from '@/core/server/output-orders/getOutputOrdersGroupUsers'
import { cn } from '@/lib/utils'
import { Tags } from 'lucide-react'
import React from 'react'

const ListOrders = ({
    selected,
    outputOrders,
    handleClick
}: {
    selected: GetOutputOrdersGroupUserInterface['outputOrdersGroupUser'] | null,
    outputOrders: GetOutputOrdersGroupUserInterface['outputOrdersGroupUser'][],
    handleClick: (order: GetOutputOrdersGroupUserInterface['outputOrdersGroupUser']) => void
}) => {
    return (
        <div className={cn(
            `flex gap-5 flex-col max-h-[calc(100vh-100px)] overflow-auto p-8`,
            selected !== null ? 'sm:flex hidden' : ''
        )}>
            {[...outputOrders].map(order => (

                <div
                    key={order.id}
                    className={
                        cn(`flex bg-white relative z-10 gap-1 shadow-md p-5 
                        rounded-md cursor-pointer ease-linear transition-all 
                        duration-300 hover:shadow-lg`,
                            selected?.id === order.id ? 'bg-slate-400' : ''
                        )
                    }
                    onClick={() => handleClick(order)}
                >
                    <div className='flex justify-center items-center gap-5 font-bold
                            text-slate-600'>
                        <div className='border-2 rounded-full border-slate-600 p-2'>
                            <Tags width={30} height={30} color='#475569' />
                        </div>
                        <h1>{order.name}</h1>
                    </div>
                </div>

            ))}
        </div>
    )
}

export default ListOrders