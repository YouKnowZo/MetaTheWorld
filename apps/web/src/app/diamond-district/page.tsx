'use client';
import React, { useState } from 'react';
import { placeBet } from '@/lib/api-client';

export default function DiamondDistrictPage() {
  const [amount, setAmount] = useState('10');
  const [result, setResult] = useState<any>(null);

  const handleBet = async (gameType: number) => {
    const res = await placeBet(amount, gameType, 'GENESIS_0_0');
    setResult(res);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Diamond District</h1>
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6">
        <h2 className="text-xl font-semibold mb-4">Provably Fair Games</h2>
        <div className="flex space-x-4 mb-6">
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-4 py-2 w-32 text-white"
          />
          <span className="flex items-center text-white font-bold">MTW</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => handleBet(0)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition">Dice (Over 50)</button>
          <button onClick={() => handleBet(1)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition">Coin Flip</button>
          <button onClick={() => handleBet(2)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold transition">Roulette (R/B)</button>
        </div>
      </div>
      {result && (
        <div className="bg-slate-800 p-4 rounded-lg border border-blue-500">
          <p className="text-blue-400 font-mono">Request ID: {result.requestId}</p>
          <p className="mt-2 italic text-slate-400 text-sm">Waiting for Chainlink VRF fulfillment...</p>
        </div>
      )}
    </div>
  );
}
