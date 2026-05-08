"use client";
import Link from "next/link";
export function LegalFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Meta The World</h3>
            <p className="text-slate-400 text-sm mb-2">by PaperBagExpress</p>
            <p className="text-slate-500 text-sm">A hyper-realistic 1:1 digital twin of Earth built on Unreal Engine 5, blockchain ownership, and geospatial data.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-slate-400 hover:text-white text-sm">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-white text-sm">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="text-slate-400 hover:text-white text-sm">Disclaimer</Link></li>
              <li><Link href="/risk-disclosure" className="text-slate-400 hover:text-white text-sm">Risk Disclosure</Link></li>
              <li><Link href="/cookie-policy" className="text-slate-400 hover:text-white text-sm">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2">
              <li className="text-slate-400 text-sm">Email: <a href="mailto:legal@paperbagexpress.com" className="text-indigo-400">legal@paperbagexpress.com</a></li>
            </ul>
          </div>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-lg p-4 mb-6">
          <p className="text-yellow-400 text-sm text-center"><strong>⚠️ DISCLAIMER:</strong> Virtual assets are not real-world investments. For entertainment only. Not financial advice.</p>
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} PaperBagExpress. All rights reserved.</p>
          <p className="text-slate-600 text-xs">Meta The World by PaperBagExpress™</p>
        </div>
      </div>
    </footer>
  );
}
