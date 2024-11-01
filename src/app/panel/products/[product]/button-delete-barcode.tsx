'use client'
import { Button } from '@/components/ui/button'
import deleteBarcode from '@/core/server/barcode/deleteBarcode'
import { CircleMinus } from 'lucide-react'
import React from 'react'

const ButtonDeleteBarcode = ({code, product_id}: { code: string, product_id: string}) => {

  return (
    <Button
        variant='ghost'
        className='bg-red-100 text-red-500 hover:text-red-500 hover:bg-red-200 text-2xl'
        onClick={() => {
            deleteBarcode(code, product_id)
        }}
    ><CircleMinus width={30} height={30}/></Button>
  )
}

export default ButtonDeleteBarcode