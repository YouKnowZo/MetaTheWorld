'use client';

import React, { useEffect, useState, useRef } from 'react';

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
    <div className="flex items-center space-x-8 px-4">
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
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,matic-network,tether&vs_currencies=usd&include_24hr_change=true',
        { next: { revalidate: 0 } }
      );
      if (!res.ok) throw new Error('API error');
      const data: PriceData = await res.json();
      setPrices(data);
      lastKnownRef.current = data;
      setError(false);
    } catch {
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
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (val?: number) => {
    if (typeof val !== 'number') return '0.00';
    if (val >= 1000) return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (val >= 1) return val.toFixed(4);
    return val.toFixed(6);
  };

  const formatChange = (val?: number) => {
    if (typeof val !== 'number') return '0.00%';
    const sign = val >= 0 ? '+' : '';
    return `${sign}${val.toFixed(2)}%`;
  };

  return (
    <div className="w-full bg-slate-950 border-b border-slate-800 overflow-hidden" style={{ height: '32px' }}>
      <div className="flex items-center h-full px-3 space-x-6">
        <div className="flex items-center space-x-1 shrink-0">
          <span
            className="inline-block w-2 h-2 rounded-full bg-green-400"
            style={{ animation: 'blink 1.2s ease-in-out infinite' }}
          />
          <span className="text-green-400 text-[10px] font-bold tracking-widest uppercase">LIVE</span>
        </div>

        <div className="flex-1 overflow-hidden">
          {loading && !prices ? (
            <SkeletonTicker />
          ) : (
            <div
              className="flex items-center space-x-8"
              style={{ animation: 'ticker-scroll 40s linear infinite', whiteSpace: 'nowrap' }}
            >
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
