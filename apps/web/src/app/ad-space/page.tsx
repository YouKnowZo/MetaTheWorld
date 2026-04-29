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
    // In a real application, this would interact with the AdSpace smart contract
    // e.g., await adSpaceContract.bookAdSlot(slot.id, duration);
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

function CreateCampaignForm({ onClose }: { onClose: () => void }) {
  const [campaignName, setCampaignName] = useState('');
  const [adContent, setAdContent] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [formDuration, setFormDuration] = useState('7');
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const toggleLocation = (id: string) => {
    setSelectedLocations(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const estimatedImpressions = selectedLocations.reduce((sum, id) => {
    const slot = AD_SLOTS.find(s => s.id === id);
    return sum + (slot ? slot.dailyVisitors * parseInt(formDuration || '7') * 0.4 : 0);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    await new Promise(r => setTimeout(r, 2000));
    // In a real application, this would interact with the AdSpace smart contract
    // and potentially a content storage solution for adContent
    console.log("New Campaign:", { campaignName, adContent, selectedLocations, formDuration });
    setCreating(false);
    setCreated(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Create New Ad Campaign</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        {created ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-green-400 text-lg font-bold">Campaign Created Successfully!</p>
            <p className="text-slate-400 text-sm mt-2">{campaignName}</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="campaignName" className="block text-slate-400 text-sm mb-2">Campaign Name</label>
              <input
                type="text"
                id="campaignName"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
                placeholder="e.g., Summer Sale Promotion"
                required
              />
            </div>
            <div>
              <label htmlFor="adContent" className="block text-slate-400 text-sm mb-2">Ad Content (Text or Image URL)</label>
              <textarea
                id="adContent"
                value={adContent}
                onChange={(e) => setAdContent(e.target.value)}
                rows={3}
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
                placeholder="Enter ad text or image URL"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-2">Target Ad Slots</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
                {AD_SLOTS.map(slot => (
                  <div
                    key={slot.id}
                    onClick={() => toggleLocation(slot.id)}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedLocations.includes(slot.id)
                        ? 'bg-blue-600 border-blue-500'
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {selectedLocations.includes(slot.id) ? <CheckSquare size={20} className="text-white mr-3" /> : <Square size={20} className="text-slate-500 mr-3" />}
                    <div className="flex-1">
                      <p className="text-white font-medium">{slot.location}</p>
                      <p className="text-slate-400 text-xs">{slot.adType} • ${slot.priceUSD}/day</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="duration" className="block text-slate-400 text-sm mb-2">Duration (Days)</label>
              <input
                type="number"
                id="duration"
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
                min="1"
                className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="bg-slate-800/60 rounded-lg p-3">
              <p className="text-slate-400 text-sm">Estimated Total Impressions: <span className="text-white font-bold">{estimatedImpressions.toLocaleString()}</span></p>
              <p className="text-slate-500 text-xs mt-1">Based on selected slots and duration (40% daily visitors est.)</p>
            </div>
            <button
              type="submit"
              disabled={creating || selectedLocations.length === 0 || !campaignName || !adContent}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-white font-bold transition-colors"
            >
              {creating ? 'Creating Campaign...' : 'Create Campaign'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AdSpacePage() {
  const [activeTab, setActiveTab] = useState<'slots' | 'campaigns'>('slots');
  const [selectedSlot, setSelectedSlot] = useState<AdSlot | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);

  const handleCreateCampaign = (newCampaign: Campaign) => {
    setCampaigns(prev => [...prev, newCampaign]);
    setShowCreateForm(false);
  };

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
              <span className="text-red-400 font-bold">40%</span>
              <span className="text-slate-300">.</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('slots')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'slots' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Available Ad Slots
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'campaigns' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              My Campaigns
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="ml-auto px-4 py-2 bg-green-600 rounded-lg text-white font-medium hover:bg-green-700 transition-colors flex items-center"
            >
              <Megaphone size={18} className="mr-2" /> Create New Campaign
            </button>
          </div>

          {activeTab === 'slots' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AD_SLOTS.map(slot => (
                <div
                  key={slot.id}
                  className={`bg-slate-900 border ${slot.booked ? 'border-slate-700' : 'border-blue-500'} rounded-2xl p-5 space-y-4`}
                >
                  <div className={`h-32 rounded-xl bg-gradient-to-br ${slot.gradient} flex items-center justify-center`}>
                    <p className="text-white font-bold text-lg text-center">{slot.location}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${AD_TYPE_COLORS[slot.adType]}`}>
                      {slot.adType}
                    </span>
                    {slot.booked ? (
                      <span className="text-red-400 flex items-center"><Clock size={16} className="mr-1" /> Booked</span>
                    ) : (
                      <span className="text-green-400 flex items-center"><CheckSquare size={16} className="mr-1" /> Available</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-slate-800 rounded-lg p-3">
                      <p className="text-slate-400 text-xs">Daily Visitors</p>
                      <p className="text-white font-bold">{slot.dailyVisitors.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-800 rounded-lg p-3">
                      <p className="text-slate-400 text-xs">Location Type</p>
                      <p className="text-white font-bold flex items-center"><MapPin size={14} className="mr-1" /> {slot.location.split(' ').pop()}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <p className="text-slate-400 text-xs">Price / Day</p>
                      <p className="text-white font-bold text-lg">${slot.priceUSD}</p>
                      <p className="text-yellow-400 text-sm">~{slot.priceMTW} MTW</p>
                    </div>
                    <button
                      onClick={() => setSelectedSlot(slot)}
                      disabled={slot.booked}
                      className="px-5 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {slot.booked ? 'View Campaign' : 'Book Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-4">
              {campaigns.length === 0 ? (
                <div className="text-center text-slate-500 py-10">No active campaigns. Create one above!</div>
              ) : (
                campaigns.map(campaign => (
                  <div key={campaign.id} className="bg-slate-900 border border-slate-700 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-lg">{campaign.name}</p>
                      <p className="text-slate-400 text-sm flex items-center"><MapPin size={14} className="mr-1" /> {campaign.location}</p>
                      <div className="flex space-x-4 mt-2 text-sm">
                        <p className="text-slate-400">Budget: <span className="text-white">{campaign.budget}</span></p>
                        <p className="text-slate-400">Impressions: <span className="text-white">{campaign.impressions}</span></p>
                        <p className="text-slate-400">CTR: <span className="text-white">{campaign.ctr}</span></p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[campaign.status]}`}>
                      {campaign.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {selectedSlot && <BookingModal slot={selectedSlot} onClose={() => setSelectedSlot(null)} />}
      {showCreateForm && <CreateCampaignForm onClose={() => setShowCreateForm(false)} />}
    </div>
  );
}



