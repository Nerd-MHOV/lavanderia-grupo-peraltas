import { Button } from '@/components/ui/button';
import getOutputOrdersGroupUser from '@/core/server/output-orders/getOutputOrdersGroupUsers'
import { User } from 'lucide-react'
import React from 'react'

const OrdersPage = async () => {
  const outputOrders = (await getOutputOrdersGroupUser()).outputOrdersGroupUser;
  const selected = outputOrders[0];
  return (
    <div className='px-20 py-5 flex justify-around'>
      <div className='flex gap-5 flex-col max-h-[calc(100vh-100px)] overflow-auto p-8'>
        {[...outputOrders, ...outputOrders, ...outputOrders].map(order => (
          <div key={order.id} className='flex bg-white relative z-10 gap-1 shadow-2xl p-5  rounded-md'>
            <div>
              <h1>{order.name}</h1>
            </div>
          </div>
        ))}

      </div>
      <div>
        <div className='shadow-2xl p-3 rounded-md'>
          <div className='flex gap-5'>
            <div>
              <div className='flex gap-10 p-5 justify-center items-center'>
                <User className='bg-slate-200 shadow-sm rounded-full text-slate-700' width={70} height={50} />
                <div className='text-center font-bold'>
                  <h1 className='text-lg'>{selected.name}</h1>
                  <h2 className='tracking-widest uppercase'>{selected.department}</h2>
                </div>
              </div>

              <div className='p-4 text-lg mb-8 mt-4'>
                {
                  selected.OutputOrder.some(o => o.Product.finality === 'collaborator') &&
                  <>
                    <label htmlFor="">Items de Colaborador:</label>

                    <ol className='my-5 divide-y pl-5'>
                      {selected.OutputOrder.filter(o => o.Product.finality === 'collaborator').map(prod => (
                        <li key={prod.id}> <b>{prod.amount}x</b> -- {prod.Product.product} {prod.Product.size} {prod.Product.service}</li>
                      ))}
                    </ol>
                  </>
                }

                {
                  selected.OutputOrder.some(o => o.Product.finality === 'department') &&
                  <>
                    <label htmlFor="">Items de Departamento:</label>

                    <ol className='my-5 divide-y pl-5'>
                      {selected.OutputOrder.filter(o => o.Product.finality === 'department').map(prod => (
                        <li key={prod.id}> <b>{prod.amount}x</b> -- {prod.Product.product} {prod.Product.size} {prod.Product.service}</li>
                      ))}
                    </ol>
                  </>
                }
              </div>

              <div className='flex justify-between px-8 '>
                <Button className='bg-btnRed hover:bg-btnRedHover font-bold '> Remover</Button>
                <Button className='bg-btnGreen hover:bg-btnGreenHover font-bold '>Entregar</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersPage