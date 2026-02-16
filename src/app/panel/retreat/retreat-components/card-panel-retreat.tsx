"use client";
import ItemList from "@/components/interface/card-item-list/ItemList";
import { CardPanel } from "@/components/interface/CardPanel";
import { Button } from "@/components/ui/button";
import { ScrollText, Shirt } from "lucide-react";
import React, { useEffect, useState } from "react";
import DialogSearchModal from "./dialog-search-modal";
import useScanDetection from "@/lib/useScanDetection";
import useRfidReader from "@/hooks/useRfidReader";
import useSelectedProductsRetreat from "./useSelectedProductsRetreat";
import { GetProductsInterface } from "@/core/server/product/getProducts";
import { GetCollaboratorsInterface } from "@/core/server/collaborator/getCollaborators";
import finalityProductTypeMap from "@/core/server/product/finalityProductTypeMap";
import { toast } from "sonner";
import DialogPanelChangeAmount from "./dialog-panel-change-amount";

interface CardPanelRetreatProps {
  products: GetProductsInterface["products"][];
  collaborator: GetCollaboratorsInterface["collaborators"] | null;
  success: boolean;
  onlyCanRetreat?: boolean;
}

const CardPanelRetreat = ({
  products,
  collaborator,
  success,
  onlyCanRetreat = false,
}: CardPanelRetreatProps) => {
  const { addProduct, removeProduct, itemFocused, selectedProduct, clearList } =
    useSelectedProductsRetreat(collaborator);
  const { lastTag } = useRfidReader();

  // Leitura via HID (teclado/barcode scanner)
  useScanDetection({
    onComplete: (barcode) => {
      const find = products.find((prod) =>
        prod.BarCodes.some((bc) => bc.code === barcode)
      );
      if (find) addProduct(find);
    },
    minLength: 7,
  });

  // Leitura via RFID IN907 (socket.io)
  useEffect(() => {
    if (lastTag) {
      const find = products.find((prod) =>
        prod.BarCodes.some((bc) => bc.code === lastTag.epc)
      );
      if (find) addProduct(find);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastTag]);

  const [productChangeInputAmount, setProductChangeInputAmount] = useState<
    GetProductsInterface["products"] | null
  >(null);
  const [isOpenDialogChangeAmount, setIsOpenDialogChangeAmount] =
    useState(false);

  const openModalChangeAmount = () => {
    setIsOpenDialogChangeAmount(true);
  };

  const changeAmountItem = (amount: number) => {
    if (productChangeInputAmount) addProduct(productChangeInputAmount, amount);
    setIsOpenDialogChangeAmount(false);
  };

  useEffect(() => {
    const handleKeyOpen = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        (document.querySelector(".open-modal") as HTMLElement)?.click();
      }
    };

    window.addEventListener("keydown", handleKeyOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyOpen);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const newItem = document.getElementById("newItemRef");
      if (newItem) {
        newItem.scrollIntoView({ behavior: "smooth", block: "center" });
        newItem.focus();
      }
    }, 300);
  }, [selectedProduct]);

  useEffect(() => {
    if (success) {
      clearList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  return (
    <>
      <DialogPanelChangeAmount
        open={isOpenDialogChangeAmount}
        setOpen={setIsOpenDialogChangeAmount}
        onConfirm={changeAmountItem}
      />
      <CardPanel noHover title="Retiradas" Icon={ScrollText}>
        <div className="flex flex-col gap-2 my-4 ">
          {selectedProduct.map((product) => (
            <ItemList
              onClick={() => {
                setProductChangeInputAmount(product);
                openModalChangeAmount();
              }}
              id={itemFocused === product.id ? "newItemRef" : undefined}
              key={product.id}
              title={product.product}
              describe={`${product.size} -- ${product.service} -- ${
                product.type
              } -- (${finalityProductTypeMap[product.finality]})`}
              buttons={{
                delete: () => {
                  removeProduct(product);
                },
                add: () => {
                  addProduct(product);
                },
                quantity: product.quantity || 0,
              }}
              Icon={Shirt}
            />
          ))}
        </div>
        <div className="flex w-full justify-end mt-4 gap-2">
          {selectedProduct.length > 0 && (
            <Button type="submit" className="font-bold text-md drop-shadow-md ">
              Retirar
            </Button>
          )}

          <DialogSearchModal
            products={
              onlyCanRetreat
                ? collaborator
                  ? products.filter((prod) =>
                      prod.Departments.some(
                        (department) =>
                          department.department === collaborator.department
                      )
                    )
                  : []
                : products
            }
            addProduct={addProduct}
            onClick={(e) => {
              if (!collaborator) {
                toast.error("Identifique o colaborador primeiro");
                e.preventDefault();
              }
            }}
          />
        </div>
      </CardPanel>
      <input
        type="hidden"
        value={JSON.stringify(selectedProduct)}
        name="products"
      />
    </>
  );
};

export default CardPanelRetreat;
