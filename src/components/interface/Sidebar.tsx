"use client";
import { useSidebar } from "@/context/sidebar.context";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  BookUser,
  ClockArrowUp,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  ScanBarcode,
  Undo2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { actionLogout } from "@/actions/serverActions/logout";

const links = [
  {
    link: "/panel",
    icon: LayoutDashboard,
    title: "Home",
  },
  {
    link: "/panel/retreat",
    icon: ScanBarcode,
    title: "Retirar",
  },
  {
    link: "/panel/return",
    icon: Undo2,
    title: "Devolver",
  },
  {
    link: "/panel/orders",
    icon: ClockArrowUp,
    title: "Pedidos",
  },
  {
    link: "/panel/products",
    icon: PackageSearch,
    title: "Produtos",
  },
  {
    link: "/panel/collaborators",
    icon: BookUser,
    title: "Colaboradores",
  },
];

const Sidebar = () => {
  const { activeSidebar, dispatch } = useSidebar();
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div
      className={cn(
        "h-screen transition-all duration-500 bg-primary absolute md:static sm:static overflow-x-hidden",
        activeSidebar
          ? "min-w-full md:min-w-80 sm:min-w-80 relative"
          : "min-w-0 md:min-w-16"
      )}
    >
      <div className="w-full relative h-screen">
        <ul className="absolute w-full h-full flex flex-col gap-2 ">
          <li className="list-none mb-12 pointer-events-none mt-1 relative">
            <Link
              href="/panel"
              className="flex whitespace-nowrap items-center  "
            >
              <span className="top-3 left-3 absolute ">
                <Image src="/images/GP.png" alt="Logo" width={35} height={35} />
              </span>
              <span className=" mt-4 ml-[70px] font-bold text-2xl text-white">
                Controle Lavanderia
              </span>
            </Link>
          </li>

          {links.map((link, index) => (
            <li
              key={index}
              className={cn(
                "list-none rounded-l-full w-full text-panelWhite relative ",
                pathname === link.link ||
                  (pathname?.includes(link.link) && link.link !== "/panel")
                  ? `bg-panelWhite text-panelBlue 
                                before:content-[" "] before:absolute before:right-0 
                                before:w-12 before:h-12 before:rounded-full before:pointer-events-none
                                before:top-[-48px] before:shadow-[35px_35px_0_10px_white]

                                after:content-[" "] after:absolute after:right-0
                                after:w-12 after:h-12 after:rounded-full after:pointer-events-none
                                after:bottom-[-48px] after:shadow-[35px_-35px_0_10px_white]
                            `
                  : "hover:text-gray-300"
              )}
            >
              <Link
                href={link.link}
                className={cn("flex items-center gap-5 w-full relative")}
                onClick={() => dispatch!({ type: "OPEN" })}
              >
                <span className="relative ml-4">
                  <link.icon className="ml-1" width={22} height={22} />
                </span>
                <span className="py-3 ml-2 whitespace-normal text-lg">
                  {link.title}
                </span>
              </Link>
            </li>
          ))}
          <li className="flex-grow"></li>
          <li
            className="flex cursor-pointer items-center bg-[##060814] max-w-f gap-5 w-full text-panelWhite py-3 hover:text-gray-300"
            onClick={() => {
              actionLogout();
            }}
          >
            <span className="relative ml-5 ">
              <LogOut width={22} height={22} />
            </span>
            <span className="py-1 ml-20 whitespace-normal text-lg">sair</span>
          </li>
        </ul>
        <span
          className="flex text-panelWhite sm:hidden h-14 w-14 top-0 absolute right-0 items-center justify-center cursor-pointer transition-all duration-500"
          onClick={() => dispatch!({ type: "TOGGLE" })}
        >
          <Menu height={25} width={25} />
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
