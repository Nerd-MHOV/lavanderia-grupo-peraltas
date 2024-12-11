'use client'
import {
    GetOutputOrdersGroupUserInterface
} from '@/core/server/output-orders/getOutputOrdersGroupUsers'
import React, { useState } from 'react'
import ListOrders from './list-orders'
import OutputOrderDescribe from './output-order-describe'

interface ListRetreatOrdersProps {
    outputOrders: GetOutputOrdersGroupUserInterface['outputOrdersGroupUser'][]
}

const ListRetreatOrders = ({
    outputOrders,
}: ListRetreatOrdersProps) => {
    const [selected, setSelected] = useState<ListRetreatOrdersProps["outputOrders"][0] | null>(null)


    const handleClick = (order: ListRetreatOrdersProps["outputOrders"][0]) => {
        setSelected(order);
    };
    return (
        <>
            <ListOrders 
                handleClick={handleClick}
                selected={selected}
                outputOrders={outputOrders}
            />
            {
                selected !== null && (
                    <OutputOrderDescribe 
                        close={() => setSelected(null)}
                        selected={selected}
                    />
                )
            }
        </>
    )
}

export default ListRetreatOrders