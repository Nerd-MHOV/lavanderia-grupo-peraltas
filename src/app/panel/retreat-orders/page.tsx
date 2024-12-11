import getOutputOrdersGroupUser from '@/core/server/output-orders/getOutputOrdersGroupUsers'
import React from 'react'
import ListRetreatOrders from './list-restreat-orders';

const OrdersPage = async () => {
  const outputOrders = (await getOutputOrdersGroupUser()).outputOrdersGroupUser;
  return (
    <div className='px-5 py-5 flex justify-around'>
      <ListRetreatOrders outputOrders={outputOrders}  />
    </div>
  )
}

export default OrdersPage