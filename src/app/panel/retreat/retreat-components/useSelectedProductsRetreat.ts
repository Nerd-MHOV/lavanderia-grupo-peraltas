import React, { useCallback } from "react";
import { CardRetreatProducts } from "./card-panel-retreat";

const useSelectedProductsRetreat = () => {
  const [selectedProduct, setSelectedProduct] = React.useState<CardRetreatProducts[]>([]);
  const [itemFocused, setItemFocused] = React.useState<string | null>(null)
  

  
  const addProduct = useCallback((product: CardRetreatProducts) => {
    setSelectedProduct((prev) => {
      const prod = prev.find((p) => p.id === product.id)
      if (prod) {
        prod.quantity = prod.quantity ? prod.quantity + 1 : 2
        return prev.map((p) => p.id === product.id ? prod : p)
      }
      return [...prev, {
        ...product,
        quantity: 1
      }]
    })

    setItemFocused(product.id)
  }, [])

  const removeProduct = useCallback((product: CardRetreatProducts) => {
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
  return {

    addProduct,
    removeProduct,

    selectedProduct,
    itemFocused
  }
}

export default useSelectedProductsRetreat