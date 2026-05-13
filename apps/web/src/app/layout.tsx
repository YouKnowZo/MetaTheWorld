import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/web3-provider";
import { CryptoPriceTicker } from "@/components/dashboard/crypto-ticker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meta The World | Dashboard",
  description: "Manage your land and assets in the paperbagexpress metaverse.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <CryptoPriceTicker />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
