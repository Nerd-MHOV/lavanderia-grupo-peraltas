'use client'
import ItemList from '@/components/interface/card-item-list/ItemLIst'
import { CardPanel } from '@/components/interface/CardPanel'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { ScrollText, Shirt } from 'lucide-react'
import React, { useEffect } from 'react'
import SearchModal from './search-modal'
import useScanDetection from '@/lib/useScanDetection'
import useSelectedProductsRetreat from './useSelectedProductsRetreat'
import { GetProductsInterface } from '@/core/server/product/getProducts'
import { GetCollaboratorsInterface } from '@/core/server/collaborator/getCollaborators'
import finalityProductTypeMap from '@/core/server/product/finalityProductTypeMap'


interface CardPanelRetreatProps {
  products: GetProductsInterface['products'][],
  collaborator: GetCollaboratorsInterface['collaborators'] | null;
  success: boolean;
}

const CardPanelRetreat = ({ products, collaborator, success }: CardPanelRetreatProps) => {
  const {
    addProduct,
    removeProduct,
    itemFocused,
    selectedProduct,
    clearList
  } = useSelectedProductsRetreat(collaborator);


  useScanDetection({
    onComplete: (barcode) => {
      const find = products.find(prod => prod.BarCodes.some(bc => bc.code === barcode))
      if (find) addProduct(find)
    },
    minLength: 7
  })

  useEffect(() => {
    const handleKeyOpen = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        (document.querySelector('.open-modal') as HTMLElement)?.click()
      }
    }

    window.addEventListener('keydown', handleKeyOpen)

    return () => {
      window.removeEventListener('keydown', handleKeyOpen)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      const newItem = document.getElementById('newItemRef')
      if (newItem) {
        newItem.scrollIntoView({ behavior: 'smooth', block: 'center' })
        newItem.focus()
      }
    }, 300)
  }, [selectedProduct])

  useEffect(() => {
    if(success) {
      clearList()
    }
  }, [success])


  return (
    <Dialog>
      <SearchModal products={products} addProduct={addProduct} />
      <CardPanel title='Retiradas' Icon={ScrollText}>
        <div className='flex flex-col gap-2 my-4 '>
          {selectedProduct.map((product) => <ItemList
            id={itemFocused === product.id ? 'newItemRef' : undefined}
            key={product.id}
            title={product.product}
            describe={`${product.size} -- ${product.service} -- ${product.type} -- (${finalityProductTypeMap[product.finality]})`}
            buttons={{
              delete: () => { removeProduct(product) },
              add: () => { addProduct(product) },
              quantity: product.quantity || 0
            }}
            Icon={Shirt} />
          )}
        </div>
        <div className='flex w-full justify-end mt-4 gap-2'>
          {
            selectedProduct.length > 0 &&
            <Button type='submit' className='font-bold text-md drop-shadow-md ' >Retirar</Button>
          }
          <DialogTrigger asChild>
            <Button type='button' className='open-modal font-bold drop-shadow-md text-md bg-btnOrange hover:bg-btnOrangeHover'>Buscar</Button>
          </DialogTrigger>
        </div>
      </CardPanel>
      < input type='hidden' value={JSON.stringify(selectedProduct)} name='products' />
    </Dialog>
  )
}




export default CardPanelRetreat