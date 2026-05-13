'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Megaphone, X, ChevronDown, ChevronUp, BarChart2, MapPin, Clock, CheckSquare, Square } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Book Ad Slot</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        {booked ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">📣</div>
            <p className="text-green-400 text-lg font-bold">Campaign Booked!</p>
            <p className="text-slate-400 text-sm mt-2">{slot.location}</p>
            <p className="text-slate-500 text-xs mt-1">{duration} days • ${total.toLocaleString()} total</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700">
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`h-20 rounded-xl bg-gradient-to-br ${slot.gradient} flex items-center justify-center`}>
              <p className="text-white font-bold">{slot.location}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-800 rounded-lg p-3">
                <p className="text-slate-400 text-xs">Daily Visitors</p>
                <p className="text-white font-bold">{slot.dailyVisitors.toLocaleString()}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <p className="text-slate-400 text-xs">Ad Type</p>
                <p className="text-white font-bold">{slot.adType}</p>
              </div>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Duration</label>
              <div className="flex space-x-2">
                {[7, 30, 90].map(d => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      duration === d ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">{slot.priceUSD}/day × {duration} days</span>
                <span className="text-white font-bold">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-slate-500">Or pay in MTW</span>
                <span className="text-yellow-400">{(slot.priceMTW * duration).toLocaleString()} MTW</span>
              </div>
              <p className="text-slate-500 text-xs mt-2">Est. impressions: ~{(slot.dailyVisitors * duration * 0.4).toLocaleString()}</p>
            </div>
            <button
              onClick={handleBook}
              disabled={booking}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-white font-bold transition-colors"
            >
              {booking ? 'Processing...' : `Book for $${total.toLocaleString()}`}
            </button>
          </div>
        )}
      </div>
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
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-8 py-6">
          <div className="flex items-center space-x-3 mb-4">
            <Megaphone size={28} className="text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Advertising Marketplace</h1>
              <p className="text-slate-400 text-sm">Buy premium virtual billboard space across the metaverse</p>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            {[
              { label: 'Active Campaigns', value: '1,247' },
              { label: 'Total Ad Spend', value: '$2.4M' },
              { label: 'Avg CPM', value: '$12.50' },
              { label: 'Total Impressions', value: '890M' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-white font-bold">{s.value}</p>
                <p className="text-slate-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Revenue sharing notice */}
          <div className="flex items-start space-x-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <BarChart2 size={20} className="text-blue-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <span className="text-white font-medium">Revenue Sharing: </span>
              <span className="text-slate-300">Land owners earn </span>
              <span className="text-green-400 font-bold">60%</span>
              <span className="text-slate-300"> of ad revenue • Platform takes </span>
              <span className="text-blue-400 font-bold">40%</span>
              <span className="text-slate-300"> • Accepted payments: ETH, MATIC, MTW, </span>
              <span className="text-slate-500">Credit Card (coming soon)</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-slate-900 rounded-lg p-1 w-fit">
            {(['slots', 'campaigns'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'slots' ? 'Available Ad Slots' : 'My Campaigns'}
              </button>
            ))}
          </div>

          {activeTab === 'slots' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                {AD_SLOTS.map(slot => (
                  <div key={slot.id} className="bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-xl overflow-hidden transition-all">
                    <div className={`h-32 bg-gradient-to-br ${slot.gradient} relative`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-sm ${AD_TYPE_COLORS[slot.adType]}`}>
                          {slot.adType}
                        </span>
                      </div>
                      {slot.booked && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="px-3 py-1 bg-red-500/80 text-white text-xs font-bold rounded">BOOKED</span>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-3 right-3">
                        <p className="text-white font-bold text-sm drop-shadow">{slot.location}</p>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1.5">
                          <MapPin size={12} className="text-slate-400" />
                          <span className="text-slate-400 text-xs">{slot.dailyVisitors.toLocaleString()} daily visitors</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock size={12} className="text-slate-400" />
                          <span className="text-slate-400 text-xs">Available now</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-white font-bold">${slot.priceUSD}<span className="text-slate-400 text-xs font-normal">/day</span></p>
                          <p className="text-yellow-400 text-xs">{slot.priceMTW} MTW/day</p>
                        </div>
                        <button
                          onClick={() => !slot.booked && setSelectedSlot(slot)}
                          disabled={slot.booked}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-white text-sm font-semibold transition-colors"
                        >
                          {slot.booked ? 'Booked' : 'Book Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Campaign Submission Form */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Megaphone size={18} className="text-blue-400" />
                    <span className="text-white font-semibold">Submit New Campaign</span>
                  </div>
                  {showForm ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </button>

                {showForm && (
                  <div className="px-6 pb-6 space-y-5 border-t border-slate-800">
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <label className="block text-slate-400 text-sm mb-1">Campaign Name</label>
                        <input type="text" placeholder="e.g. Spring NFT Drop" className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-sm mb-1">Ad Creative (URL)</label>
                        <input type="text" placeholder="https://..." className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Select Locations</label>
                      <div className="grid grid-cols-2 gap-2">
                        {AD_SLOTS.filter(s => !s.booked).map(slot => (
                          <button
                            key={slot.id}
                            onClick={() => toggleLocation(slot.id)}
                            className="flex items-center space-x-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors"
                          >
                            {selectedLocations.includes(slot.id)
                              ? <CheckSquare size={14} className="text-blue-400 shrink-0" />
                              : <Square size={14} className="text-slate-500 shrink-0" />}
                            <span className="text-slate-300 text-xs">{slot.location}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-sm mb-2">Duration</label>
                      <div className="flex space-x-2">
                        {['7', '30', '90'].map(d => (
                          <button
                            key={d}
                            onClick={() => setFormDuration(d)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              formDuration === d ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                          >
                            {d} days
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedLocations.length > 0 && (
                      <div className="bg-slate-800/60 rounded-lg p-4">
                        <p className="text-slate-400 text-xs mb-1">Budget Estimate</p>
                        <p className="text-white font-bold">
                          ${selectedLocations.reduce((s, id) => {
                            const slot = AD_SLOTS.find(x => x.id === id);
                            return s + (slot ? slot.priceUSD * parseInt(formDuration) : 0);
                          }, 0).toLocaleString()}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">Est. impressions: ~{estimatedImpressions.toLocaleString()}</p>
                      </div>
                    )}

                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold text-sm transition-colors">
                      Submit Campaign
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'campaigns' && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-white font-semibold">Active Campaigns</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {['Campaign', 'Location', 'Budget', 'Impressions', 'CTR', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_CAMPAIGNS.map(c => (
                      <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-white text-sm font-medium">{c.name}</td>
                        <td className="px-6 py-4 text-slate-400 text-sm">{c.location}</td>
                        <td className="px-6 py-4 text-white text-sm font-mono">{c.budget}</td>
                        <td className="px-6 py-4 text-slate-300 text-sm">{c.impressions}</td>
                        <td className="px-6 py-4 text-green-400 text-sm font-mono">{c.ctr}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedSlot && <BookingModal slot={selectedSlot} onClose={() => setSelectedSlot(null)} />}
    </div>
  );
}
