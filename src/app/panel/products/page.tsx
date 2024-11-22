import getProducts from '@/core/server/product/getProducts'
import React from 'react'
import DialogCreateTypeProduct from './dialog-create-type-product'
import DialogCreateServiceProduct from './dialog-create-service-product'
import DialogCreateProduct from './dialog-create-product'
import getServices from '@/core/server/services/getServices'
import getTypes from '@/core/server/type/getTypes'
import ListProducts from './list-products'
import getDepartments from '@/core/server/department/getDepartments'
import DialogCreateDepartment from '../collaborators/dialog-create-department'

const Products = async () => {
  const products = (await getProducts()).products;
  const services = (await getServices()).services;
  const types = (await getTypes()).types;
  const departments = (await getDepartments()).departments;
  return (
    <div className='px-10 py-3 relative'>
      <div className='bg-panelWhite p-7 rounded-xl shadow-2xl items-center w-full flex justify-between' >
        <h1 className='text-xl font-bold'>Produtos</h1>

        <div className='flex gap-2'>
          <DialogCreateDepartment departments={departments} />
          <DialogCreateTypeProduct types={types} />
          <DialogCreateServiceProduct services={services}/>
          <DialogCreateProduct types={types} services={services} departments={departments} />
        </div>
      </div>

      <ListProducts products={products} />
    </div>
  )
}

export default Products