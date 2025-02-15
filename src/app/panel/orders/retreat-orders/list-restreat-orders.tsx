"use client";
import { GetOutputOrdersGroupUserInterface } from "@/core/server/output-orders/getOutputOrdersGroupUsers";
import React, { useEffect, useState } from "react";
import ListOrders from "../list-orders";
import OrderDescribe from "../output-order-describe";
import { useFormState } from "react-dom";
import { actionConfirmOutpuOrder } from "@/actions/serverActions/confirm-output-order";
import { toast } from "sonner";
interface ListRetreatOrdersProps {
  outputOrders: GetOutputOrdersGroupUserInterface["outputOrdersGroupUser"][];
}

const ListRetreatOrders = ({ outputOrders }: ListRetreatOrdersProps) => {
  const [selected, setSelected] = useState<
    ListRetreatOrdersProps["outputOrders"][0] | null
  >(null);

  const handleClick = (id: string) => {
    const find = outputOrders.find((output) => output.id === id);
    setSelected(find || null);
  };

  const [state, action] = useFormState(actionConfirmOutpuOrder, {
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
        orders={outputOrders}
      />
      {selected !== null && (
        <OrderDescribe
          close={() => setSelected(null)}
          selected={{
            ...selected,
            orders: selected.OutputOrder,
          }}
          action={action}
          buttonText="Entregar"
        />
      )}
    </>
  );
};

export default ListRetreatOrders;
