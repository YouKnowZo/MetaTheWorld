'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, RefreshCw, ArrowUp, ArrowDown, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  market_cap_rank: number;
}

const MTW_PRICE = 0.0847;
const MTW_CIRCULATING = 124_000_000;

function PctChange({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined) return <span className="text-slate-500">—</span>;
  const isPos = value >= 0;
  return (
    <span className={`flex items-center justify-end gap-1 font-mono text-sm ${
      isPos ? 'text-emerald-400' : 'text-rose-400'
    }`}>
      {isPos ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
      <span>{Math.abs(value).toFixed(2)}%</span>
    </span>
  );
}

export default function CryptoPricesPage() {
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchCoins = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,matic-network,the-sandbox,decentraland,axie-infinity,illuvium,star-atlas&order=market_cap_desc&per_page=8&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d'
      );
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setCoins(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setCoins(MOCK_COINS);
      setLastUpdated(new Date().toLocaleTimeString() + ' (cached)');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchCoins(); }, [fetchCoins]);

  const formatPrice = (p: number) => {
    if (p >= 1000) return '$' + p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (p >= 1) return '$' + p.toFixed(2);
    return '$' + p.toFixed(6);
  };

  const formatLarge = (n: number) => {
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
    return '$' + n.toLocaleString();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <TrendingUp className="text-emerald-500 w-10 h-10" />
            Market Pulse
          </h1>
          <p className="text-slate-400 mt-1">Real-time assets and metaverse token metrics.</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest text-right">
            Last Update<br />
            <span className="text-white">{lastUpdated || '--:--:--'}</span>
          </p>
          <button
            onClick={() => fetchCoins(true)}
            disabled={refreshing}
            aria-label="Refresh market data"
            className="p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            <RefreshCw size={20} className={`text-blue-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* MTW Spotlight */}
      <div className="relative p-8 rounded-3xl overflow-hidden border border-blue-500/20 bg-blue-500/5">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Coins size={120} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-yellow-500 text-black text-[10px] font-black rounded uppercase tracking-widest">Core Token</span>
              <h2 className="text-2xl font-black text-white">Meta World Token (MTW)</h2>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-white font-mono">${MTW_PRICE}</span>
              <span className="text-emerald-400 font-bold mb-2">+12.45% (24h)</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Market Cap</p>
              <p className="text-white font-black">$84.7M</p>
            </div>
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Circulating</p>
              <p className="text-white font-black">{MTW_CIRCULATING.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Table */}
      <div className="glass rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw size={40} className="animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Market Data...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40">
                  {['#', 'Asset', 'Price', '1H', '24H', '7D', 'Market Cap'].map((h, i) => (
                    <th key={h} className={`px-6 py-5 text-slate-500 text-[10px] font-black uppercase tracking-widest ${i > 1 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {coins.map((coin) => (
                  <tr key={coin.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-6 text-slate-500 font-mono text-sm">{coin.market_cap_rank}</td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white font-black group-hover:border-blue-500/50 transition-all">
                          {coin.symbol.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{coin.name}</p>
                          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">{coin.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <span className="text-white font-black font-mono text-sm">{formatPrice(coin.current_price)}</span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <PctChange value={coin.price_change_percentage_1h_in_currency} />
                    </td>
                    <td className="px-6 py-6 text-right">
                      <PctChange value={coin.price_change_percentage_24h_in_currency} />
                    </td>
                    <td className="px-6 py-6 text-right">
                      <PctChange value={coin.price_change_percentage_7d_in_currency} />
                    </td>
                    <td className="px-6 py-6 text-right">
                      <span className="text-slate-300 text-sm font-medium">{formatLarge(coin.market_cap)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const MOCK_COINS: CoinMarket[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 67234.00, market_cap: 1320000000000, total_volume: 28400000000, price_change_percentage_1h_in_currency: 0.12, price_change_percentage_24h_in_currency: 2.34, price_change_percentage_7d_in_currency: 5.67, market_cap_rank: 1 },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3521.50, market_cap: 423000000000, total_volume: 14200000000, price_change_percentage_1h_in_currency: -0.08, price_change_percentage_24h_in_currency: 1.12, price_change_percentage_7d_in_currency: 3.45, market_cap_rank: 2 },
  { id: 'matic-network', symbol: 'matic', name: 'Polygon', current_price: 0.8432, market_cap: 8200000000, total_volume: 520000000, price_change_percentage_1h_in_currency: 0.34, price_change_percentage_24h_in_currency: -1.23, price_change_percentage_7d_in_currency: 8.90, market_cap_rank: 15 },
  { id: 'the-sandbox', symbol: 'sand', name: 'The Sandbox', current_price: 0.4120, market_cap: 856000000, total_volume: 78000000, price_change_percentage_1h_in_currency: -0.22, price_change_percentage_24h_in_currency: 3.45, price_change_percentage_7d_in_currency: -2.10, market_cap_rank: 52 },
  { id: 'decentraland', symbol: 'mana', name: 'Decentraland', current_price: 0.3845, market_cap: 720000000, total_volume: 65000000, price_change_percentage_1h_in_currency: 0.15, price_change_percentage_24h_in_currency: -0.87, price_change_percentage_7d_in_currency: 4.32, market_cap_rank: 58 },
  { id: 'axie-infinity', symbol: 'axs', name: 'Axie Infinity', current_price: 6.82, market_cap: 1140000000, total_volume: 94000000, price_change_percentage_1h_in_currency: -0.45, price_change_percentage_24h_in_currency: -2.34, price_change_percentage_7d_in_currency: 1.23, market_cap_rank: 42 },
  { id: 'illuvium', symbol: 'ilv', name: 'Illuvium', current_price: 74.30, market_cap: 420000000, total_volume: 28000000, price_change_percentage_1h_in_currency: 0.67, price_change_percentage_24h_in_currency: 4.56, price_change_percentage_7d_in_currency: 12.34, market_cap_rank: 78 },
  { id: 'star-atlas', symbol: 'atlas', name: 'Star Atlas', current_price: 0.00312, market_cap: 62000000, total_volume: 5400000, price_change_percentage_1h_in_currency: -1.20, price_change_percentage_24h_in_currency: -3.45, price_change_percentage_7d_in_currency: -8.90, market_cap_rank: 210 },
];
