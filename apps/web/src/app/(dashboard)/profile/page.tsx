'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { User, Wallet, Shield, Award, MapPin, ExternalLink, Copy } from 'lucide-react';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
          <Wallet size={32} className="text-slate-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Wallet Disconnected</h2>
        <p className="text-slate-400 max-w-sm mb-8">Please connect your wallet using the button in the sidebar to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <header className="relative p-10 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-black z-0" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-3xl bg-slate-900 border-2 border-cyan-500/30 flex items-center justify-center text-5xl shadow-xl">
            🧑‍🚀
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-black text-white tracking-tight">Explorer</h1>
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-cyan-500/20">Level 12</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-mono text-sm group cursor-pointer">
              {address}
              <Copy size={14} className="group-hover:text-white transition-colors" />
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
              <StatItem label="Balance" value="1,250 MTW" />
              <StatItem label="Lands" value="14 Parcels" />
              <StatItem label="Assets" value="8 Items" />
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Achievements */}
          <section className="glass p-8 rounded-3xl border border-slate-800">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Award className="text-yellow-500" />
              Achievements
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <AchievementCard icon="🌍" title="Globetrotter" description="Visit 5 districts" completed />
              <AchievementCard icon="💎" title="Land Baron" description="Own 10 parcels" completed />
              <AchievementCard icon="🚀" title="Early Bird" description="Joined in Genesis" completed />
              <AchievementCard icon="🎰" title="High Roller" description="Win 1000 MTW" />
              <AchievementCard icon="🤝" title="Socialite" description="Meet 50 users" />
              <AchievementCard icon="🎨" title="Architect" description="Build 3 structures" />
            </div>
          </section>

          {/* Activity */}
          <section className="glass p-8 rounded-3xl border border-slate-800">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <RefreshCw className="text-blue-500" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              <ActivityItem icon={<MapPin size={16} />} title="Purchased Land #1337" time="2 hours ago" status="Success" />
              <ActivityItem icon={<Award size={16} />} title="Unlocked 'Land Baron'" time="5 hours ago" status="Achievement" />
              <ActivityItem icon={<ExternalLink size={16} />} title="Minted Cyber Jacket" time="1 day ago" status="Blockchain" />
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Reputation/Shield */}
          <section className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-3xl border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-white uppercase tracking-widest text-xs">Security Status</h3>
              <Shield className="text-emerald-500" size={20} />
            </div>
            <div className="text-center py-4">
              <div className="text-4xl font-black text-white mb-1">98%</div>
              <div className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Trust Score</div>
            </div>
            <div className="space-y-3 mt-6">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">KYC Verified</span>
                <span className="text-emerald-500">Yes</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">2FA Enabled</span>
                <span className="text-emerald-500">Yes</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Account Age</span>
                <span className="text-white">42 Days</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="px-5 py-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5">
      <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">{label}</p>
      <p className="text-white font-black">{value}</p>
    </div>
  );
}

function AchievementCard({ icon, title, description, completed = false }: { icon: string, title: string, description: string, completed?: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border ${completed ? 'bg-white/5 border-white/10' : 'bg-black/20 border-slate-800 opacity-50'} transition-all hover:bg-white/10`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-xs font-bold text-white mb-1 leading-tight">{title}</div>
      <div className="text-[10px] text-slate-500 leading-tight">{description}</div>
    </div>
  );
}

function ActivityItem({ icon, title, time, status }: { icon: React.ReactNode, title: string, time: string, status: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0 group">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-all">
          {icon}
        </div>
        <div>
          <div className="text-sm font-bold text-white">{title}</div>
          <div className="text-xs text-slate-500">{time}</div>
        </div>
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">{status}</span>
    </div>
  );
}

function RefreshCw({ className, size = 20 }: { className?: string, size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}
