import Image from "next/image";

const SelfPage = () => (
  <div className="max-w-screen-lg mx-auto py-10">
    <div className="flex justify-center items-center shadow-xl bg-slate-600 p-5 w-80 mx-auto rounded-sm">
      <Image
        src="/images/GrupoperaltasCompleto.png"
        alt="logo peraltas"
        width={200}
        height={200}
      />
    </div>

    <div className="flex justify-center items-center mt-20 gap-5">
      <a href="/self/retreat">
        <div className="flex justify-center items-center shadow-xl bg-slate-500 p-5 w-80 mx-auto rounded-sm hover:shadow-2xl ">
          <h1 className="text-white font-bold text-xl">RETIRAR</h1>
        </div>
      </a>
      <a href="/self/return">
        <div className="flex justify-center items-center shadow-xl bg-slate-500 p-5 w-80 mx-auto rounded-sm hover:shadow-2xl ">
          <h1 className="text-white font-bold text-xl">DEVOLVER</h1>
        </div>
      </a>
    </div>
  </div>
);

export default SelfPage;
