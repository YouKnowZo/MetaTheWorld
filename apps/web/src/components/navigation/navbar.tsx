'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Globe, 
  LayoutDashboard, 
  ShoppingBag, 
  Coins,
  ChevronDown
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Map', href: '/map', icon: Globe },
  { name: 'Marketplace', href: '/nft-marketplace', icon: ShoppingBag },
  { name: 'Prices', href: '/crypto-prices', icon: Coins },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "w-full transition-all duration-500",
        scrolled 
          ? "py-3 bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
          : "py-6 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <Globe className="text-white" size={24} />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase hidden sm:block">
            Meta <span className="text-cyan-400">The World</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                  isActive 
                    ? "text-white bg-white/10" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon size={16} />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <ConnectButton 
              label="Connect Wallet" 
              showBalance={false}
              chainStatus="icon"
              accountStatus="avatar"
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 p-6 bg-black/95 backdrop-blur-2xl border-b border-white/10 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "p-4 rounded-2xl flex items-center gap-4 text-lg font-bold transition-all",
                      isActive 
                        ? "bg-cyan-500 text-black" 
                        : "bg-white/5 text-white hover:bg-white/10"
                    )}
                  >
                    <link.icon size={20} />
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-white/5">
                <ConnectButton label="Connect Wallet" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
