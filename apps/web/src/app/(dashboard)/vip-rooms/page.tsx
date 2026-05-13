'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Crown, Star, X, Loader2, Users, DollarSign, TrendingUp } from 'lucide-react';

interface VIPRoom {
  id: string;
  name: string;
  entryFee: number;
  occupancy: number;
  maxCapacity: number;
  gradient: string;
  perks: string[];
  tags: string[];
  rating: number;
  description: string;
}

const VIP_ROOMS: VIPRoom[] = [
  {
    id: 'r1',
    name: 'The Penthouse',
    entryFee: 50,
    occupancy: 12,
    maxCapacity: 50,
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    perks: ['Exclusive rooftop views', 'Private NFT gallery', 'VIP concierge service'],
    tags: ['SOCIAL', 'LUXURY'],
    rating: 4.8,
    description: 'The most prestigious social hub in the metaverse.',
  },
  {
    id: 'r2',
    name: 'Crypto Whales Lounge',
    entryFee: 200,
    occupancy: 8,
    maxCapacity: 20,
    gradient: 'from-blue-600 via-cyan-500 to-teal-400',
    perks: ['Alpha trading signals', 'Whale wallet tracking', 'Private deal flow'],
    tags: ['TRADING', 'EXCLUSIVE'],
    rating: 4.9,
    description: 'Where the big players discuss market moves.',
  },
  {
    id: 'r3',
    name: 'Genesis Founders Club',
    entryFee: 500,
    occupancy: 3,
    maxCapacity: 10,
    gradient: 'from-purple-700 via-violet-600 to-indigo-500',
    perks: ['Direct access to MTW founders', 'Governance voting power boost', 'Early feature access'],
    tags: ['FOUNDERS', 'EXCLUSIVE'],
    rating: 5.0,
    description: 'An ultra-exclusive space for the original builders.',
  },
  {
    id: 'r4',
    name: 'NFT Elite Gallery',
    entryFee: 100,
    occupancy: 18,
    maxCapacity: 40,
    gradient: 'from-pink-600 via-rose-500 to-red-400',
    perks: ['Curated NFT exhibitions', 'Private auction access', 'Artist collaborations'],
    tags: ['NFT', 'ART'],
    rating: 4.7,
    description: 'The finest NFT art displayed in a luxurious virtual gallery.',
  },
  {
    id: 'r5',
    name: 'Diamond Vault',
    entryFee: 1000,
    occupancy: 2,
    maxCapacity: 5,
    gradient: 'from-slate-400 via-blue-300 to-cyan-200',
    perks: ['Ultra-exclusive networking', 'Guaranteed land allocation', 'Lifetime VIP status'],
    tags: ['ULTRA-VIP', 'DIAMOND'],
    rating: 5.0,
    description: 'The rarest membership in the metaverse. Only 5 seats.',
  },
  {
    id: 'r6',
    name: 'Metaverse Summit',
    entryFee: 250,
    occupancy: 22,
    maxCapacity: 75,
    gradient: 'from-green-600 via-emerald-500 to-teal-400',
    perks: ['Speaker sessions & AMAs', 'Networking with builders', 'Deal-making lounge'],
    tags: ['NETWORKING', 'SUMMIT'],
    rating: 4.6,
    description: 'Where the next generation of metaverse builders gather.',
  },
];

const TAG_COLORS: Record<string, string> = {
  SOCIAL: 'bg-blue-500/20 text-blue-400',
  LUXURY: 'bg-yellow-500/20 text-yellow-400',
  TRADING: 'bg-green-500/20 text-green-400',
  EXCLUSIVE: 'bg-purple-500/20 text-purple-400',
  FOUNDERS: 'bg-orange-500/20 text-orange-400',
  NFT: 'bg-pink-500/20 text-pink-400',
  ART: 'bg-rose-500/20 text-rose-400',
  'ULTRA-VIP': 'bg-slate-300/20 text-slate-300',
  DIAMOND: 'bg-cyan-500/20 text-cyan-400',
  NETWORKING: 'bg-teal-500/20 text-teal-400',
  SUMMIT: 'bg-emerald-500/20 text-emerald-400',
};

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          size={12}
          className={n <= Math.round(value) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}
        />
      ))}
      <span className="text-slate-400 text-xs ml-1">{value.toFixed(1)}</span>
    </div>
  );
}

