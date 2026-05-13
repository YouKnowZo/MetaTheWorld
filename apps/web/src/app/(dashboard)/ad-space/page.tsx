'use client';

import React, { useState } from 'react';
import { Megaphone, X, ChevronDown, ChevronUp, BarChart2, MapPin, Clock, CheckSquare, Square } from 'lucide-react';
import { motion } from 'framer-motion';

type AdType = 'BILLBOARD' | 'BANNER' | 'POPUP' | 'SPONSORED_LAND';

interface AdSlot {
  id: string;
  location: string;
  adType: AdType;
  gradient: string;
  dailyVisitors: number;
  priceUSD: number;
  priceMTW: number;
  booked: boolean;
}

interface Campaign {
  id: string;
  name: string;
  location: string;
  budget: string;
  impressions: string;
  ctr: string;
  status: 'ACTIVE' | 'PAUSED' | 'ENDED';
}

const AD_SLOTS: AdSlot[] = [
  { id: 's1', location: 'Paris Eiffel Tower District', adType: 'BILLBOARD', gradient: 'from-blue-600 to-cyan-400', dailyVisitors: 12400, priceUSD: 85, priceMTW: 1003, booked: false },
  { id: 's2', location: 'NYC Times Square Block', adType: 'BILLBOARD', gradient: 'from-orange-500 to-red-500', dailyVisitors: 18700, priceUSD: 150, priceMTW: 1771, booked: true },
  { id: 's3', location: 'Tokyo Shibuya Crossing', adType: 'BANNER', gradient: 'from-pink-600 to-purple-500', dailyVisitors: 9800, priceUSD: 60, priceMTW: 708, booked: false },
  { id: 's4', location: 'Dubai Marina Plaza', adType: 'SPONSORED_LAND', gradient: 'from-yellow-500 to-orange-400', dailyVisitors: 7200, priceUSD: 45, priceMTW: 531, booked: false },
  { id: 's5', location: 'London City Square', adType: 'POPUP', gradient: 'from-green-600 to-teal-400', dailyVisitors: 5500, priceUSD: 35, priceMTW: 413, booked: true },
  { id: 's6', location: 'Sydney Harbor Promenade', adType: 'BANNER', gradient: 'from-indigo-600 to-blue-400', dailyVisitors: 8900, priceUSD: 55, priceMTW: 649, booked: false },
];

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'MTW Land Sale Q2', location: 'Paris Eiffel Tower', budget: '$2,550', impressions: '1.2M', ctr: '3.4%', status: 'ACTIVE' },
  { id: 'c2', name: 'VIP Room Launch', location: 'Tokyo Shibuya', budget: '$1,800', impressions: '890K', ctr: '2.1%', status: 'ACTIVE' },
  { id: 'c3', name: 'NFT Drop Spring', location: 'Sydney Harbor', budget: '$1,100', impressions: '420K', ctr: '1.8%', status: 'PAUSED' },
];

const AD_TYPE_COLORS: Record<AdType, string> = {
  BILLBOARD: 'bg-orange-500/20 text-orange-400',
  BANNER: 'bg-blue-500/20 text-blue-400',
  POPUP: 'bg-purple-500/20 text-purple-400',
  SPONSORED_LAND: 'bg-green-500/20 text-green-400',
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-500/20 text-green-400',
  PAUSED: 'bg-yellow-500/20 text-yellow-400',
  ENDED: 'bg-slate-500/20 text-slate-400',
};

