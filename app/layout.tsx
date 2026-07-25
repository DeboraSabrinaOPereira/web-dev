import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COMPIA - Loja Virtual",
  description:
    "Livros físicos, e-books e kits sobre Inteligência Artificial e Computação.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
