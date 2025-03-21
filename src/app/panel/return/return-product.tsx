"use client";
import React, { useCallback, useEffect } from "react";
import CardPanelCollaborator from "../retreat/retreat-components/card-panel-collaborator";
import useFaceReader from "@/hooks/useFaceReader";
import { GetCollaboratorsInterface } from "@/core/server/collaborator/getCollaborators";
import { useFormState } from "react-dom";
import {
  actionReturnProducts,
  StateActionReturnProducts,
} from "@/actions/serverActions/return-products";
import SlackMessage from "@/components/interface/SlackMessage";
import ConfirmModal from "../retreat/retreat-components/confirm-modal";
import TableReturnProducts from "./table-return-products";
import { GetOutputsInterface } from "@/core/server/outputs/getOutputs";
import useOutputToReturn from "./useOutputToReturn";
import FormReturn from "./form-return";
import { actionReturnOrderProducts } from "@/actions/serverActions/return-order-products";
import DialogPanelChangeAmount from "../retreat/retreat-components/dialog-panel-change-amount";

export type OutputsQuantity =
  GetCollaboratorsInterface["collaborators"]["Outputs"][0] & {
    quantity?: number;
  };

export interface DataActionReturnPage {
  collaborator_id: string;
  products: OutputsQuantity[];
}

const RetrunProduct = ({
  collaborators,
  outputs,
  self = false,
}: {
  collaborators: GetCollaboratorsInterface["collaborators"][];
  outputs: GetOutputsInterface["outputs"][];
  self?: boolean;
}) => {
  const actionData = self ? actionReturnOrderProducts : actionReturnProducts;

  const [state, action] = useFormState(
    actionData,
    {} as StateActionReturnProducts
  );
  const { resultReader, clear } = useFaceReader([collaborators]);
  const { outputToReturn, addOutputReturn, removeOutputReturn } =
    useOutputToReturn();

  const [selectedCollaborator, setSelectedCollaborator] = React.useState<
    GetCollaboratorsInterface["collaborators"] | null
  >(null);
  const [dataAction, setDataAction] =
    React.useState<DataActionReturnPage | null>(null);
  const [isOpenDialogChangeAmount, setIsOpenDialogChangeAmount] =
    React.useState(false);
  const [productChangeInputAmount, setProductChangeInputAmount] =
    React.useState<OutputsQuantity | null>(null);

  const openModalChangeAmount = (output: OutputsQuantity) => {
    setProductChangeInputAmount(output);
    setIsOpenDialogChangeAmount(true);
  };

  const changeAmountItem = (amount: number) => {
    if (productChangeInputAmount) {
      addOutputReturn(productChangeInputAmount, amount);
    }
    setIsOpenDialogChangeAmount(false);
  };

  const withoutPending = useCallback(
    (outputs: OutputsQuantity[]): OutputsQuantity[] => {
      return outputs.map((output) => {
        const data =
          output.amount -
          output.ReturnOrder.reduce((acc, curr) => acc + curr.amount, 0);
        if (data > 0) {
          console.log("output", output, data);
          return {
            ...output,
            amount: data,
          };
        }
        return {
          ...output,
          amount: 0,
        };
      });
    },
    []
  );

  // filters
  const outputsCollaborator = useCallback(
    (collaborator: GetCollaboratorsInterface["collaborators"]) => {
      return withoutPending(
        collaborator.Outputs.filter((out) => out.finality === "collaborator")
      );
    },
    [withoutPending]
  );

  const outputsDepartment = useCallback(
    (collaborator: GetCollaboratorsInterface["collaborators"]) => {
      return withoutPending(
        outputs.filter(
          (out) =>
            out.Collaborator.department === collaborator.department &&
            out.finality === "department"
        )
      );
    },
    [outputs, withoutPending]
  );

  // reload page if success
  useEffect(() => {
    if (state.success) {
      window.location.reload();
    }
  }, [state.success]);

  return (
    <>
      <ConfirmModal
        action={action}
        products={outputToReturn.map((prod) => ({
          id: prod.id,
          quantity: prod.quantity ?? 0,
          product: prod.Product.product,
          size: prod.Product.size,
          service: prod.Product.service,
          finality: prod.Product.finality,
        }))}
        finality="Devolução"
        collaborator={selectedCollaborator}
        dataAction={dataAction}
        resultReader={resultReader}
        clear={clear}
      />
      <DialogPanelChangeAmount
        open={isOpenDialogChangeAmount}
        setOpen={setIsOpenDialogChangeAmount}
        onConfirm={changeAmountItem}
      />
      <CardPanelCollaborator
        collaborators={collaborators}
        disabled
        onSelect={setSelectedCollaborator}
        clear={clear}
        resultReader={resultReader}
      />

      {selectedCollaborator && (
        <>
          {state?.message && (
            <div className="mt-10 mb-2">
              <SlackMessage
                message={state?.message}
                type={state?.success ? "success" : "error"}
              />
            </div>
          )}
          <div className="bg-panelWhite shadow-2xl p-7 mt-10 rounded-xl bg-white">
            <div className="lg:max-h-[calc(100vh-335px)] max-h-screen overflow-auto">
              {outputsCollaborator(selectedCollaborator).length > 0 && (
                <>
                  <p className="text-slate-700">Pendências do colaborador:</p>
                  <TableReturnProducts
                    onClick={openModalChangeAmount}
                    title="Lista de pendências do colaborador"
                    outputs={outputsCollaborator(selectedCollaborator)}
                    addOutputReturn={addOutputReturn}
                    removeOutputReturn={removeOutputReturn}
                    outputToReturn={outputToReturn}
                  />
                </>
              )}
              {outputsDepartment(selectedCollaborator).length > 0 && (
                <>
                  <p className="text-slate-700">Pendências do departamento:</p>
                  <TableReturnProducts
                    onClick={openModalChangeAmount}
                    title="Lista de pendências do departamento"
                    outputs={outputsDepartment(selectedCollaborator)}
                    addOutputReturn={addOutputReturn}
                    removeOutputReturn={removeOutputReturn}
                    outputToReturn={outputToReturn}
                  />
                </>
              )}
            </div>
            <FormReturn
              onForm={(data) => setDataAction(data)}
              collaborator_id={selectedCollaborator.id}
              outputToReturn={outputToReturn}
            />
          </div>
        </>
      )}
    </>
  );
};

export default RetrunProduct;
