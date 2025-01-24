import { GetCollaboratorsInterface } from "@/core/server/collaborator/getCollaborators";
import { GetProductsInterface } from "@/core/server/product/getProducts";
import React, { useCallback } from "react";
import { toast } from "sonner";

export type ProductQuantity = GetProductsInterface["products"] & {
  quantity?: number;
};

const useSelectedProductsRetreat = (
  collaborator: GetCollaboratorsInterface["collaborators"] | null
) => {
  const [selectedProduct, setSelectedProduct] = React.useState<
    ProductQuantity[]
  >([]);
  const [itemFocused, setItemFocused] = React.useState<string | null>(null);

  const addProduct = useCallback(
    (product: ProductQuantity, quantity: number = 0) => {
      setSelectedProduct((prev) => {
        const prod = prev.find((p) => p.id === product.id);
        if (prod) {
          const currentQuantity = prod.quantity || 1;
          const inventoryAmount = prod.Inventory[0].amount;
          prod.quantity =
            inventoryAmount >= currentQuantity + 1
              ? currentQuantity + 1
              : currentQuantity;
          if (quantity && quantity > 0)
            prod.quantity =
              quantity <= inventoryAmount ? quantity : inventoryAmount;
          return prev.map((p) => (p.id === product.id ? prod : p));
        }

        // verificações de produto
        if (!product.Inventory[0]?.amount) {
          toast.error("Produto sem estoque");
          return prev;
        }

        if (!collaborator) {
          toast.error("Selecione um colaborador para adicionar produtos");
          return prev;
        }

        if (!collaborator.canRetreat.find((c) => c === product.finality)) {
          toast.error(
            `Colaborador não pode retirar produtos para a finalidade "${product.finality}"`
          );
          return prev;
        }

        if (
          !product.Departments.find(
            (d) => d.department === collaborator.department
          )
        ) {
          if (product.Departments[0]?.department) {
            toast.error(
              `Colaborador não pode retirar produtos do departamento "${product.Departments[0]?.department}"`
            );
          } else {
            toast.error("Produto sem departamento atrelado!");
          }
          return prev;
        }

        return [
          ...prev,
          {
            ...product,
            quantity: 1,
          },
        ];
      });

      setItemFocused(product.id);
    },
    [collaborator]
  );

  const removeProduct = useCallback((product: ProductQuantity) => {
    setSelectedProduct((prev) => {
      const prod = prev.find((p) => p.id === product.id);
      if (prod) {
        prod.quantity = prod.quantity ? prod.quantity - 1 : 0;
        if (prod.quantity === 0) return prev.filter((p) => p.id !== product.id);
        return prev.map((p) => (p.id === product.id ? prod : p));
      }
      return prev;
    });
  }, []);

  const clearList = () => {
    setSelectedProduct([]);
  };

  return {
    addProduct,
    removeProduct,

    selectedProduct,
    itemFocused,
    clearList,
  };
};

export default useSelectedProductsRetreat;