function BookingModal({ slot, onClose }: { slot: AdSlot; onClose: () => void }) {
  const [duration, setDuration] = useState(7);
  const [booked, setBooked] = useState(false);
  const [booking, setBooking] = useState(false);

  const total = slot.priceUSD * duration;

  const handleBook = async () => {
    setBooking(true);
    await new Promise(r => setTimeout(r, 2000));
    setBooking(false);
    setBooked(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Book Ad Slot</h2>
          <button onClick={onClose} aria-label="Close modal" className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        {booked ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-6">📣</div>
            <p className="text-green-400 text-xl font-bold tracking-tight">Campaign Successfully Booked!</p>
            <p className="text-slate-400 mt-2">{slot.location}</p>
            <p className="text-slate-500 text-sm mt-1">{duration} days • ${total.toLocaleString()} total</p>
            <button onClick={onClose} className="mt-8 w-full py-4 bg-slate-800 rounded-2xl text-white font-bold hover:bg-slate-700 transition-all">
              Return to Marketplace
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`h-24 rounded-2xl bg-gradient-to-br ${slot.gradient} flex items-center justify-center shadow-lg`}>
              <p className="text-white font-black text-lg drop-shadow-md px-4 text-center">{slot.location}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Daily Traffic</p>
                <p className="text-white text-xl font-black">{slot.dailyVisitors.toLocaleString()}</p>
              </div>
              <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Ad Format</p>
                <p className="text-white text-xl font-black">{slot.adType}</p>
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Duration (Days)</label>
              <div className="flex gap-2">
                {[7, 30, 90].map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                      duration === d ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-750'
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400 text-sm font-medium">Total Campaign Cost</span>
                <span className="text-white text-2xl font-black font-mono">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">MTW Equivalent</span>
                <span className="text-yellow-500 font-bold">{(slot.priceMTW * duration).toLocaleString()} MTW</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBook}
              disabled={booking}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 rounded-2xl text-white font-black text-lg transition-all shadow-xl shadow-blue-500/20"
            >
              {booking ? <RefreshCw className="animate-spin mx-auto" /> : `Confirm Booking`}
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function AdSpacePage() {
  const [activeTab, setActiveTab] = useState<'slots' | 'campaigns'>('slots');
  const [selectedSlot, setSelectedSlot] = useState<AdSlot | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [formDuration, setFormDuration] = useState('7');

  const toggleLocation = (id: string) => {
    setSelectedLocations(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const estimatedImpressions = selectedLocations.reduce((sum, id) => {
    const slot = AD_SLOTS.find(s => s.id === id);
    return sum + (slot ? slot.dailyVisitors * parseInt(formDuration || '7') * 0.4 : 0);
  }, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 p-8 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600/20 rounded-2xl border border-blue-500/20">
            <Megaphone size={32} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Ad Marketplace</h1>
            <p className="text-slate-400">Reach the next generation of metaverse users.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pr-4">
          {[
            { label: 'Active', value: '1,247' },
            { label: 'Volume', value: '$2.4M' },
            { label: 'Avg CPM', value: '$12.50' },
            { label: 'Views', value: '890M' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-white text-xl font-black font-mono">{s.value}</p>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-900/50 rounded-2xl p-1.5 w-fit border border-slate-800">
        {(['slots', 'campaigns'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'slots' ? 'Ad Inventory' : 'My Campaigns'}
          </button>
        ))}
      </div>

      {activeTab === 'slots' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AD_SLOTS.map(slot => (
              <motion.div 
                key={slot.id} 
                whileHover={{ y: -5 }}
                className="glass rounded-3xl overflow-hidden border border-slate-800 hover:border-blue-500/30 transition-all flex flex-col"
              >
                <div className={`h-40 bg-gradient-to-br ${slot.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase backdrop-blur-md border border-white/10 ${AD_TYPE_COLORS[slot.adType]}`}>
                      {slot.adType}
                    </span>
                  </div>
                  {slot.booked && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="px-4 py-1 bg-red-500/20 text-red-400 text-xs font-black rounded-full border border-red-500/20 tracking-widest">OCCUPIED</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-6 right-6">
                    <p className="text-white font-black text-lg drop-shadow-lg leading-tight">{slot.location}</p>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin size={14} className="text-blue-500" />
                      <span>{slot.dailyVisitors.toLocaleString()} Daily</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Clock size={14} />
                      <span>{slot.booked ? 'Unavailable' : 'Live Now'}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-white text-2xl font-black font-mono">${slot.priceUSD}<span className="text-slate-500 text-xs font-normal">/day</span></p>
                      <p className="text-yellow-500 text-xs font-bold">{slot.priceMTW} MTW</p>
                    </div>
                    <button
                      onClick={() => !slot.booked && setSelectedSlot(slot)}
                      disabled={slot.booked}
                      aria-label={slot.booked ? "Space booked" : `Book space at ${slot.location}`}
                      className="px-6 py-3 bg-white text-black hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-sm font-black transition-all"
                    >
                      {slot.booked ? 'Booked' : 'Book Space'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Submission Form Component would go here, moved to focus on UI quality */}
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="glass rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-slate-800 bg-white/5">
            <h3 className="text-xl font-black text-white">Active Campaigns</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40">
                  {['Campaign', 'Location', 'Budget', 'Impact', 'CTR', 'Status', ''].map(h => (
                    <th key={h} className="px-8 py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {MOCK_CAMPAIGNS.map(c => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="text-white font-bold text-sm">{c.name}</div>
                      <div className="text-slate-500 text-xs font-mono">{c.id}</div>
                    </td>
                    <td className="px-8 py-6 text-slate-400 text-sm">{c.location}</td>
                    <td className="px-8 py-6 text-white text-sm font-black font-mono">{c.budget}</td>
                    <td className="px-8 py-6 text-slate-300 text-sm font-bold">{c.impressions}</td>
                    <td className="px-8 py-6 text-cyan-400 text-sm font-black font-mono">{c.ctr}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-slate-500 hover:text-white transition-colors">
                        <ChevronDown size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedSlot && <BookingModal slot={selectedSlot} onClose={() => setSelectedSlot(null)} />}
    </div>
  );
}

function RefreshCw({ className }: { className: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}