function EntryModal({ room, onClose }: { room: VIPRoom; onClose: () => void }) {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = async () => {
    setPaying(true);
    await new Promise(r => setTimeout(r, 2000));
    setPaying(false);
    setPaid(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-yellow-500/30 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Crown size={20} className="text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Enter VIP Room</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {paid ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">👑</div>
            <p className="text-yellow-400 text-lg font-bold">Access Granted!</p>
            <p className="text-slate-400 text-sm mt-2">Welcome to {room.name}</p>
            <p className="text-slate-500 text-xs mt-1">{room.entryFee} MTW deducted from your balance</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black font-bold transition-colors">
              Enter Room
            </button>
          </div>
        ) : (
          <>
            <div className={`h-24 rounded-xl bg-gradient-to-br ${room.gradient} mb-4 flex items-center justify-center`}>
              <h3 className="text-white text-xl font-black drop-shadow-lg">{room.name}</h3>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Entry Fee</span>
                <span className="text-yellow-400 font-bold text-lg">{room.entryFee} MTW</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Occupancy</span>
                <span className="text-white text-sm">{room.occupancy}/{room.maxCapacity}</span>
              </div>
              <div className="border-t border-slate-800 pt-3">
                <p className="text-slate-400 text-xs font-medium mb-2">INCLUDED PERKS</p>
                <ul className="space-y-1">
                  {room.perks.map((p, i) => (
                    <li key={i} className="flex items-center space-x-2 text-sm text-slate-300">
                      <span className="text-yellow-400">✦</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-800/60 rounded-lg p-3 mb-5 text-xs text-slate-400">
              <p>💡 Your wallet will be prompted to sign a transaction of <span className="text-yellow-400 font-bold">{room.entryFee} MTW</span>.</p>
              <p className="mt-1">15% goes to DAO Treasury • 85% goes to room creator.</p>
            </div>

            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 disabled:opacity-50 rounded-lg text-black font-bold transition-opacity flex items-center justify-center space-x-2"
            >
              {paying ? (
                <><Loader2 size={18} className="animate-spin" /><span>Processing...</span></>
              ) : (
                <><Crown size={18} /><span>Pay {room.entryFee} MTW & Enter</span></>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VIPRoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<VIPRoom | null>(null);
  const [earnings, setEarnings] = useState('');

  const estimatedEarnings = earnings
    ? (parseFloat(earnings) * 0.85 * 0.7 * 30).toFixed(0)
    : '';

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-8 py-6">
          <div className="flex items-center space-x-3">
            <Crown size={28} className="text-yellow-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Exclusive VIP Rooms</h1>
              <p className="text-slate-400 text-sm mt-0.5">Where the elite gather. Pay the entry fee, unlock the experience.</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-8">
          {/* Revenue transparency */}
          <div className="flex items-center space-x-4 p-4 bg-slate-900/60 border border-slate-700 rounded-xl">
            <DollarSign size={20} className="text-green-400 shrink-0" />
            <p className="text-slate-300 text-sm">
              <span className="text-green-400 font-bold">85%</span> of all room fees go to room creators •
              <span className="text-blue-400 font-bold"> 15%</span> goes to the DAO Treasury
            </p>
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {VIP_ROOMS.map(room => (
              <div
                key={room.id}
                className="bg-slate-900 border border-slate-800 hover:border-yellow-500/40 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:shadow-yellow-500/5 group"
              >
                {/* Room image */}
                <div className={`h-36 bg-gradient-to-br ${room.gradient} relative`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <h3 className="text-white font-black text-lg drop-shadow-lg">{room.name}</h3>
                    <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <Users size={10} className="text-white" />
                      <span className="text-white text-xs">{room.occupancy}/{room.maxCapacity}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <StarRating value={room.rating} />
                    <div className="flex flex-wrap gap-1 justify-end">
                      {room.tags.map(tag => (
                        <span key={tag} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${TAG_COLORS[tag] ?? 'bg-slate-700 text-slate-300'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">{room.description}</p>

                  <ul className="space-y-1.5 mb-5">
                    {room.perks.map((perk, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm text-slate-300">
                        <span className="text-yellow-400 text-xs">✦</span>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div>
                      <p className="text-slate-500 text-xs">Entry Fee</p>
                      <p className="text-yellow-400 font-bold text-lg">{room.entryFee} MTW</p>
                    </div>
                    <button
                      onClick={() => setSelectedRoom(room)}
                      className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:opacity-90 rounded-lg text-black font-bold text-sm transition-opacity flex items-center space-x-2"
                    >
                      <Crown size={14} />
                      <span>Pay & Enter</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Create Your Own Room CTA */}
            <div className="bg-slate-900 border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-2xl p-6 flex flex-col justify-between transition-colors">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                  <TrendingUp size={24} className="text-blue-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Become a Room Host</h3>
                <p className="text-slate-400 text-sm mb-4">Launch your own exclusive VIP room and earn 85% of every entry fee.</p>
                <ul className="space-y-2 text-sm text-slate-300 mb-5">
                  <li className="flex items-center space-x-2"><span className="text-green-400">✓</span><span>Setup fee: 500 MTW (one-time)</span></li>
                  <li className="flex items-center space-x-2"><span className="text-green-400">✓</span><span>Set your own entry price</span></li>
                  <li className="flex items-center space-x-2"><span className="text-green-400">✓</span><span>Earn passively 24/7</span></li>
                </ul>
                <div className="bg-slate-800/60 rounded-lg p-4 mb-5">
                  <p className="text-slate-400 text-xs mb-2 font-medium">EARNINGS CALCULATOR</p>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="number"
                      value={earnings}
                      onChange={e => setEarnings(e.target.value)}
                      placeholder="Daily visitors"
                      className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-slate-400 text-xs">visitors/day</span>
                  </div>
                  {estimatedEarnings && (
                    <p className="text-green-400 text-sm font-bold">~{estimatedEarnings} MTW/month</p>
                  )}
                </div>
              </div>
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-bold transition-colors">
                Create My VIP Room
              </button>
            </div>
          </div>
        </div>
      </main>

      {selectedRoom && (
        <EntryModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
      )}
    </div>
  );
}
