import db from '@/core/db/db'
import React from 'react'

const registerBarcodes = async ({ product_id, barcodes }: { product_id: string, barcodes: string[] }) => {
    // 1. verify product id
    const product = await db.product.getById(product_id)
    if(!product) throw new Error('Produto não encontrado')

    // 2. verify all barcodes
    const registeredCodes = await db.barcode.get()
    barcodes.forEach( bc => {
        const find = registeredCodes.find( rbc => rbc.code === bc)
        if(find) throw new Error(`Código ${find.code} já cadastrado no id: ${product_id}`)
    })    

    // 3. create barcode
    const created = await db.barcode.createMany(barcodes.map( bc => ({
        code: bc,
        product_id,
    })))


    return created
}

export default registerBarcodes