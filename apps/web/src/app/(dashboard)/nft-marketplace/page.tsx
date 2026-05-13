'use client';

import React, { useState } from 'react';
import { Store, X, Loader2, Filter, SortAsc, ExternalLink, RefreshCw, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type NFTType = 'LAND' | 'VEHICLE' | 'WEARABLE' | 'BUILDING';
type FilterType = 'ALL' | NFTType;
type SortType = 'price_asc' | 'price_desc' | 'recent' | 'rarest';

interface NFTItem {
  id: string;
  name: string;
  type: NFTType;
  price: number;
  usdPrice: number;
  owner: string;
  rare: boolean;
  gradient: string;
  tokenId: string;
}

const MOCK_NFTS: NFTItem[] = [
  { id: '1', name: 'Paris District #0042', type: 'LAND', price: 0.42, usdPrice: 1260, owner: '0xA3f2...8B1c', rare: true, gradient: 'from-blue-600 to-cyan-400', tokenId: '42' },
  { id: '2', name: 'Tokyo Land #1337', type: 'LAND', price: 1.05, usdPrice: 3150, owner: '0xF9e1...2D4a', rare: true, gradient: 'from-pink-600 to-purple-400', tokenId: '1337' },
  { id: '3', name: 'Cyber Cruiser #007', type: 'VEHICLE', price: 0.18, usdPrice: 540, owner: '0x7C3b...9E2f', rare: false, gradient: 'from-green-600 to-teal-400', tokenId: '7' },
  { id: '4', name: 'NYC Block #2048', type: 'LAND', price: 2.75, usdPrice: 8250, owner: '0x1A4d...5F7e', rare: true, gradient: 'from-orange-500 to-red-400', tokenId: '2048' },
  { id: '5', name: 'Neon Jacket #099', type: 'WEARABLE', price: 0.08, usdPrice: 240, owner: '0x8B2c...3A6d', rare: false, gradient: 'from-violet-600 to-indigo-400', tokenId: '99' },
  { id: '6', name: 'Dubai Tower #512', type: 'BUILDING', price: 5.00, usdPrice: 15000, owner: '0x4E9f...7C1b', rare: true, gradient: 'from-yellow-500 to-orange-400', tokenId: '512' },
  { id: '7', name: 'Moto Phantom #303', type: 'VEHICLE', price: 0.35, usdPrice: 1050, owner: '0x2D7a...4B8c', rare: false, gradient: 'from-slate-500 to-blue-600', tokenId: '303' },
  { id: '8', name: 'London Square #777', type: 'LAND', price: 0.95, usdPrice: 2850, owner: '0x6F1e...9D3a', rare: false, gradient: 'from-rose-500 to-pink-400', tokenId: '777' },
];

const TYPE_COLORS: Record<NFTType, string> = {
  LAND: 'bg-blue-500/20 text-blue-400',
  VEHICLE: 'bg-green-500/20 text-green-400',
  WEARABLE: 'bg-purple-500/20 text-purple-400',
  BUILDING: 'bg-orange-500/20 text-orange-400',
};

function MintModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<NFTType>('LAND');
  const [price, setPrice] = useState('');
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);

  const handleMint = async () => {
    setMinting(true);
    await new Promise(r => setTimeout(r, 2500));
    setMinting(false);
    setMinted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white tracking-tight">Mint Asset</h2>
          <button onClick={onClose} aria-label="Close modal" className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {minted ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-6">✨</div>
            <p className="text-green-400 text-xl font-black tracking-tight">NFT Minted Successfully!</p>
            <p className="text-slate-400 text-sm mt-2">{name} has been added to your inventory.</p>
            <button onClick={onClose} className="mt-8 w-full py-4 bg-slate-800 rounded-2xl text-white font-bold hover:bg-slate-700 transition-all">
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Asset Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Genesis Land #001"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              <div>
                <label className="block text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Category</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as NFTType)}
                  aria-label="Select asset category"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
                >
                  <option value="LAND">Land Parcel</option>
                  <option value="VEHICLE">Cyber Vehicle</option>
                  <option value="WEARABLE">Digital Wearable</option>
                  <option value="BUILDING">Infrastructure</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Initial Listing (MTW)</label>
                <input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="100.00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>
            
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 text-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-400">Minting Fee</span>
                <span className="text-white font-bold">10 MTW</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Gas + Registration Fee</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMint}
              disabled={minting || !name || !price}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 rounded-2xl text-white font-black text-lg transition-all shadow-xl shadow-blue-500/20"
            >
              {minting ? <RefreshCw className="animate-spin mx-auto" /> : `Create NFT`}
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function NFTMarketplacePage() {
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [showMintModal, setShowMintModal] = useState(false);

  const filteredNFTs = MOCK_NFTS
    .filter(nft => filterType === 'ALL' || nft.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rarest') return (b.rare ? 1 : 0) - (a.rare ? 1 : 0);
      return 0;
    });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <Store className="text-cyan-400 w-10 h-10" />
            Marketplace
          </h1>
          <p className="text-slate-400 mt-1">Discover, collect, and trade digital assets.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMintModal(true)}
          className="px-6 py-3 bg-white text-black font-black rounded-2xl flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-cyan-400 transition-all"
        >
          <Plus size={20} />
          List Asset
        </motion.button>
      </header>

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/40 p-2 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-2 p-2 overflow-x-auto no-scrollbar">
          {(['ALL', 'LAND', 'VEHICLE', 'WEARABLE', 'BUILDING'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filterType === type ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 px-4">
          <SortAsc size={18} className="text-slate-500" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortType)}
            aria-label="Sort assets"
            className="bg-transparent text-white text-xs font-black uppercase tracking-widest focus:outline-none"
          >
            <option value="recent">Recent</option>
            <option value="price_asc">Price: Low</option>
            <option value="price_desc">Price: High</option>
            <option value="rarest">Rarity</option>
          </select>
        </div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredNFTs.map((nft, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              key={nft.id}
              className={`glass rounded-3xl overflow-hidden border group transition-all ${
                nft.rare ? 'border-cyan-500/40 shadow-xl shadow-cyan-500/10' : 'border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className={`h-48 bg-gradient-to-br ${nft.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500" />
                <AnimatePresence>
                  {nft.rare && (
                    <motion.span 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute top-4 right-4 px-3 py-1 bg-cyan-500 text-black text-[10px] font-black rounded-full tracking-widest"
                    >
                      RARE
                    </motion.span>
                  )}
                </AnimatePresence>
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-mono border border-white/10">
                    ID #{nft.tokenId}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <div className={`text-[10px] font-black tracking-widest uppercase mb-1 ${TYPE_COLORS[nft.type].split(' ')[1]}`}>
                    {nft.type}
                  </div>
                  <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors leading-tight">{nft.name}</h3>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-white text-2xl font-black font-mono">{nft.price} <span className="text-xs uppercase">MTW</span></div>
                    <div className="text-slate-500 text-xs font-medium">~${nft.usdPrice.toLocaleString()}</div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-white transition-all"
                  >
                    <ExternalLink size={18} />
                  </motion.button>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-white hover:bg-cyan-400 text-black font-black text-sm rounded-2xl transition-all"
                >
                  Buy Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest pt-8 border-t border-slate-900">
        Platform Fee: 2.5% • Smart Contract: 0x...8B1c
      </p>

      {showMintModal && <MintModal onClose={() => setShowMintModal(false)} />}
    </div>
  );
}
