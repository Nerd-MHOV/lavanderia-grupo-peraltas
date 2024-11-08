import { GetProductsInterface } from "@/core/server/product/getProducts";
import React, { useCallback, useEffect } from "react";


export type ProductQuantity = GetProductsInterface['products'] & {quantity?: number};

const useSelectedProductsRetreat = (clear: VoidFunction) => {
  const [selectedProduct, setSelectedProduct] = React.useState<ProductQuantity[]>([]);
  const [itemFocused, setItemFocused] = React.useState<string | null>(null)
  

  
  const addProduct = useCallback((product: ProductQuantity) => {
    setSelectedProduct((prev) => {
      const prod = prev.find((p) => p.id === product.id)
      if (prod) {
        const quantity = prod.quantity || 1
        prod.quantity = prod.Inventory[0].amount >= quantity + 1 ? quantity + 1 : quantity 
        return prev.map((p) => p.id === product.id ? prod : p)
      }
      if(!product.Inventory[0]?.amount) return prev
      return [...prev, {
        ...product,
        quantity: 1
      }]
    })

    setItemFocused(product.id)
  }, [])

  const removeProduct = useCallback((product: ProductQuantity) => {
    setSelectedProduct((prev) => {
      const prod = prev.find((p) => p.id === product.id)
      if (prod) {
        prod.quantity = prod.quantity ? prod.quantity - 1 : 0
        if (prod.quantity === 0) return prev.filter((p) => p.id !== product.id)
        return prev.map((p) => p.id === product.id ? prod : p)
      }
      return prev
    })
  }, [])

  useEffect(() => {
    setSelectedProduct([])
  }, [clear])
  return {

    addProduct,
    removeProduct,

    selectedProduct,
    itemFocused
  }
}

export default useSelectedProductsRetreat