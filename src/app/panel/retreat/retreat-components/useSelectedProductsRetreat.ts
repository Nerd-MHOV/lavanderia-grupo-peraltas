import { GetCollaboratorsInterface } from "@/core/server/collaborator/getCollaborators";
import { GetProductsInterface } from "@/core/server/product/getProducts";
import React, { useCallback, useEffect } from "react";
import { toast } from "sonner";


export type ProductQuantity = GetProductsInterface['products'] & { quantity?: number };

const useSelectedProductsRetreat = (clear: VoidFunction, collaborator: GetCollaboratorsInterface['collaborators'] | null) => {
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

      // verificações de produto
      if (!product.Inventory[0]?.amount) {
        toast.error('Produto sem estoque')
        return prev
      }

      if (!collaborator) {
        toast.error('Selecione um colaborador para adicionar produtos')
        return prev
      }

      if (!collaborator.canRetreat.find(c => c === product.finality)) {
        toast.error(`Colaborador não pode retirar produtos para a finalidade "${product.finality}"`)
        return prev
      }

      if (!product.Departments.find(d => d.department === collaborator.department)) {
        if(product.Departments[0]?.department) {
          toast.error(`Colaborador não pode retirar produtos do departamento "${product.Departments[0]?.department}"`)
        } else {
          toast.error('Produto sem departamento atrelado!')
        }
        return prev
      }


      return [...prev, {
        ...product,
        quantity: 1
      }]
    })

    setItemFocused(product.id)
  }, [collaborator])

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