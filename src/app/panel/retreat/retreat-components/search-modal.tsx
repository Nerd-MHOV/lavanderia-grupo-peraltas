"use client"
import ItemList from '@/components/interface/card-item-list/ItemLIst'
import { DialogClose, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search, Shirt } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { CardRetreatProducts } from '../card-panel-retreat'
import Fuse from 'fuse.js'
import { DialogTitle } from '@radix-ui/react-dialog'

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
interface SearchModalProps {
    products: CardRetreatProducts[]
    addProduct: (product: CardRetreatProducts) => void
}
const SearchModal = ({ products, addProduct }: SearchModalProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredProducts, setFilteredProducts] = useState<CardRetreatProducts[]>(products)


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

            setFilteredProducts(result.map((prod) => products.find(p => p.id === prod.id) as CardRetreatProducts));
        } else {
            setFilteredProducts(products);
        }
    }, [searchTerm, products])

    // input with enter key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                const firstItem = document.querySelector('.list-item-product'); // ajuste o seletor conforme necessário
                (firstItem as HTMLElement)?.click();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [filteredProducts]);

    return (
        <>
            <DialogContent className='bg-transparent border-none'>
                <DialogTitle />
                <div className='px-6'>
                    <DialogHeader className='bg-white border-white rounded-full p-2'>
                        <div className='flex items-center'>
                            <Input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} type='text' placeholder='Buscar' className='w-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-transparent ' />
                            <Search className='mr-2' />
                        </div>
                    </DialogHeader>
                </div>

                <div className=' py-4 max-h-64 overflow-auto no-scrollbar rounded-xl flex flex-col gap-1'>
                    {
                        filteredProducts.map((product) => <DialogClose key={product.id}>
                            <ItemList
                                className='cursor-pointer list-item-product'
                                onClick={() => { addProduct(product) }}
                                Icon={Shirt}
                                title={product.product}
                                describe={`${product.size} -- ${product.service} -- ${product.type}`}
                            />
                        </DialogClose>)
                    }
                </div>
            </DialogContent>
        </>
    )
}

export default SearchModal