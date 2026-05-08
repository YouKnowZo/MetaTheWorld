"use client";
import Link from "next/link";
export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Cookie Policy</h1>
        <p className="text-slate-400 mb-8">Last updated: April 17, 2026</p>
        <div className="space-y-8 text-slate-300">
          <section><h2 className="text-2xl font-semibold text-white mb-4">What We Use</h2>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Essential: Wallet sessions, security</li>
              <li>Preferences: Settings, consent choices</li>
              <li>Analytics: Usage patterns (Vercel)</li>
            </ul>
          </section>
          <section><h2 className="text-2xl font-semibold text-white mb-4">Third Parties</h2>
            <p className="mb-4">Vercel Analytics, Wallet Connect, Mapbox. See their privacy policies.</p>
          </section>
          <section><h2 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h2>
            <p className="mb-4">Use browser settings to control cookies. Note: Disabling may affect functionality.</p>
          </section>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800"><Link href="/" className="text-indigo-400 hover:text-indigo-300">← Back</Link></div>
      </div>
    </div>
  );
}
