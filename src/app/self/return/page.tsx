import getCollaborators from "@/core/server/collaborator/getCollaborators";
import React from "react";
import Image from "next/image";
import RetrunProduct from "@/app/panel/return/return-product";
import getOutputs from "@/core/server/outputs/getOutputs";

const SelfReturnPage = async () => {
  const collaborators = (await getCollaborators()).collaborators;
  const outputs = (await getOutputs()).outputs;
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
      <RetrunProduct collaborators={collaborators} outputs={outputs} self />
    </div>
  );
};

export const dynamic = "force-dynamic";
export default SelfReturnPage;
