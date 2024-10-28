import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        {children}
      </body>
    </html>
  );
}
