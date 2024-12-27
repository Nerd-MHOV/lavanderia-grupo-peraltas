import { ArrowLeft, User } from "lucide-react";
import React from "react";
import ButtonsOrderDescribe from "./button-order-describe";
import ConfirmModal from "../retreat/retreat-components/confirm-modal";
import useFaceReader from "@/hooks/useFaceReader";

const OrderDescribe = ({
  close,
  selected,
  action,
  buttonText,
}: {
  close: VoidFunction;
  selected: {
    id: string;
    name: string;
    cpf: string;
    department: string;
    orders: {
      id: string;
      amount: number;
      Product: {
        id: string;
        product: string;
        size: string;
        service: string;
        finality: string;
      };
    }[];
  };
  action: (payload: { orders: string[] }) => void;
  buttonText: string;
}) => {
  const { resultReader, clear } = useFaceReader();

  return (
    <div>
      <ConfirmModal
        products={selected.orders.map((o) => ({
          id: o.Product.id,
          quantity: o.amount,
          product: o.Product.product,
          size: o.Product.size,
          service: o.Product.service,
          finality: o.Product.finality,
        }))}
        finality=""
        collaborator={selected}
        resultReader={resultReader}
        clear={clear}
        dataAction={{
          orders: selected.orders.map((o) => o.id),
        }}
        action={action}
      />
      <div
        className="shadow-lg p-3 rounded-md ease-linear 
                transition-all duration-300"
      >
        <div className="block sm:hidden">
          <ArrowLeft
            onClick={close}
            className="cursor-pointer text-slate-500"
            width={30}
            height={20}
          />
        </div>
        <div className="flex gap-5">
          <div>
            <UserOrderDescriber
              name={selected.name}
              department={selected.department}
            />
            <div className="p-4 text-lg mb-8 mt-4">
              {selected.orders.some(
                (o) => o.Product.finality === "collaborator"
              ) && (
                <ListProductsOrderDescribe
                  title="Items de Colaborador:"
                  list={selected.orders.filter(
                    (o) => o.Product.finality === "collaborator"
                  )}
                />
              )}

              {selected.orders.some(
                (o) => o.Product.finality === "department"
              ) && (
                <ListProductsOrderDescribe
                  title="Items de Departamento:"
                  list={selected.orders.filter(
                    (o) => o.Product.finality === "department"
                  )}
                />
              )}
            </div>
            <ButtonsOrderDescribe buttonText={buttonText} />
          </div>
        </div>
      </div>
    </div>
  );
};

const UserOrderDescriber = (props: { name: string; department: string }) => (
  <div className="flex gap-10 p-5 justify-center items-center">
    <User
      className="bg-slate-100 shadow-sm rounded-full text-slate-600"
      width={70}
      height={50}
    />
    <div className="text-center font-bold">
      <h1 className="text-lg">{props.name}</h1>
      <h2 className="tracking-widest uppercase">{props.department}</h2>
    </div>
  </div>
);

const ListProductsOrderDescribe = (props: {
  title: string;
  list: {
    id: string;
    amount: number;
    Product: {
      product: string;
      size: string;
      service: string;
    };
  }[];
}) => (
  <>
    <label htmlFor="" className="tracking-widest underline underline-offset-4">
      {props.title}
    </label>

    <ol className="my-5 divide-y pl-5">
      {props.list.map((prod) => (
        <li key={prod.id}>
          {" "}
          <b>{prod.amount}x</b> -- {prod.Product.product} {prod.Product.size}{" "}
          {prod.Product.service}
        </li>
      ))}
    </ol>
  </>
);

export default OrderDescribe;
