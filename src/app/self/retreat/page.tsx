import getCollaborators from "@/core/server/collaborator/getCollaborators";
import React from "react";
import getProducts from "@/core/server/product/getProducts";
import FormRetreat from "@/app/panel/retreat/form-retreat";
import Image from "next/image";

const SelfRetreatPage = async () => {
  const collaborators = (await getCollaborators()).collaborators;
  const products = (await getProducts()).products;
  return (
    <div className="max-w-screen-lg mx-auto py-10">
      <a href="/self">
        <div className="flex justify-center items-center shadow-xl bg-slate-600 p-5 w-80 mx-auto rounded-sm">
          <Image
            src="/images/GrupoperaltasCompleto.png"
            alt="logo peraltas"
            width={200}
            height={200}
          />
        </div>
      </a>
      <FormRetreat collaborators={collaborators} products={products} self />
    </div>
  );
};

export const dynamic = "force-dynamic";
export default SelfRetreatPage;
