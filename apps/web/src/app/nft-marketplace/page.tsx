'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Store, X, Loader2, Filter, SortAsc, ExternalLink } from 'lucide-react';

type NFTType = 'LAND' | 'VEHICLE' | 'WEARABLE' | 'BUILDING';
type FilterType = 'ALL' | NFTType;
type SortType = 'price_asc' | 'price_desc' | 'recent' | 'rarest';

const filterOptions: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Land', value: 'LAND' },
  { label: 'Vehicle', value: 'VEHICLE' },
  { label: 'Wearable', value: 'WEARABLE' },
  { label: 'Building', value: 'BUILDING' },
];

const sortOptions: { label: string; value: SortType }[] = [
  { label: 'Recently Listed', value: 'recent' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rarest', value: 'rarest' },
];

const CURRENT_USER_ADDRESS = '0xA3f2...8B1c'; // Mock current user address

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
  status: 'listed' | 'owned' | 'sold'; // Added status field
}

interface ActivityItem {
  id: string;
  nftName: string;
  price: number;
  from: string;
  to: string;
  time: string;
}

const MOCK_NFTS: NFTItem[] = [
  { id: '1', name: 'Paris District #0042', type: 'LAND', price: 0.42, usdPrice: 1260, owner: '0xA3f2...8B1c', rare: true, gradient: 'from-blue-600 to-cyan-400', tokenId: '42', status: 'listed' },
  { id: '2', name: 'Tokyo Land #1337', type: 'LAND', price: 1.05, usdPrice: 3150, owner: '0xF9e1...2D4a', rare: true, gradient: 'from-pink-600 to-purple-400', tokenId: '1337', status: 'listed' },
  { id: '3', name: 'Cyber Cruiser #007', type: 'VEHICLE', price: 0.18, usdPrice: 540, owner: CURRENT_USER_ADDRESS, rare: false, gradient: 'from-green-600 to-teal-400', tokenId: '7', status: 'owned' },
  { id: '4', name: 'NYC Block #2048', type: 'LAND', price: 2.75, usdPrice: 8250, owner: '0x1A4d...5F7e', rare: true, gradient: 'from-orange-500 to-red-400', tokenId: '2048', status: 'listed' },
  { id: '5', name: 'Neon Jacket #099', type: 'WEARABLE', price: 0.08, usdPrice: 240, owner: CURRENT_USER_ADDRESS, rare: false, gradient: 'from-violet-600 to-indigo-400', tokenId: '99', status: 'owned' },
  { id: '6', name: 'Dubai Tower #512', type: 'BUILDING', price: 5.00, usdPrice: 15000, owner: '0x4E9f...7C1b', rare: true, gradient: 'from-yellow-500 to-orange-400', tokenId: '512', status: 'listed' },
  { id: '7', name: 'Moto Phantom #303', type: 'VEHICLE', price: 0.35, usdPrice: 1050, owner: '0x2D7a...4B8c', rare: false, gradient: 'from-slate-500 to-blue-600', tokenId: '303', status: 'listed' },
  { id: '8', name: 'London Square #777', type: 'LAND', price: 0.95, usdPrice: 2850, owner: '0x6F1e...9D3a', rare: false, gradient: 'from-rose-500 to-pink-400', tokenId: '777', status: 'listed' },
];

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'a1', nftName: 'Sydney Harbor #101', price: 0.82, from: '0xAb3f...1C2d', to: '0x9E4b...7F3a', time: '2 min ago' },
  { id: 'a2', nftName: 'Cyber SUV #444', price: 0.22, from: '0x3C1e...5D9f', to: '0x7B2a...4E6c', time: '15 min ago' },
  { id: 'a3', nftName: 'Berlin Plaza #55', price: 1.40, from: '0x5F8d...2A1b', to: '0x1D3c...8B7e', time: '1 hr ago' },
  { id: 'a4', nftName: 'Chrome Armor #12', price: 0.09, from: '0x8E2b...6C4f', to: '0x4A7d...3F1c', time: '3 hrs ago' },
  { id: 'a5', nftName: 'Rome Colosseum #1', price: 8.50, from: '0x2B6a...9D5e', to: '0x6C4f...1A3b', time: '6 hrs ago' },
];

