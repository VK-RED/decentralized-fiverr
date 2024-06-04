import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@repo/ui/navbar";
import "./globals.css";
import { SolanaProvider } from "@repo/sol/solanaProvider";
import { RecoilRoot } from "@repo/store/recoil";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TUDUM WORKER",
  description: "Get SOL by Labelling !!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilRoot>
          <SolanaProvider>
            <Navbar isWorkerNav={true}>
              {children}
            </Navbar>
          </SolanaProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
