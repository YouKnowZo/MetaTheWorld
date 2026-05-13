'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Crown, Music, Send, Zap, Users, MessageSquare, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  time: string;
  color: string;
}

interface Avatar {
  id: string;
  initials: string;
  username: string;
  color: string;
  emoji: string;
  isVip: boolean;
  delay: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];
const NAMES = ['CryptoKing', 'NeonRider', 'MetaWolf', 'DiamondHands', 'MoonShot', 'NFTQueen', 'Web3Wizard'];
const EMOJIS = ['🕺', '💃', '🎉', '🔥', '💎', '🚀', '👑', '🎵'];

const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm1', username: 'CryptoKing', message: 'LFG this track is 🔥🔥🔥', time: '12:08', color: '#6366f1' },
  { id: 'm2', username: 'NFTQueen', message: 'Just sold my Paris District for 5 ETH!', time: '12:08', color: '#ec4899' },
  { id: 'm3', username: 'MoonShot', message: 'who else is buying land tonight?', time: '12:09', color: '#f97316' },
];

export default function PartyRoomPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [inputMsg, setInputMsg] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: string; emoji: string; x: number }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const avatars = useRef(Array.from({ length: 15 }, (_, i) => ({
    id: `av${i}`,
    initials: NAMES[i % NAMES.length].slice(0, 2).toUpperCase(),
    username: NAMES[i % NAMES.length],
    color: COLORS[i % COLORS.length],
    emoji: EMOJIS[i % EMOJIS.length],
    isVip: i < 3,
    delay: Math.random() * 2,
  })));

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputMsg.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages(prev => [...prev, { id: `u${Date.now()}`, username: 'You', message: inputMsg, time: timeStr, color: '#06b6d4' }]);
    setInputMsg('');
  };

  const sendEmoji = (emoji: string) => {
    const id = `fe${Date.now()}`;
    setFloatingEmojis(prev => [...prev, { id, emoji, x: Math.random() * 80 + 10 }]);
    setTimeout(() => setFloatingEmojis(prev => prev.filter(e => e.id !== id)), 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col relative overflow-hidden bg-party-gradient">
        {/* Floating Emojis Layer */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <AnimatePresence>
            {floatingEmojis.map(fe => (
              <motion.div
                key={fe.id}
                initial={{ y: 0, opacity: 1, scale: 0.5 }}
                animate={{ y: -400, opacity: 0, scale: 2 }}
                style={{ '--x': `${fe.x}%` } as React.CSSProperties}
                className="absolute text-4xl left-[var(--x)] bottom-[100px]"
              >
                {fe.emoji}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Visualizer Header */}
        <div className="p-8 relative z-10">
          <div className="glass p-6 rounded-3xl border border-purple-500/30 flex items-center justify-between shadow-[0_0_50px_rgba(139,92,246,0.2)]">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                <Music size={28} className="text-white animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">Streaming Live</p>
                <h2 className="text-2xl font-black text-white">Neon Nights <span className="text-slate-500 font-medium">by DJ MetaWorld</span></h2>
                <div className="flex gap-1 h-3 mt-2 items-end">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 12, 6, 12, 4] }}
                      transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                      className="w-1 bg-purple-500/50 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-8 pr-4">
              <Stat mini label="Users" value="247" icon={<Users size={12} />} />
              <Stat mini label="Vibe" value="High" icon={<Zap size={12} />} />
            </div>
          </div>
        </div>

        {/* Dance Floor */}
        <div className="flex-1 flex flex-wrap items-center justify-center gap-12 p-12 overflow-y-auto no-scrollbar">
          {avatars.current.map(av => (
            <motion.div
              key={av.id}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 1 + av.delay, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-3"
            >
              <div 
                style={{ '--avatar-color': av.color } as React.CSSProperties}
                className="w-16 h-16 rounded-3xl flex items-center justify-center text-white font-black text-xl shadow-2xl relative group cursor-pointer bg-[var(--avatar-color)]"
              >
                {av.initials}
                {av.isVip && <Crown className="absolute -top-3 -right-3 text-yellow-400 fill-yellow-400 drop-shadow-lg" size={18} />}
                <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold text-slate-300 border border-white/5">
                {av.username}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="p-8 pt-0">
          <div className="glass p-4 rounded-3xl border border-white/5 flex items-center justify-center gap-6">
            {['🎉', '🔥', '💎', '🚀', '👑', '💃', '🕺', '✨'].map(emoji => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.5, rotate: 10 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => sendEmoji(emoji)}
                className="text-3xl filter drop-shadow-md"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      <div className="w-96 glass-light border-l border-white/5 flex flex-col shadow-2xl relative z-30">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-cyan-400" />
            <h3 className="font-black text-white uppercase tracking-widest text-xs">Live Feed</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {messages.map(msg => (
            <div key={msg.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span 
                  style={{ '--msg-color': msg.color } as React.CSSProperties}
                  className="text-[10px] font-black uppercase tracking-widest text-[var(--msg-color)]"
                >
                  {msg.username}
                </span>
                <span className="text-[9px] text-slate-600 font-mono">{msg.time}</span>
              </div>
              <p className="text-sm text-slate-300 bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5">{msg.message}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-black/20">
          <div className="relative">
            <input
              type="text"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Join the conversation..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 pr-14"
            />
            <button
              onClick={sendMessage}
              aria-label="Send message"
              className="absolute right-2 top-2 p-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white transition-all shadow-lg shadow-purple-600/20"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon, mini = false }: { label: string, value: string, icon: React.ReactNode, mini?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white/5 rounded-lg text-slate-400">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
        <p className="text-white font-black text-sm">{value}</p>
      </div>
    </div>
  );
}
