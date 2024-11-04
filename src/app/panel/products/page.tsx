import getProducts from '@/core/server/product/getProducts'
import React from 'react'
import DialogCreateTagProduct from './dialog-create-tag-product'
import DialogCreateServiceProduct from './dialog-create-service-product'
import DialogCreateProduct from './dialog-create-product'
import getServices from '@/core/server/services/getServices'
import getTypes from '@/core/server/type/getTypes'
import ListProducts from './list-products'

const Products = async () => {
  const products = (await getProducts()).products;
  const services = (await getServices()).services;
  const types = (await getTypes()).types;
  return (
    <div className='px-10 py-3 relative'>
      <div className='bg-panelWhite p-7 rounded-xl shadow-2xl items-center w-full flex justify-between' >
        <h1 className='text-xl font-bold'>Produtos</h1>

        <div className='flex gap-2'>
          <DialogCreateTagProduct />
          <DialogCreateServiceProduct />
          <DialogCreateProduct types={types} services={services} />
        </div>
      </div>

      <ListProducts products={products} />
    </div>
  )
}

export default Products