"use client";
import React, { useEffect, useState } from "react";
import ListOrders from "../list-orders";
import OrderDescribe from "../output-order-describe";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { GetReturnOrdersGroupUserInterface } from "@/core/server/return-orders/getReturnOrdersGroupUsers";
import { actionConfirmReturnOrder } from "@/actions/serverActions/confirm-return-order";
interface ListReturnOrdersProps {
  returnOrders: GetReturnOrdersGroupUserInterface["returnOrdersGroupUser"][];
}

const ListReturnOrders = ({ returnOrders }: ListReturnOrdersProps) => {
  const [selected, setSelected] = useState<
    ListReturnOrdersProps["returnOrders"][0] | null
  >(null);

  const handleClick = (id: string) => {
    const order = returnOrders.find((order) => order.id === id);
    setSelected(order || null);
  };

  //
  const [state, action] = useFormState(actionConfirmReturnOrder, {
    message: "",
    success: false,
  });

  useEffect(() => {
    if (state.message && !state.success) {
      if (state.message !== "NEXT_REDIRECT") {
        toast.error(state.message);
      }
      setSelected(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <>
      <ListOrders
        handleClick={handleClick}
        selected={selected}
        orders={returnOrders}
      />
      {selected !== null && (
        <OrderDescribe
          close={() => setSelected(null)}
          selected={{
            ...selected,
            orders: selected.ResponsibleReturnOrderOut,
          }}
          action={action}
          buttonText="Confirmar Devolução"
        />
      )}
    </>
  );
};

export default ListReturnOrders;
