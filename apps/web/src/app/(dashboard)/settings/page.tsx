'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Eye, Globe, Zap, Save, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="text-slate-400 w-10 h-10" />
          Settings
        </h1>
        <p className="text-slate-400 mt-1">Configure your metaverse experience.</p>
      </header>

      <div className="space-y-6">
        {/* Account Settings */}
        <section className="glass rounded-3xl overflow-hidden border border-slate-800">
          <div className="px-8 py-6 bg-white/5 border-b border-slate-800 flex items-center gap-3">
            <Lock size={18} className="text-blue-400" />
            <h2 className="font-bold text-white uppercase tracking-widest text-xs">Security & Privacy</h2>
          </div>
          <div className="p-8 space-y-6">
            <SettingToggle title="Incognito Mode" description="Hide your location on the map from other users." />
            <SettingToggle title="Two-Factor Auth" description="Secure your transactions with a secondary device." checked />
            <SettingToggle title="Show NFT Wallet" description="Publicly display your collection on your profile." checked />
          </div>
        </section>

        {/* Interface Settings */}
        <section className="glass rounded-3xl overflow-hidden border border-slate-800">
          <div className="px-8 py-6 bg-white/5 border-b border-slate-800 flex items-center gap-3">
            <Zap size={18} className="text-yellow-500" />
            <h2 className="font-bold text-white uppercase tracking-widest text-xs">Interface & Graphics</h2>
          </div>
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest">Graphics Quality</label>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High', 'Ultra'].map(level => (
                  <button 
                    key={level} 
                    aria-label={`Set graphics to ${level}`}
                    aria-pressed="false"
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${level === 'High' ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <SettingToggle title="Enable VR Mode" description="Optimize interface for virtual reality headsets." />
            <SettingToggle title="Hardware Acceleration" description="Use GPU for 3D map rendering performance." checked />
          </div>
        </section>

        {/* Notification Settings */}
        <section className="glass rounded-3xl overflow-hidden border border-slate-800">
          <div className="px-8 py-6 bg-white/5 border-b border-slate-800 flex items-center gap-3">
            <Bell size={18} className="text-purple-400" />
            <h2 className="font-bold text-white uppercase tracking-widest text-xs">Notifications</h2>
          </div>
          <div className="p-8 space-y-6">
            <SettingToggle title="Sales Alerts" description="Notify when someone purchases your listed NFT." checked />
            <SettingToggle title="Bid Updates" description="Instant notification for new bids on your assets." checked />
            <SettingToggle title="Platform News" description="Receive updates about new districts and features." />
          </div>
        </section>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-900">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={loading}
          aria-label="Save changes"
          className="px-10 py-4 bg-white text-black font-black rounded-2xl flex items-center gap-2 shadow-xl hover:bg-cyan-400 transition-all disabled:opacity-50"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </motion.button>
      </div>
    </div>
  );
}

function SettingToggle({ title, description, checked = false }: { title: string, description: string, checked?: boolean }) {
  const [isEnabled, setIsEnabled] = useState(checked);

  return (
    <div className="flex items-center justify-between gap-8 group">
      <div>
        <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        aria-label={`Toggle ${title}`}
        aria-pressed={isEnabled ? 'true' : 'false'}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isEnabled ? 'bg-blue-600' : 'bg-slate-800'}`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  );
}
