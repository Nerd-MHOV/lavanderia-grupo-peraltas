import getOutputOrdersGroupUser from '@/core/server/output-orders/getOutputOrdersGroupUsers'
import React from 'react'
import ListRetreatOrders from './list-restreat-orders';
import { ChartNoAxesGantt } from 'lucide-react';

const OrdersPage = async () => {
  const outputOrders = (await getOutputOrdersGroupUser()).outputOrdersGroupUser;
  return (
    <div className='px-5 py-5 flex justify-around'>
      {outputOrders.length === 0
        && <div className='flex justify-center items-center w-full mt-20 bg-panelWhite p-7 rounded-xl shadow-2xl'>

          <ChartNoAxesGantt /> <h1
            className='text-2xl font-bold text-center '
          >Não há pedidos de retirada pendentes</h1>

        </div>
      }
      <ListRetreatOrders outputOrders={outputOrders} />
    </div>
  )
}

export default OrdersPage