const TYPE_COLORS: Record<NFTType, string> = {
  LAND: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  VEHICLE: 'bg-green-500/20 text-green-400 border border-green-500/30',
  WEARABLE: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  BUILDING: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
};

function BuyNowModal({ nft, onClose, onBuy }: { nft: NFTItem; onClose: () => void; onBuy: (id: string) => void }) {
  const [buying, setBuying] = useState(false);
  const [bought, setBought] = useState(false);

  const handleBuy = async () => {
    setBuying(true);
    await new Promise(r => setTimeout(r, 2000));
    // In a real application, this would interact with the NFTMarketplace smart contract
    // e.g., await nftMarketplaceContract.buyNFT(nft.id);
    setBuying(false);
    setBought(true);
    onBuy(nft.id);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Complete Purchase</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {bought ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-green-400 text-lg font-bold">NFT Purchased Successfully!</p>
            <p className="text-slate-400 text-sm mt-2">{nft.name} is now in your wallet.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`h-44 rounded-xl bg-gradient-to-br ${nft.gradient} relative`}>
              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/40 backdrop-blur-sm rounded text-white text-[10px] font-mono">
                #{nft.tokenId}
              </span>
            </div>
            <h3 className="text-white text-lg font-semibold">{nft.name}</h3>
            <p className="text-slate-400 text-sm">Owner: {nft.owner}</p>
            <div className="flex justify-between items-center bg-slate-800/60 rounded-lg p-3">
              <div>
                <p className="text-slate-400 text-sm">Price</p>
                <p className="text-white font-bold text-xl">{nft.price} ETH</p>
                <p className="text-slate-400 text-xs">~${nft.usdPrice.toLocaleString()}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${TYPE_COLORS[nft.type]}`}>
                {nft.type}
              </span>
            </div>
            <button
              onClick={handleBuy}
              disabled={buying}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {buying ? (
                <><Loader2 size={18} className="animate-spin" /><span>Processing...</span></>
              ) : (
                <span>Buy Now for {nft.price} ETH</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MintModal({ onClose, onMint }: { onClose: () => void; onMint: (nft: NFTItem) => void }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<NFTType>('LAND');
  const [price, setPrice] = useState('');
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);

  const handleMint = async () => {
    setMinting(true);
    await new Promise(r => setTimeout(r, 2500));
    const newNFT: NFTItem = {
      id: String(MOCK_NFTS.length + 1), // Simple ID generation
      name,
      type,
      price: parseFloat(price),
      usdPrice: parseFloat(price) * 3000, // Mock conversion
      owner: CURRENT_USER_ADDRESS,
      rare: Math.random() > 0.8, // Random rarity
      gradient: 'from-purple-500 to-indigo-400', // Default gradient for new mints
      tokenId: String(Math.floor(Math.random() * 100000)),
      status: 'owned', // Newly minted NFTs are owned
    };
    onMint(newNFT);
    setMinting(false);
    setMinted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Mint New NFT</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {minted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-green-400 text-lg font-bold">NFT Minted Successfully!</p>
            <p className="text-slate-400 text-sm mt-2">{name} has been added to your wallet.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">NFT Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Paris District #9999"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as NFTType)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="LAND">Land</option>
                <option value="VEHICLE">Vehicle</option>
                <option value="WEARABLE">Wearable</option>
                <option value="BUILDING">Building</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Listing Price (ETH)</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="bg-slate-800 rounded-lg p-3 text-sm text-slate-400">
              <p>Minting fee: <span className="text-yellow-400 font-mono">0.05 ETH</span></p>
              <p className="text-xs mt-1">This covers gas costs and platform registration.</p>
            </div>
            <button
              onClick={handleMint}
              disabled={minting || !name || !price}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {minting ? (
                <><Loader2 size={18} className="animate-spin" /><span>Minting...</span></>
              ) : (
                <span>Mint for 0.05 ETH</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ListNFTModal({ nft, onClose, onList }: { nft: NFTItem; onClose: () => void; onList: (id: string, price: number) => void }) {
  const [listPrice, setListPrice] = useState(nft.price.toString());
  const [listing, setListing] = useState(false);
  const [listed, setListed] = useState(false);

  const handleList = async () => {
    setListing(true);
    await new Promise(r => setTimeout(r, 1500));
    onList(nft.id, parseFloat(listPrice));
    setListing(false);
    setListed(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">List NFT for Sale</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {listed ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-green-400 text-lg font-bold">NFT Listed Successfully!</p>
            <p className="text-slate-400 text-sm mt-2">{nft.name} is now available on the marketplace.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`h-44 rounded-xl bg-gradient-to-br ${nft.gradient} relative`}>
              <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/40 backdrop-blur-sm rounded text-white text-[10px] font-mono">
                #{nft.tokenId}
              </span>
            </div>
            <h3 className="text-white text-lg font-semibold">{nft.name}</h3>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Listing Price (ETH)</label>
              <input
                type="number"
                value={listPrice}
                onChange={e => setListPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              onClick={handleList}
              disabled={listing || !listPrice || parseFloat(listPrice) <= 0}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {listing ? (
                <><Loader2 size={18} className="animate-spin" /><span>Listing...</span></>
              ) : (
                <span>List for {listPrice} ETH</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DelistNFTModal({ nft, onClose, onDelist }: { nft: NFTItem; onClose: () => void; onDelist: (id: string) => void }) {
  const [delisting, setDelisting] = useState(false);
  const [delisted, setDelisted] = useState(false);

  const handleDelist = async () => {
    setDelisting(true);
    await new Promise(r => setTimeout(r, 1500));
    onDelist(nft.id);
    setDelisting(false);
    setDelisted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Delist NFT</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {delisted ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🗑️</div>
            <p className="text-green-400 text-lg font-bold">NFT Delisted Successfully!</p>
            <p className="text-slate-400 text-sm mt-2">{nft.name} has been removed from the marketplace.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-white text-center">Are you sure you want to delist <span className="font-semibold">{nft.name}</span>?</p>
            <p className="text-slate-400 text-sm text-center">This will remove your NFT from the marketplace. You can always list it again later.</p>
            <button
              onClick={handleDelist}
              disabled={delisting}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {delisting ? (
                <><Loader2 size={18} className="animate-spin" /><span>Delisting...</span></>
              ) : (
                <span>Confirm Delist</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NFTMarketplacePage() {
  const [activeTab, setActiveTab] = useState<'browse' | 'listings' | 'activity'>('browse');
  const [filterType, setFilterType] = useState<FilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [showMintModal, setShowMintModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [nfts, setNfts] = useState<NFTItem[]>(MOCK_NFTS);
  const [showListModal, setShowListModal] = useState(false);
  const [showDelistModal, setShowDelistModal] = useState(false);

  const handleBuyNFT = (id: string) => {
    setNfts(prevNfts =>
      prevNfts.map(nft =>
        nft.id === id ? { ...nft, owner: CURRENT_USER_ADDRESS, status: 'owned' } : nft
      )
    );
    setShowBuyModal(false);
  };

  const handleMintNFT = (newNFT: NFTItem) => {
    setNfts(prevNfts => [...prevNfts, newNFT]);
    setShowMintModal(false);
  };

  const handleListNFT = (id: string, price: number) => {
    setNfts(prevNfts =>
      prevNfts.map(nft =>
        nft.id === id ? { ...nft, price, status: 'listed' } : nft
      )
    );
    setShowListModal(false);
  };

  const handleDelistNFT = (id: string) => {
    setNfts(prevNfts =>
      prevNfts.map(nft =>
        nft.id === id ? { ...nft, status: 'owned' } : nft
      )
    );
    setShowDelistModal(false);
  };

  const filteredNFTs = nfts
    .filter(nft => filterType === 'ALL' || nft.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rarest') return (b.rare ? 1 : 0) - (a.rare ? 1 : 0);
      return 0;
    });

  const myListedNFTs = nfts.filter(nft => nft.owner === CURRENT_USER_ADDRESS && nft.status === 'listed');
  const myOwnedNFTs = nfts.filter(nft => nft.owner === CURRENT_USER_ADDRESS && nft.status === 'owned');

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <Store size={28} className="text-blue-400" />
                <h1 className="text-2xl font-bold text-white">NFT Marketplace</h1>
              </div>
              <p className="text-slate-400 text-sm mt-1">Trade land, vehicles, wearables and buildings</p>
            </div>
            <button
              onClick={() => setShowMintModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity text-sm"
            >
              + Mint New NFT
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 mt-4">
            {[
              { label: 'Total Volume', value: '4,521 ETH' },
              { label: 'Listed', value: String(nfts.filter(nft => nft.status === 'listed').length) },
              { label: 'Owners', value: '341' },
              { label: 'Platform Fee', value: '2.5%' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center space-x-2">
                <span className="text-slate-500 text-xs">{stat.label}:</span>
                <span className="text-white text-xs font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Tabs */}
          <div className="flex space-x-1 bg-slate-900 rounded-lg p-1 w-fit mb-6">
            {(['browse', 'listings', 'activity'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'listings' ? 'My Listings' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'browse' && (
            <>
              {/* Filters and Sort */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                  <Filter size={16} className="text-slate-400" />
                  {filterOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFilterType(opt.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        filterType === opt.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <SortAsc size={16} className="text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as SortType)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* NFT Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredNFTs.map(nft => (
                  <div
                    key={nft.id}
                    className={`bg-slate-900 rounded-xl overflow-hidden border transition-all hover:scale-[1.02] ${
                      nft.rare
                        ? 'border-yellow-500/50 shadow-yellow-500/10 shadow-lg'
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {/* Image placeholder */}
                    <div className={`h-44 bg-gradient-to-br ${nft.gradient} relative`}>
                      {nft.rare && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-500 text-black text-[10px] font-black rounded tracking-wider">
                          RARE
                        </span>
                      )}
                      <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/40 backdrop-blur-sm rounded text-white text-[10px] font-mono">
                        #{nft.tokenId}
                      </span>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white text-sm font-semibold leading-tight">{nft.name}</h3>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ml-2 shrink-0 ${TYPE_COLORS[nft.type]}`}>
                          {nft.type}
                        </span>
                      </div>

                      <p className="text-slate-500 text-xs mb-3">Owner: {nft.owner}</p>

                      <div className="mb-4">
                        <p className="text-white font-bold text-lg">{nft.price} ETH</p>
                        <p className="text-slate-400 text-xs">~${nft.usdPrice.toLocaleString()}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => { setSelectedNFT(nft); setShowBuyModal(true); }}
                          disabled={nft.owner === CURRENT_USER_ADDRESS || nft.status === 'owned'}
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {nft.owner === CURRENT_USER_ADDRESS || nft.status === 'owned' ? 'Owned' : 'Buy Now'}
                        </button>
                        <button className="flex-1 py-2 border border-slate-600 hover:border-slate-400 rounded-lg text-slate-300 text-xs font-semibold transition-colors">
                          Make Offer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-center text-slate-500 text-xs mt-8">
                2.5% platform fee on all sales • Royalties automatically distributed via EIP-2981
              </p>
            </>
          )}

          {activeTab === 'listings' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">My Listed NFTs ({myListedNFTs.length})</h2>
              {myListedNFTs.length === 0 ? (
                <div className="text-center py-10">
                  <Store size={48} className="text-slate-600 mx-auto mb-4" />
                  <h3 className="text-slate-400 text-lg font-medium">No NFTs Listed for Sale</h3>
                  <p className="text-slate-500 text-sm mt-2">Mint new NFTs or list your owned NFTs here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {myListedNFTs.map(nft => (
                    <div key={nft.id} className="bg-slate-900 rounded-xl overflow-hidden border border-blue-500 hover:border-blue-400 transition-all">
                      <div className={`h-44 bg-gradient-to-br ${nft.gradient} relative`}>
                        <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/40 backdrop-blur-sm rounded text-white text-[10px] font-mono">
                          #{nft.tokenId}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white text-sm font-semibold leading-tight mb-1">{nft.name}</h3>
                        <p className="text-slate-500 text-xs mb-3">Status: Listed</p>
                        <p className="text-white font-bold text-lg">{nft.price} ETH</p>
                        <button
                          onClick={() => { setSelectedNFT(nft); setShowDelistModal(true); }}
                          className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-xs font-semibold transition-colors"
                        >
                          Delist
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h2 className="text-xl font-bold text-white mt-8 mb-4">My Owned NFTs ({myOwnedNFTs.length})</h2>
              {myOwnedNFTs.length === 0 ? (
                <div className="text-center py-10">
                  <Store size={48} className="text-slate-600 mx-auto mb-4" />
                  <h3 className="text-slate-400 text-lg font-medium">No Owned NFTs</h3>
                  <p className="text-slate-500 text-sm mt-2">Mint new NFTs to see them appear here.</p>
                  <button
                    onClick={() => setShowMintModal(true)}
                    className="mt-6 px-6 py-2.5 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors text-sm"
                  >
                    Mint Your First NFT
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {myOwnedNFTs.map(nft => (
                    <div key={nft.id} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-500 transition-all">
                      <div className={`h-44 bg-gradient-to-br ${nft.gradient} relative`}>
                        <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/40 backdrop-blur-sm rounded text-white text-[10px] font-mono">
                          #{nft.tokenId}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white text-sm font-semibold leading-tight mb-1">{nft.name}</h3>
                        <p className="text-slate-500 text-xs mb-3">Status: Owned</p>
                        <button
                          onClick={() => { setSelectedNFT(nft); setShowListModal(true); }}
                          className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-xs font-semibold transition-colors"
                        >
                          List for Sale
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800">
                <h3 className="text-white font-semibold">Recent Sales Activity</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      {['NFT Name', 'Price', 'From', 'To', 'Time'].map(col => (
                        <th key={col} className="text-left px-6 py-3 text-slate-400 text-xs font-medium uppercase tracking-wide">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ACTIVITY.map((item, i) => (
                      <tr key={item.id} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${
                        i % 2 === 0 ? '' : 'bg-slate-800/10'
                      }`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <ExternalLink size={12} className="text-slate-500" />
                            <span className="text-white text-sm font-medium">{item.nftName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-green-400 font-mono text-sm">{item.price} ETH</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-400 text-xs font-mono">{item.from}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-400 text-xs font-mono">{item.to}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-500 text-xs">{item.time}</span>
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

      {showMintModal && <MintModal onClose={() => setShowMintModal(false)} onMint={handleMintNFT} />}
      {showBuyModal && selectedNFT && <BuyNowModal nft={selectedNFT} onClose={() => setShowBuyModal(false)} onBuy={handleBuyNFT} />}
      {showListModal && selectedNFT && <ListNFTModal nft={selectedNFT} onClose={() => setShowListModal(false)} onList={handleListNFT} />}
      {showDelistModal && selectedNFT && <DelistNFTModal nft={selectedNFT} onClose={() => setShowDelistModal(false)} onDelist={handleDelistNFT} />}
    </div>
  );
}
