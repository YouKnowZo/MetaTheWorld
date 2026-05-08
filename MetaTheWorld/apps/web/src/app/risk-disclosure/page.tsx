"use client";
import Link from "next/link";
export default function RiskDisclosure() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Risk Disclosure</h1>
        <p className="text-slate-400 mb-8">Last updated: April 17, 2026</p>
        <div className="space-y-8 text-slate-300">
          <section className="bg-red-900/30 border-2 border-red-700 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ HIGH RISK WARNING</h2>
            <p className="text-white font-semibold">Investing in crypto/NFTs carries substantial risk of loss. Only invest what you can afford to lose completely.</p>
          </section>
          <section><h2 className="text-2xl font-semibold text-white mb-4">1. Market Volatility</h2><p className="mb-4">Prices can fluctuate dramatically. Assets may drop to zero value.</p></section>
          <section><h2 className="text-2xl font-semibold text-white mb-4">2. Liquidity Risk</h2><p className="mb-4">You may not be able to sell your assets when desired.</p></section>
          <section><h2 className="text-2xl font-semibold text-white mb-4">3. Technology Risk</h2><p className="mb-4">Smart contract bugs, hacks, and irreversible transactions.</p></section>
          <section><h2 className="text-2xl font-semibold text-white mb-4">4. Regulatory Risk</h2><p className="mb-4">Laws may change, affecting asset values and transferability.</p></section>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800"><Link href="/" className="text-indigo-400 hover:text-indigo-300">← Back</Link></div>
      </div>
    </div>
  );
}
