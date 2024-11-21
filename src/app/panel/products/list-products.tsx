'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import finalityProductTypeMap from '@/core/server/product/finalityProductTypeMap'
import { GetProductsInterface } from '@/core/server/product/getProducts'
import Fuse from 'fuse.js'
import { Edit, Search } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
const fuseOptions = {
    keys: ['complete'],
    isCaseSensitive: true,
    threshold: 0.4,
    includeMatches: true,
    includeScore: true,
    findAllMatches: true,
    ignoreLocation: true,
    useExtendedSearch: true,
} 

const ListProducts = ({ products }: {
    products: GetProductsInterface['products'][]
}) => {


    const [searchTerm, setSearchTerm] = useState('')
    const [filteredProducts, setFilteredProducts] = useState<GetProductsInterface['products'][]>(products)


    // find products by search term
    useEffect(() => {
        const fuse = new Fuse(products.map(prod => ({
            id: prod.id,
            product: prod.product,
            size: prod.size,
            service: prod.service,
            type: prod.type,
            complete: `${prod.product} ${prod.size} ${prod.service} ${prod.type}`
        })), fuseOptions)

        if (searchTerm) {
            const result = fuse.search(searchTerm).map(result => result.item);

            setFilteredProducts( result.map((prod) => products.find(p => p.id === prod.id) as GetProductsInterface['products'] ));
        } else {
            setFilteredProducts(products);
        }
    }, [searchTerm, products])

    return (
        <div className='bg-panelWhite p-7 rounded-xl shadow-2xl my-5'>

            <div className='flex items-center max-w-96 border-b-2 mb-2'>
                <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    type='text' placeholder='Buscar' className='w-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-transparent ' />
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
                            <TableHead>Finalidade</TableHead>
                            <TableHead>Editar</TableHead>
                            {/* <TableHead>Excluir</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            filteredProducts.map(prod => (
                                <TableRow key={prod.id}>
                                    <TableCell>{prod.product}</TableCell>
                                    <TableCell>{prod.size}</TableCell>
                                    <TableCell>{prod.service}</TableCell>
                                    <TableCell>{prod.type}</TableCell>
                                    <TableCell>{finalityProductTypeMap[prod.finality]}</TableCell>
                                    <TableCell>
                                        <Link href={`/panel/products/${prod.id}`}>
                                            <Button size='sm' variant='outline' className='bg-orange-200 text-orange-800'><Edit /> Editar</Button>
                                        </Link>
                                    </TableCell>
                                    {/* <TableCell>
                                        <Button size='sm' variant='outline' className='bg-red-200 text-red-800'><Trash2 /></Button>
                                    </TableCell> */}
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ListProducts