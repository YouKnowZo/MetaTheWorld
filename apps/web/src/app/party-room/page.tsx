'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Crown, Music, Send, Zap } from 'lucide-react';

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

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7',
];

const NAMES = [
  'CryptoKing', 'NeonRider', 'MetaWolf', 'DiamondHands', 'MoonShot',
  'CyberPunk99', 'NFTQueen', 'BlockChainBob', 'Web3Wizard', 'SatoshiGhost',
  'PixelDancer', 'VoxelViper', 'AlphaHunter', 'GemCollector', 'RocketMan',
  'StarlightAva', 'ByteBandit', 'TokenTitan', 'DeFiDiva', 'HashHero',
];

const EMOJIS = ['🕺', '💃', '🎉', '🔥', '💎', '🚀', '👑', '🎵', '✨', '🌟'];

const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm1', username: 'CryptoKing', message: 'LFG this track is 🔥🔥🔥', time: '12:08', color: '#6366f1' },
  { id: 'm2', username: 'NFTQueen', message: 'Just sold my Paris District for 5 ETH!', time: '12:08', color: '#ec4899' },
  { id: 'm3', username: 'MoonShot', message: 'who else is buying land tonight?', time: '12:09', color: '#f97316' },
  { id: 'm4', username: 'Web3Wizard', message: 'MTW token pumping 🚀', time: '12:09', color: '#22c55e' },
  { id: 'm5', username: 'DiamondHands', message: 'GM everyone 💎', time: '12:10', color: '#eab308' },
  { id: 'm6', username: 'CyberPunk99', message: 'DJ MetaWorld dropping the best sets!', time: '12:10', color: '#8b5cf6' },
  { id: 'm7', username: 'PixelDancer', message: '🕺🕺🕺🕺🕺', time: '12:11', color: '#06b6d4' },
  { id: 'm8', username: 'AlphaHunter', message: 'This room is WILD tonight', time: '12:11', color: '#f43f5e' },
];

const NEW_MESSAGES = [
  { username: 'RocketMan', message: 'To the moon!! 🚀🚀', color: '#3b82f6' },
  { username: 'VoxelViper', message: 'Anyone want to trade land parcels?', color: '#a855f7' },
  { username: 'ByteBandit', message: '🎉🎉🎉 Party time!', color: '#22c55e' },
  { username: 'DeFiDiva', message: 'yield farming while partying lol', color: '#ec4899' },
  { username: 'HashHero', message: 'WAGMI frens 🙌', color: '#f97316' },
  { username: 'StarlightAva', message: 'This is what metaverse was meant to be!', color: '#06b6d4' },
  { username: 'TokenTitan', message: 'MTW going to $1 eoy 👑', color: '#eab308' },
  { username: 'GemCollector', message: '💎💎 stacking gems', color: '#6366f1' },
];

const EVENTS = [
  { name: 'NFT Drop Party', date: 'Apr 19, 2026 • 8PM UTC', price: 'FREE', badge: 'bg-green-500' },
  { name: 'MTW Token Launch Celebration', date: 'Apr 25, 2026 • 9PM UTC', price: '10 MTW', badge: 'bg-yellow-500' },
  { name: 'Metaverse World Cup Finals', date: 'May 1, 2026 • 7PM UTC', price: '25 MTW', badge: 'bg-blue-500' },
];

function generateAvatars(): Avatar[] {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `av${i}`,
    initials: NAMES[i % NAMES.length].slice(0, 2).toUpperCase(),
    username: NAMES[i % NAMES.length],
    color: COLORS[i % COLORS.length],
    emoji: EMOJIS[i % EMOJIS.length],
    isVip: i < 3,
    delay: (i * 0.15) % 1.5,
  }));
}

