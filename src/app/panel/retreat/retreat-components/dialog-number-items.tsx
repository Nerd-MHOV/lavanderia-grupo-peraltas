"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { GetProductsInterface } from "@/core/server/product/getProducts";
import { Button } from "@/components/ui/button";

interface DialogInputAmountProps {
  product: GetProductsInterface["products"] | null;
  addProduct: (
    product: GetProductsInterface["products"],
    quantity: number
  ) => void;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}
const DialogInputAmount = ({
  product,
  addProduct,
  onClick,
}: DialogInputAmountProps) => {
  const [value, setValue] = useState(1);

  if (!product) return null;
  return (
    <Dialog>
      <DialogTrigger onClick={onClick} asChild>
        <button className="open-modal-input-number none hidden"></button>
      </DialogTrigger>
      <DialogContent className="max-w-[12rem]">
        <DialogTitle />
        <div className="px-2">
          <DialogHeader className="p-2">
            <Input
              value={value}
              onChange={(e) => {
                setValue(+e.target.value);
              }}
              type="number"
              placeholder="Qnt"
              className="w-full text-center pr-2 text-lg font-bold"
            />
          </DialogHeader>
        </div>

        <div className=" py-4 flex justify-center items-center">
          <DialogClose asChild>
            <Button
              className="cursor-pointer list-item-product bg-green-500 text-white"
              onClick={() => {
                addProduct(product, value);
              }}
              variant={"secondary"}
            >
              Confirmar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogInputAmount;
