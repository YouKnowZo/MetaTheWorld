<<<<<<< HEAD
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/web3-provider";
import { CryptoPriceTicker } from "@/components/dashboard/crypto-ticker";
=======
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

// Dynamically import client-only components to prevent hydration errors
const Web3Provider = dynamic(
  () => import("@/components/providers/web3-provider").then(m => ({ default: m.Web3Provider })),
  { ssr: false }
);

const CryptoPriceTicker = dynamic(
  () => import("@/components/dashboard/crypto-ticker").then(m => ({ default: m.CryptoPriceTicker })),
  { ssr: false }
);

const LegalFooter = dynamic(
  () => import("@/components/dashboard/LegalFooter").then(m => ({ default: m.LegalFooter })),
  { ssr: false }
);

const CookieBanner = dynamic(
  () => import("@/components/dashboard/CookieBanner").then(m => ({ default: m.CookieBanner })),
  { ssr: false }
);
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
<<<<<<< HEAD
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
=======
  title: "Meta The World by PaperBagExpress | Digital Twin Metaverse",
  description: "A hyper-realistic 1:1 digital twin of Earth built on Unreal Engine 5, blockchain ownership, and geospatial data. Own virtual land, trade NFTs.",
  keywords: ["metaverse", "NFT", "blockchain", "digital twin", "virtual land", "cryptocurrency", "Meta The World", "PaperBagExpress"],
  authors: [{ name: "PaperBagExpress" }],
  metadataBase: new URL("https://metatheworld.online"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://metatheworld.online",
    siteName: "Meta The World by PaperBagExpress",
    title: "Meta The World by PaperBagExpress | Digital Twin Metaverse",
    description: "A hyper-realistic 1:1 digital twin of Earth. Own virtual land, trade NFTs, and explore the metaverse.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meta The World by PaperBagExpress",
    description: "A hyper-realistic digital twin of Earth built on UE5 and blockchain.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Web3Provider>
          <div className="min-h-screen bg-slate-950 flex flex-col">
            <CryptoPriceTicker />
            <main className="flex-1">{children}</main>
            <LegalFooter />
          </div>
          <CookieBanner />
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
        </Web3Provider>
      </body>
    </html>
  );
}
