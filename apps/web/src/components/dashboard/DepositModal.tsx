'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Coins, CreditCard, Loader2 } from 'lucide-react';
import { useGameStore } from '@/store';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function DepositModal() {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useGameStore();

  const handleDeposit = async (amount: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('meta_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
      
      const response = await fetch(`${API_URL}/payments/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Payment Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center space-x-2 w-full px-3 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black rounded-xl font-bold transition-all shadow-lg shadow-yellow-500/20 active:scale-95">
          <Coins size={18} />
          <span>Buy MTW</span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic tracking-tighter">
            RECHARGE <span className="text-yellow-500">MTW TOKENS</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-4 py-6">
          {[
            { amount: 10, tokens: 1000, label: 'Starter Pack', discount: '' },
            { amount: 50, tokens: 5500, label: 'Explorer Box', discount: '+10% Bonus' },
            { amount: 100, tokens: 12000, label: 'Tycoon Bundle', discount: '+20% Bonus' }
          ].map((pack) => (
            <button
              key={pack.amount}
              onClick={() => handleDeposit(pack.amount)}
              disabled={loading}
              className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-700 hover:border-yellow-500/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                  <Coins size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold">{pack.label}</div>
                  <div className="text-sm text-slate-400">{pack.tokens.toLocaleString()} MTW</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black tracking-tighter">${pack.amount}</div>
                <div className="text-[10px] text-yellow-500 font-bold uppercase">{pack.discount}</div>
              </div>
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-yellow-500 font-bold animate-pulse">
            <Loader2 className="animate-spin" />
            REDIRECTING TO STRIPE SECURE CHECKOUT...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
