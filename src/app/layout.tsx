import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientLayout from "./ClientLayout";
import { I18nProvider } from "@/components/I18n";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Effort-U",
  description: "Plataforma de aprendizaje corporativo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <I18nProvider>
          <ClientLayout>{children}</ClientLayout>
        </I18nProvider>
      </body>
    </html>
  );
}
