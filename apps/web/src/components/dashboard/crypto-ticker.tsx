'use client';

import React, { useEffect, useState, useRef } from 'react';
import { formatNumber } from '@/utils/format';

interface CoinPrice {
  usd: number;
  usd_24h_change: number;
}

interface PriceData {
  bitcoin: CoinPrice;
  ethereum: CoinPrice;
  'matic-network': CoinPrice;
  tether: CoinPrice;
}

const COIN_LABELS: Record<string, string> = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  'matic-network': 'MATIC',
  tether: 'USDT',
};

function SkeletonTicker() {
  return (
    <div className="flex items-center space-x-8 px-4 h-full">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center space-x-2 animate-pulse">
          <div className="h-3 w-10 bg-slate-700 rounded" />
          <div className="h-3 w-16 bg-slate-700 rounded" />
          <div className="h-3 w-12 bg-slate-700 rounded" />
        </div>
      ))}
    </div>
  );
}

export function CryptoPriceTicker() {
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const lastKnownRef = useRef<PriceData | null>(null);

  const fetchPrices = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
      const res = await fetch(`${API_URL}/crypto/prices`, { 
        next: { revalidate: 0 },
        cache: 'no-store'
      });
      if (!res.ok) throw new Error('API error');
      const data: PriceData = await res.json();
      setPrices(data);
      lastKnownRef.current = data;
      setError(false);
    } catch (e) {
      console.error('Ticker Fetch Error:', e);
      if (lastKnownRef.current) {
        setPrices(lastKnownRef.current);
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (val?: number) => {
    const safeVal = typeof val === 'number' ? val : 0;
    if (safeVal >= 1000) return safeVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return formatNumber(safeVal, 4);
  };

  const formatChange = (val?: number) => {
    const safeVal = typeof val === 'number' ? val : 0;
    const sign = safeVal >= 0 ? '+' : '';
    return `${sign}${formatNumber(safeVal, 2)}%`;
  };

  return (
    <div className="w-full h-8 bg-slate-950 border-b border-slate-800 overflow-hidden">
      <div className="flex items-center h-full px-3 space-x-6">
        <div className="flex items-center space-x-1 shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-ticker-blink" />
          <span className="text-green-400 text-[10px] font-bold tracking-widest uppercase">LIVE</span>
        </div>

        <div className="flex-1 overflow-hidden h-full">
          {loading && !prices ? (
            <SkeletonTicker />
          ) : (
            <div className="flex items-center h-full space-x-8 animate-ticker-scroll whitespace-nowrap">
              {prices &&
                (Object.keys(COIN_LABELS) as Array<keyof typeof COIN_LABELS>).map((coin) => {
                  const data = prices[coin as keyof PriceData];
                  if (!data) return null;
                  const isPositive = (data.usd_24h_change || 0) >= 0;
                  return (
                    <span key={coin} className="inline-flex items-center space-x-2 shrink-0">
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
                        {COIN_LABELS[coin]}
                      </span>
                      <span className="text-white text-xs font-mono">${formatPrice(data.usd)}</span>
                      <span
                        className={`text-xs font-mono font-medium ${
                          isPositive ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {formatChange(data.usd_24h_change)}
                      </span>
                    </span>
                  );
                })}
              {/* Duplicate for seamless loop */}
              {prices &&
                (Object.keys(COIN_LABELS) as Array<keyof typeof COIN_LABELS>).map((coin) => {
                  const data = prices[coin as keyof PriceData];
                  if (!data) return null;
                  const isPositive = (data.usd_24h_change || 0) >= 0;
                  return (
                    <span key={`dup-${coin}`} className="inline-flex items-center space-x-2 shrink-0">
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
                        {COIN_LABELS[coin]}
                      </span>
                      <span className="text-white text-xs font-mono">${formatPrice(data.usd)}</span>
                      <span
                        className={`text-xs font-mono font-medium ${
                          isPositive ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {formatChange(data.usd_24h_change)}
                      </span>
                    </span>
                  );
                })}
            </div>
          )}
        </div>

        {error && (
          <span className="text-yellow-500 text-[10px] shrink-0">⚠ cached</span>
        )}
      </div>

      <style jsx>{`
        .animate-ticker-blink {
          animation: blink 1.2s ease-in-out infinite;
        }
        .animate-ticker-scroll {
          animation: ticker-scroll 40s linear infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
