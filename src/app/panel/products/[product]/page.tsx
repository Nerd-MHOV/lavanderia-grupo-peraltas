import getaProduct from "@/core/server/product/getaProduct";
import getServices from "@/core/server/services/getServices";
import getTypes from "@/core/server/type/getTypes";
import React from "react";
import { format } from "date-fns";
import {
  Boxes,
  FileBox,
  SquareDashedMousePointer,
  SquareMousePointer,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardPanel } from "@/components/interface/CardPanel";
import FormEditProduct from "./form-edit-product";
import DialogAddBarcode from "./dialog-add-barcde";
import ButtonDeleteBarcode from "./button-delete-barcode";
import DialogAddInventory from "./dialog-add-inventory";
import { notFound } from "next/navigation";
import getDepartments from "@/core/server/department/getDepartments";
import DialogDeleteProduct from "./dialog-delete-product";

const EditProductPage = async ({
  params,
}: {
  params: Promise<{ product: string }>;
}) => {
  const product = (await getaProduct((await params).product))?.product;
  if (!product) {
    return notFound();
  }
  const services = (await getServices()).services;
  const types = (await getTypes()).types;
  const departments = (await getDepartments()).departments;

  const allInputs = product.Input.reduce((acc, cur) => acc + cur.amount, 0);
  const allOutputs = product.Output.reduce((acc, cur) => acc + cur.amount, 0);
  const allOrders = product.OutputOrder.reduce(
    (acc, cur) => acc + cur.amount,
    0
  );
  return (
    <div className="px-10 py-3 relative">
      <div className="bg-panelWhite p-7 rounded-xl shadow-2xl items-center w-full flex justify-between ">
        <div className="flex gap-8">
          <h1 className="text-xl font-bold">{product?.product}</h1>
          <h2 className="text-md font-semibold text-slate-500">{`${product?.size} -- ${product?.service} -- ${product?.type}`}</h2>
        </div>
        <div className="text-slate-400 flex flex-col items-end text-sm p-0 m-0">
          <p>criado em: {format(product?.createdAt, "dd/MM/yyyy HH:mm")}</p>
          <p>
            ultima atualização: {format(product.updatedAt, "dd/MM/yyyy HH:mm")}
          </p>
        </div>
      </div>

      <div className="bg-panelWhite p-7 rounded-xl shadow-2xl my-5">
        <FormEditProduct
          product={product}
          services={services}
          departments={departments}
          types={types}
        />
      </div>

      <div className="bg-panelWhite p-7 rounded-xl shadow-2xl my-5">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">Etiquetas Cadastradas</h1>
          <DialogAddBarcode product_id={product.id} />
        </div>
        {product.BarCodes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Cadastrado em</TableHead>
                <TableHead>Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.BarCodes.map((barcode) => (
                <TableRow key={barcode.code}>
                  <TableCell>{barcode.code}</TableCell>
                  <TableCell>
                    {format(barcode.createdAt, "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <ButtonDeleteBarcode
                      product_id={product.id}
                      code={barcode.code}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-slate-500 w-full text-center">
            Nenhuma etiqueta cadastrada
          </p>
        )}
      </div>

      <div className="bg-panelWhite p-7 rounded-xl shadow-2xl my-5">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold">Estoque</h1>
          <DialogAddInventory product_id={product.id} />
        </div>

        <div className="flex gap-4 my-5 lg:flex-nowrap flex-wrap">
          <CardPanel className="shadow-md" Icon={FileBox} title="Total">
            <p className="text-center mt-2 text-3xl font-bold ">{allInputs}</p>
          </CardPanel>
          <CardPanel className="shadow-md" Icon={Boxes} title="Estoque">
            <p className="text-center mt-2 text-3xl font-bold ">
              {product.Inventory[0]?.amount || 0}
            </p>
          </CardPanel>
          <CardPanel
            className="shadow-md"
            Icon={SquareDashedMousePointer}
            title="Reservados"
          >
            <p className="text-center mt-2 text-3xl font-bold ">
              {allOrders || 0}
            </p>
          </CardPanel>
          <CardPanel
            className="shadow-md"
            Icon={SquareMousePointer}
            title="Retirados"
          >
            <p className="text-center mt-2 text-3xl font-bold ">
              {allOutputs || 0}
            </p>
          </CardPanel>
        </div>

        {product.Inventory.length > 0 && (
          <>
            <h2 className="mt-5 text-rose-950">Entradas:</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.Input.map((inp) => (
                  <TableRow key={inp.id}>
                    <TableCell>{inp.amount}</TableCell>
                    <TableCell>
                      {format(inp.createdAt, "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{inp.User.user}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {product.Output.length > 0 && (
          <>
            <h2 className="mt-5 text-rose-950">Saidas:</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.Output.map((out) => (
                  <TableRow key={out.id}>
                    <TableCell>{out.amount}</TableCell>
                    <TableCell>
                      {format(out.updatedAt, "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{out.Collaborator.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {product.OutputOrder.length > 0 && (
          <>
            <h2 className="mt-5 text-rose-950">Reservados:</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.OutputOrder.map((out) => (
                  <TableRow key={out.id}>
                    <TableCell>{out.amount}</TableCell>
                    <TableCell>
                      {format(out.updatedAt, "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{out.Collaborator.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </div>

      <div className="flex w-full items-end justify-end mt-20 mb-5 pr-5">
        <DialogDeleteProduct
          product_name={`${product.product} ${product.size} -- ${product.service} ${product.type}`}
          product_id={(await params).product}
        />
      </div>
    </div>
  );
};

export default EditProductPage;
