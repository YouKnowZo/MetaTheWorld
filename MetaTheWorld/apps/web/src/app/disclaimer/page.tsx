"use client";
import Link from "next/link";
export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Disclaimer</h1>
        <p className="text-slate-400 mb-8">Last updated: April 17, 2026</p>
        <div className="space-y-8 text-slate-300">
          <section className="bg-red-900/20 border border-red-800/50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-red-400 mb-4">⚠️ IMPORTANT NOTICE</h2>
            <p className="text-white">Meta The World is an <strong>entertainment platform only</strong>.</p>
          </section>
          <section><h2 className="text-2xl font-semibold text-white mb-4">Not Financial Advice</h2>
            <p className="mb-4 text-red-400"><strong>CRITICAL:</strong> Nothing here constitutes financial advice. Consult a qualified advisor.</p>
          </section>
          <section><h2 className="text-2xl font-semibold text-white mb-4">No Guaranteed Value</h2>
            <p className="mb-4">Virtual assets have no guaranteed value and may become worthless.</p>
          </section>
          <section><h2 className="text-2xl font-semibold text-white mb-4">Platform "As Is"</h2>
            <p className="mb-4">This platform is provided WITHOUT WARRANTY of any kind.</p>
          </section>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800"><Link href="/" className="text-indigo-400 hover:text-indigo-300">← Back</Link></div>
      </div>
    </div>
  );
}