export default function PartyRoomPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [inputMsg, setInputMsg] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: string; emoji: string; x: number }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const avatars = useRef(generateAvatars());
  const msgIdRef = useRef(100);

  // Auto-append messages
  useEffect(() => {
    const interval = setInterval(() => {
      const m = NEW_MESSAGES[Math.floor(Math.random() * NEW_MESSAGES.length)];
      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
      setMessages(prev => [
        ...prev.slice(-30),
        { id: `auto${msgIdRef.current++}`, username: m.username, message: m.message, time: timeStr, color: m.color },
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputMsg.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages(prev => [
      ...prev,
      { id: `user${msgIdRef.current++}`, username: 'You', message: inputMsg, time: timeStr, color: '#06b6d4' },
    ]);
    setInputMsg('');
  };

  const sendEmoji = (emoji: string) => {
    const id = `fe${Date.now()}`;
    const x = Math.random() * 80 + 10;
    setFloatingEmojis(prev => [...prev, { id, emoji, x }]);
    setTimeout(() => setFloatingEmojis(prev => prev.filter(e => e.id !== id)), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <style jsx global>{`
        @keyframes bounce-avatar {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.08); }
        }
        @keyframes float-emoji {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-180px) scale(1.6); }
        }
        @keyframes eq-bar {
          0%, 100% { height: 8px; }
          50% { height: 28px; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.3); }
          50% { box-shadow: 0 0 50px rgba(139,92,246,0.8); }
        }
      `}</style>

      {/* Floating emojis */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {floatingEmojis.map(fe => (
          <div
            key={fe.id}
            className="absolute text-3xl"
            style={{
              left: `${fe.x}%`,
              bottom: '80px',
              animation: 'float-emoji 2.5s ease-out forwards',
            }}
          >
            {fe.emoji}
          </div>
        ))}
      </div>

      {/* Hero / Dance Floor Area */}
      <div
        className="relative"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #0c4a6e 60%, #0f172a 100%)',
          minHeight: '100vh',
        }}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-sm">
          <Link href="/" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-6 text-xs">
            {[
              { label: 'Active', value: '247', color: 'text-green-400' },
              { label: 'Dancing', value: '89', color: 'text-purple-400' },
              { label: 'Chatting', value: '134', color: 'text-blue-400' },
              { label: 'Watching', value: '24', color: 'text-slate-400' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>
                <p className="text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
            FREE TO JOIN
          </span>
        </div>

        <div className="flex h-[calc(100vh-64px)]">
          {/* Main Dance Floor */}
          <div className="flex-1 flex flex-col px-8 py-6 overflow-y-auto">
            {/* Title */}
            <div className="text-center mb-6">
              <h1
                className="text-5xl font-black tracking-widest uppercase"
                style={{
                  background: 'linear-gradient(90deg, #c084fc, #60a5fa, #34d399, #c084fc)',
                  backgroundSize: '200%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 3s linear infinite',
                }}
              >
                THE PARTY ROOM
              </h1>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400" style={{ animation: 'eq-bar 0.8s ease-in-out infinite' }} />
                <span className="text-slate-300 text-sm font-medium">247 users online</span>
              </div>
            </div>

            {/* DJ Section */}
            <div className="bg-white/5 border border-purple-500/30 rounded-xl p-4 mb-6" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <Music size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-400 font-semibold uppercase tracking-widest">NOW PLAYING</p>
                    <p className="text-white font-bold">Neon Nights</p>
                    <p className="text-slate-400 text-sm">DJ MetaWorld</p>
                  </div>
                </div>
                {/* Equalizer bars */}
                <div className="flex items-end space-x-1 h-8">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-purple-600 to-cyan-400 rounded-sm"
                      style={{
                        animation: `eq-bar ${0.4 + (i % 4) * 0.15}s ease-in-out infinite`,
                        animationDelay: `${i * 0.07}s`,
                        height: `${8 + Math.random() * 20}px`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Dance Floor Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-6">
              {avatars.current.map(av => (
                <div key={av.id} className="flex flex-col items-center">
                  <div
                    className="relative w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: av.color,
                      animation: `bounce-avatar ${1.0 + av.delay}s ease-in-out infinite`,
                      animationDelay: `${av.delay}s`,
                    }}
                  >
                    {av.initials}
                    {av.isVip && (
                      <Crown size={12} className="absolute -top-1.5 -right-1.5 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 text-center leading-tight max-w-[48px] truncate">{av.username}</span>
                  <span className="text-[10px]">{av.emoji}</span>
                </div>
              ))}
            </div>

            {/* Emoji Reactions */}
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-3 font-medium">REACT</p>
              <div className="flex items-center space-x-3">
                {['🎉', '🔥', '💎', '🚀', '👑', '💃', '🕺', '✨'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => sendEmoji(emoji)}
                    className="text-2xl hover:scale-150 transition-transform active:scale-90 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Zap size={16} className="text-yellow-400" />
                <h3 className="text-white font-bold">Upcoming Events</h3>
              </div>
              <div className="space-y-3">
                {EVENTS.map((ev, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div>
                      <p className="text-white text-sm font-medium">{ev.name}</p>
                      <p className="text-slate-400 text-xs">{ev.date}</p>
                    </div>
                    <span className={`px-2 py-0.5 ${ev.badge} rounded text-white text-xs font-bold`}>
                      {ev.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Chat Sidebar */}
          <div className="w-80 flex flex-col border-l border-white/10 bg-black/30 backdrop-blur-sm">
            <div className="px-4 py-3 border-b border-white/10">
              <h3 className="text-white font-bold text-sm">🟢 Live Chat</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
              {messages.map(msg => (
                <div key={msg.id} className="">
                  <span className="text-[10px] text-slate-500">{msg.time} </span>
                  <span className="text-xs font-bold" style={{ color: msg.color }}>{msg.username}: </span>
                  <span className="text-slate-300 text-xs">{msg.message}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Emoji quick row */}
            <div className="px-3 py-2 border-t border-white/10 flex space-x-2">
              {['🎉', '🔥', '💎', '🚀', '👑'].map(e => (
                <button
                  key={e}
                  onClick={() => {
                    sendEmoji(e);
                    const now = new Date();
                    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
                    setMessages(prev => [
                      ...prev,
                      { id: `eq${msgIdRef.current++}`, username: 'You', message: e, time: timeStr, color: '#06b6d4' },
                    ]);
                  }}
                  className="text-lg hover:scale-125 transition-transform"
                >
                  {e}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/10 flex space-x-2">
              <input
                type="text"
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Say something..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <Send size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}
