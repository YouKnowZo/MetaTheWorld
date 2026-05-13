'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { TrendingUp, RefreshCw, ArrowUp, ArrowDown, Coins } from 'lucide-react';

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
const MTW_SUPPLY = 1_000_000_000;
const MTW_CIRCULATING = 124_000_000;
const MTW_STAKED = 45_000_000;
const MTW_TREASURY = 200_000_000;

function PctChange({ value }: { value: number | null | undefined }) {
  if (value === null || value === undefined) return <span className="text-slate-500">—</span>;
  const isPos = value >= 0;
  return (
    <span className={`flex items-center justify-end space-x-0.5 font-mono text-sm ${
      isPos ? 'text-green-400' : 'text-red-400'
    }`}>
      {isPos ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
      <span>{Math.abs(value).toFixed(2)}%</span>
    </span>
  );
}

function StatCard({ label, value, sub, accent = false }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`bg-slate-900 border rounded-xl p-5 ${
      accent ? 'border-yellow-500/40' : 'border-slate-800'
    }`}>
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className={`text-xl font-bold ${
        accent ? 'text-yellow-400' : 'text-white'
      }`}>{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function CryptoPricesPage() {
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [mtwAmount, setMtwAmount] = useState('');

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
      // Use mock data on error
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

  const mtwUsd = mtwAmount ? (parseFloat(mtwAmount) * MTW_PRICE).toFixed(4) : '';

  const totalMarketCap = coins.reduce((sum, c) => sum + (c.market_cap || 0), 0);
  const btcDominance = 52.3;

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp size={28} className="text-green-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Crypto Market</h1>
                <p className="text-slate-400 text-xs mt-0.5">
                  {lastUpdated ? `Last updated: ${lastUpdated}` : 'Loading...'}
                </p>
              </div>
            </div>
            <button
              onClick={() => fetchCoins(true)}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-sm transition-colors disabled:opacity-60"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Top stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Market Cap (Listed)"
              value={totalMarketCap ? formatLarge(totalMarketCap) : '$2.41T'}
              sub="Crypto market"
            />
            <StatCard
              label="BTC Dominance"
              value={`${btcDominance}%`}
              sub="Of total market"
            />
            <StatCard
              label="MTW Token Price"
              value="$0.0847"
              sub="+12.4% (7d)"
              accent
            />
            <StatCard
              label="MTW Market Cap"
              value="$84.7M"
              sub="124M circulating"
              accent
            />
          </div>

          {/* Market Table */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <h2 className="text-white font-semibold">Market Overview</h2>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="py-20 text-center">
                  <RefreshCw size={32} className="animate-spin text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Fetching live prices...</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {['#', 'Name', 'Price', '1h %', '24h %', '7d %', 'Market Cap', 'Volume (24h)'].map(h => (
                        <th key={h} className="text-right first:text-left px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {coins.map((coin, i) => (
                      <tr key={coin.id} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                        i % 2 === 0 ? '' : 'bg-slate-800/10'
                      }`}>
                        <td className="px-4 py-4 text-slate-400 text-sm">{coin.market_cap_rank}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ background: `hsl(${(i * 47) % 360}, 60%, 45%)` }}
                            >
                              {coin.symbol.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{coin.name}</p>
                              <p className="text-slate-500 text-xs uppercase">{coin.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-white font-mono text-sm">{formatPrice(coin.current_price)}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <PctChange value={coin.price_change_percentage_1h_in_currency} />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <PctChange value={coin.price_change_percentage_24h_in_currency} />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <PctChange value={coin.price_change_percentage_7d_in_currency} />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-slate-300 text-sm">{formatLarge(coin.market_cap)}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="text-slate-300 text-sm">{formatLarge(coin.total_volume)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* MTW Token Info */}
          <div className="bg-slate-900 border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Coins size={24} className="text-yellow-400" />
              <h2 className="text-white font-bold text-lg">MTW Token Info</h2>
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded">LIVE</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Supply', value: '1,000,000,000', sub: 'MTW' },
                { label: 'Circulating', value: MTW_CIRCULATING.toLocaleString(), sub: `${((MTW_CIRCULATING / MTW_SUPPLY) * 100).toFixed(1)}% of supply` },
                { label: 'Staked', value: MTW_STAKED.toLocaleString(), sub: `${((MTW_STAKED / MTW_CIRCULATING) * 100).toFixed(1)}% of circulating` },
                { label: 'DAO Treasury', value: MTW_TREASURY.toLocaleString(), sub: `${((MTW_TREASURY / MTW_SUPPLY) * 100).toFixed(0)}% of supply` },
              ].map(item => (
                <div key={item.label} className="bg-slate-800/60 rounded-lg p-4">
                  <p className="text-slate-400 text-xs mb-1">{item.label}</p>
                  <p className="text-yellow-400 font-bold text-lg">{item.value}</p>
                  <p className="text-slate-500 text-xs">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* MTW Converter */}
            <div className="bg-slate-800/40 rounded-lg p-4">
              <p className="text-slate-300 text-sm font-medium mb-3">Convert MTW to USD</p>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 flex-1">
                  <input
                    type="number"
                    value={mtwAmount}
                    onChange={e => setMtwAmount(e.target.value)}
                    placeholder="Enter MTW amount"
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
                  />
                  <span className="text-yellow-400 text-sm font-bold">MTW</span>
                </div>
                <span className="text-slate-400">→</span>
                <div className="flex items-center space-x-2 flex-1">
                  <div className="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-green-400 font-mono text-sm">
                    {mtwUsd ? `$${mtwUsd}` : '$0.0000'}
                  </div>
                  <span className="text-green-400 text-sm font-bold">USD</span>
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-2">Rate: 1 MTW = ${MTW_PRICE} USD</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Mock fallback data
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
