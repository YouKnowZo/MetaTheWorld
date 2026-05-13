'use client';

import React, { useState } from 'react';
import { placeBet } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { Coins, Dices, TrendingUp, RefreshCw } from 'lucide-react';

export default function DiamondDistrictPage() {
  const [amount, setAmount] = useState('10');
  const [result, setResult] = useState<any>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleBet = async (gameType: number) => {
    setIsSpinning(true);
    try {
      const res = await placeBet(amount, gameType, 'GENESIS_0_0');
      setResult(res);
    } finally {
      setTimeout(() => setIsSpinning(false), 2000);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <Trophy className="text-yellow-500 w-10 h-10" />
          Diamond District
        </h1>
        <p className="text-slate-400 mt-2 text-lg">High-stakes gaming and provably fair rewards.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Dices size={120} />
            </div>
            
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Coins className="text-cyan-400" />
              Place Your Bet
            </h2>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 w-full text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                  placeholder="0.00"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">MTW</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GameButton 
                onClick={() => handleBet(0)} 
                color="bg-blue-600" 
                label="Dice (Over 50)" 
                description="2.0x Multiplier"
                disabled={isSpinning}
              />
              <GameButton 
                onClick={() => handleBet(1)} 
                color="bg-purple-600" 
                label="Coin Flip" 
                description="1.95x Multiplier"
                disabled={isSpinning}
              />
              <GameButton 
                onClick={() => handleBet(2)} 
                color="bg-emerald-600" 
                label="Roulette" 
                description="3.0x Multiplier"
                disabled={isSpinning}
              />
            </div>
          </div>

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/5"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <RefreshCw className={`text-cyan-400 ${isSpinning ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h4 className="font-bold text-cyan-400">Transaction Pending</h4>
                  <p className="text-slate-400 text-sm mt-1">
                    Request ID: <span className="font-mono text-xs">{result.requestId}</span>
                  </p>
                  <p className="mt-2 text-xs text-slate-500 italic">Waiting for Chainlink VRF fulfillment on Polygon PoS...</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-slate-800">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="text-emerald-400" />
              Live Winners
            </h3>
            <div className="space-y-4">
              <WinnerItem address="0xA3f2...8B1c" amount="+450 MTW" time="2m ago" />
              <WinnerItem address="0xF9e1...2D4a" amount="+1,200 MTW" time="5m ago" />
              <WinnerItem address="0x72b1...C91e" amount="+85 MTW" time="12m ago" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 rounded-3xl text-white shadow-xl">
            <h3 className="font-bold text-lg mb-2">House Edge: 1%</h3>
            <p className="text-white/70 text-sm">Our games are provably fair using Chainlink VRF, ensuring 100% transparency and randomness.</p>
            <button className="mt-4 text-xs font-bold underline">Learn How it Works</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GameButton({ onClick, color, label, description, disabled }: { onClick: () => void, color: string, label: string, description: string, disabled: boolean }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${color} hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed p-6 rounded-2xl text-left transition-all shadow-lg group relative overflow-hidden`}
    >
      <div className="relative z-10">
        <div className="font-black text-lg mb-1">{label}</div>
        <div className="text-white/70 text-xs font-medium">{description}</div>
      </div>
      <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:scale-110 transition-transform">
        <ArrowRight size={24} />
      </div>
    </motion.button>
  );
}

function WinnerItem({ address, amount, time }: { address: string, amount: string, time: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
      <div>
        <div className="text-sm font-mono text-slate-300">{address}</div>
        <div className="text-[10px] text-slate-500 uppercase tracking-widest">{time}</div>
      </div>
      <div className="text-emerald-400 font-bold">{amount}</div>
    </div>
  );
}

function ArrowRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
