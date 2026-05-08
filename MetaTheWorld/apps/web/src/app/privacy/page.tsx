"use client";
import Link from "next/link";
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Meta The World by PaperBagExpress</p>
        <div className="space-y-8 text-slate-300">
          <section><h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
            <p className="mb-4">We collect: wallet addresses, transaction history, usage data (IP, browser), and optional profile data.</p>
          </section>
          <section><h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
            <p className="mb-4">We use CoinGecko, Mapbox, Vercel, and Wallet Connect. See their respective privacy policies.</p>
          </section>
          <section><h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
            <p className="mb-4">You may access, correct, or request deletion of your data. Contact: privacy@paperbagexpress.com</p>
          </section>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800"><Link href="/" className="text-indigo-400 hover:text-indigo-300">← Back</Link></div>
      </div>
    </div>
  );
}
