import type {Metadata} from "next";
import "./globals.css";
import {Toaster} from "sonner";

export const metadata: Metadata = {
  title: "Loja da Pegada",
  description: "Loja de tenis em Pelotas - RS",
  keywords: ["loja", "tenis", "sapatos"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
