import Link from "next/link";
import React from "react";

const OrdersPage = () => {
  return (
    <div className="px-10 py-3 relative h-[calc(100vh-100px)] flex justify-center items-center">
      <div className="flex gap-12 flex-col justify-center items-center w-full">
        <Link href="/panel/orders/retreat-orders">
          <div className="hover:bg-slate-100 bg-panelWhite p-7 max-w-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 items-center w-full flex justify-center">
            <h1 className="text-xl font-bold">Solicitações de Retirada</h1>
          </div>
        </Link>

        <Link href="/panel/orders/return-orders">
          <div className="hover:bg-slate-100 bg-panelWhite p-7 max-w-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 items-center w-full flex justify-center">
            <h1 className="text-xl font-bold">Solicitações de Devoluçao</h1>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default OrdersPage;
