"use client";
import Link from "next/link";
export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-slate-400 mb-8">Meta The World by PaperBagExpress</p>
        <p className="text-slate-500 text-sm mb-8">Last updated: April 17, 2026</p>
        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">Welcome to Meta The World by PaperBagExpress. By using this platform, you agree to be bound by these Terms of Service.</p>
            <p className="mb-4"><strong className="text-yellow-400">IMPORTANT DISCLAIMER:</strong> Meta The World is an <strong>entertainment and demonstration platform only</strong>. Virtual land parcels, NFTs, and digital assets are provided for entertainment purposes and represent no real-world property ownership.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Not Financial Advice</h2>
            <p className="mb-4 text-red-400"><strong>CRITICAL NOTICE:</strong> Nothing on this platform constitutes financial advice, investment advice, or a recommendation to buy, sell, or hold any cryptocurrency, NFT, or blockchain-based asset.</p>
            <p className="mb-4">Cryptocurrency and NFT values are highly volatile and can result in complete loss of funds. Do not invest money you cannot afford to lose.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Virtual Asset Terms</h2>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>You own a digital collectible, not real-world property</li>
              <li>Virtual land parcels have no guaranteed value or utility</li>
              <li>The platform may be modified, suspended, or discontinued at any time</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Limitation of Liability</h2>
            <p className="mb-4 text-yellow-400"><strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, PAPERBAGEXPRESS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</strong></p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Governing Law</h2>
            <p className="mb-4">These Terms are governed by the laws of the State of California, USA.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Contact</h2>
            <div className="bg-slate-900 p-4 rounded-lg">
              <p><strong>PaperBagExpress</strong></p>
              <p>Email: <a href="mailto:legal@paperbagexpress.com" className="text-indigo-400">legal@paperbagexpress.com</a></p>
            </div>
          </section>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
