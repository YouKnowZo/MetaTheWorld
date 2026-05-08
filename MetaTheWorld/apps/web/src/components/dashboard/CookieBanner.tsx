"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const hasConsented = localStorage.getItem("cookie-consent");
    if (!hasConsented) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);
  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };
  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "false");
    setIsVisible(false);
  };
  if (!isVisible) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 p-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-slate-300">
          <p className="mb-1"><strong className="text-white">🍪 We use cookies</strong> to enhance your experience.</p>
          <p>By continuing, you agree to our <Link href="/terms" className="text-indigo-400 underline">Terms</Link>, <Link href="/privacy" className="text-indigo-400 underline">Privacy</Link>, and <Link href="/cookie-policy" className="text-indigo-400 underline">Cookie Policy</Link>.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button onClick={handleDecline} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Decline</button>
          <button onClick={handleAccept} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg">Accept All</button>
        </div>
      </div>
    </div>
  );
}
