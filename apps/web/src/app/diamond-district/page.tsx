'use client';
import React, { useState } from 'react';
import { placeBet } from '@/lib/api-client';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Crown, Dice5, FlipHorizontal, RefreshCw, Loader2 } from 'lucide-react';

export default function DiamondDistrictPage() {
  const [amount, setAmount] = useState('10');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [gamePlayed, setGamePlayed] = useState<'Dice' | 'Coin Flip' | 'Roulette' | null>(null);

  const handleBet = async (gameType: number, gameName: 'Dice' | 'Coin Flip' | 'Roulette') => {
    setLoading(true);
    setGamePlayed(gameName);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    const res = await placeBet(amount, gameType, 'GENESIS_0_0');

    // Simulate game outcome
    let outcome = 'pending';
    if (gameName === 'Dice') {
      outcome = Math.random() > 0.5 ? 'win' : 'lose';
    } else if (gameName === 'Coin Flip') {
      outcome = Math.random() > 0.5 ? 'win' : 'lose';
    } else if (gameName === 'Roulette') {
      outcome = Math.random() > 0.5 ? 'win' : 'lose';
    }

    setResult({ ...res, outcome });
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-8 py-6">
          <div className="flex items-center space-x-3">
            <Crown size={28} className="text-yellow-400" />
            <h1 className="text-2xl font-bold text-white">Diamond District</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Try your luck in our provably fair games.</p>
        </div>

        <div className="px-8 py-6 space-y-8">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-xl font-semibold text-white mb-4">Provably Fair Games</h2>
            <div className="flex items-center space-x-4 mb-6">
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 w-32 text-white text-sm focus:outline-none focus:border-blue-500"
                min="1"
              />
              <span className="flex items-center text-slate-400 font-bold">MTW</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => handleBet(0, 'Dice')}
                disabled={loading}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Dice5 size={20} />
                <span>Dice (Over 50)</span>
              </button>
              <button 
                onClick={() => handleBet(1, 'Coin Flip')}
                disabled={loading}
                className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FlipHorizontal size={20} />
                <span>Coin Flip</span>
              </button>
              <button 
                onClick={() => handleBet(2, 'Roulette')}
                disabled={loading}
                className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={20} />
                <span>Roulette (R/B)</span>
              </button>
            </div>
          </div>

          {loading && (
            <div className="bg-slate-800 p-4 rounded-lg border border-blue-500 flex items-center space-x-3">
              <Loader2 size={20} className="animate-spin text-blue-400" />
              <p className="text-blue-400 font-mono">Placing your bet for {gamePlayed}...</p>
            </div>
          )}

          {result && !loading && (
            <div className={`p-4 rounded-lg border ${result.outcome === 'win' ? 'bg-green-900/30 border-green-500' : 'bg-red-900/30 border-red-500'}`}>
              <p className="text-lg font-bold mb-2">Game Result: <span className={`${result.outcome === 'win' ? 'text-green-400' : 'text-red-400'} capitalize`}>{result.outcome}!</span></p>
              <p className="text-slate-400 text-sm">Request ID: <span className="font-mono">{result.requestId}</span></p>
              <p className="mt-1 text-slate-500 text-xs">{result.outcome === 'win' ? `You won ${parseFloat(amount) * 2} MTW!` : `You lost ${amount} MTW.`}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
