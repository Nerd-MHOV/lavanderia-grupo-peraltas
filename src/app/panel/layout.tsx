import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "@/components/interface/Sidebar";
import { SidebarContextProvider } from "@/context/sidebar.context";
import Navbar from "@/components/interface/Navbar";

export const metadata: Metadata = {
  title: "Lavanderia",
  description: "App para controle interno de items de lavanderia - GRUPO PERALTAS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="flex">
        <SidebarContextProvider>
          <Sidebar />
          <div className="w-full max-h-screen overflow-auto">
            <Navbar />

              {children}
          </div>
        </SidebarContextProvider>
      </body>
    </html>
  );
}
