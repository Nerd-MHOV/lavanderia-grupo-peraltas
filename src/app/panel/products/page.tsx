import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import getProducts from '@/core/server/product/getProducts'
import { Edit, Search } from 'lucide-react'
import React from 'react'
import DialogCreateTagProduct from './dialog-create-tag-product'
import DialogCreateServiceProduct from './dialog-create-service-product'
import DialogCreateProduct from './dialog-create-product'
import getServices from '@/core/server/services/getServices'
import getTypes from '@/core/server/type/getTypes'
import Link from 'next/link'

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

      <div className='bg-panelWhite p-7 rounded-xl shadow-2xl my-5'>

        <div className='flex items-center max-w-96 border-b-2 mb-2'>
          <Input type='text' placeholder='Buscar' className='w-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-transparent ' />
          <Search className='mr-2' />
        </div>
        <div className='lg:max-h-[calc(100vh-300px)] max-h-screen overflow-auto'>
          <Table>
            <TableCaption>Lista de produtos cadastrados</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Editar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                products.map(prod => (
                  <TableRow key={prod.id}>
                    <TableCell>{prod.product}</TableCell>
                    <TableCell>{prod.size}</TableCell>
                    <TableCell>{prod.service}</TableCell>
                    <TableCell>{prod.type}</TableCell>
                    <TableCell>
                      <Link href={`/panel/products/${prod.id}`}>
                        <Button size='sm' variant='outline' className='bg-orange-200 text-orange-800'><Edit /> Editar</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default Products