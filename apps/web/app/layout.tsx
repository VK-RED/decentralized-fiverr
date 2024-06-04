import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@repo/ui/navbar";
import { SolanaProvider } from "@repo/sol/solanaProvider";
import { RecoilRoot } from "@repo/store/recoil";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TUDUM",
  description: "Label Your Images Effortlessly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>{
        <RecoilRoot>
          <SolanaProvider>
          <Navbar isWorkerNav={false}>
          {children}
        </Navbar>
        </SolanaProvider>
        </RecoilRoot>
      }</body>
    </html>
  );
}
