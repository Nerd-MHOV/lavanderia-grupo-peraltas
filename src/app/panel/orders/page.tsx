import getOutputOrdersGroupUser from "@/core/server/output-orders/getOutputOrdersGroupUsers";
import getReturnOrdersGroupUser from "@/core/server/return-orders/getReturnOrdersGroupUsers";
import Link from "next/link";
import React from "react";

const OrdersPage = async () => {
  const retreatPendency = (await getOutputOrdersGroupUser())
    .outputOrdersGroupUser;
  const returnPendency = (await getReturnOrdersGroupUser())
    .returnOrdersGroupUser;

  return (
    <div className="px-10 py-3 relative h-[calc(100vh-100px)] flex justify-center items-center">
      <div className="flex gap-12 flex-col justify-center items-center w-full">
        <Link href="/panel/orders/retreat-orders">
          <div className="hover:bg-slate-100 bg-panelWhite p-7 max-w-sm rounded-xl relative shadow-lg hover:shadow-xl transition-all duration-500 items-center w-full flex justify-center">
            {retreatPendency.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full z-50 text-sm text-white font-bold text-center">
                {retreatPendency.length}
              </span>
            )}
            <h1 className="text-xl font-bold">Solicitações de Retirada</h1>
          </div>
        </Link>

        <Link href="/panel/orders/return-orders">
          <div className="hover:bg-slate-100 bg-panelWhite p-7 max-w-sm rounded-xl shadow-lg hover:shadow-xl relative transition-all duration-500 items-center w-full flex justify-center">
            {returnPendency.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full z-50 text-sm text-white font-bold text-center">
                {returnPendency.length}
              </span>
            )}
            <h1 className="text-xl font-bold">Solicitações de Devoluçao</h1>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default OrdersPage;
