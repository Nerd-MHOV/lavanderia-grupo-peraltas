import Sidebar from "@/components/interface/Sidebar";
import { SidebarContextProvider } from "@/context/sidebar.context";
import Navbar from "@/components/interface/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <SidebarContextProvider>
        <Sidebar />
        <div className="w-full max-h-screen overflow-auto transition-all duration-300">
          <Navbar />
          {children}
        </div>
      </SidebarContextProvider>
    </div>
  );
}
