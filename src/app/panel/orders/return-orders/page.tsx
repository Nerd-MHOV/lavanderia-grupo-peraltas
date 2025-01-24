import React from "react";
import { ChartNoAxesGantt } from "lucide-react";
import ListReturnOrders from "./list-return-orders";
import getReturnOrdersGroupUser from "@/core/server/return-orders/getReturnOrdersGroupUsers";

const ReturnOrdersPage = async () => {
  const returnOrders = (await getReturnOrdersGroupUser()).returnOrdersGroupUser;
  return (
    <div className="px-5 py-5 flex justify-around">
      <div className="absolute top-4 w-full text-center">
        <h1>
          Solicitações de <b>DEVOLUÇÕES</b>
        </h1>
      </div>
      {returnOrders.length === 0 ? (
        <div className="flex justify-center items-center w-full mt-20 bg-panelWhite p-7 rounded-xl shadow-2xl">
          <ChartNoAxesGantt />{" "}
          <h1 className="text-2xl font-bold text-center ">
            Não foi devolvido nenhum item
          </h1>
        </div>
      ) : (
        <ListReturnOrders returnOrders={returnOrders} />
      )}
    </div>
  );
};

export const dynamic = "force-dynamic";
export default ReturnOrdersPage;
