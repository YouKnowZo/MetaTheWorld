<<<<<<< HEAD
import { Sidebar } from "@/components/dashboard/sidebar";
import { MapViewer } from "@/components/map/map-viewer";

export default function Home() {
  return (
    <main className="flex h-screen overflow-hidden bg-black">
      <Sidebar />
      <div className="flex-1 relative">
        <MapViewer />
        
        {/* Overlay for stats or search */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl text-white pointer-events-auto shadow-2xl">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Region</h2>
            <p className="text-xl font-semibold">Paris, France</p>
            <div className="mt-2 flex space-x-4 text-xs text-slate-400">
              <div>
                <span className="block text-white font-medium">1,240</span>
                Parcels
              </div>
              <div>
                <span className="block text-white font-medium">458</span>
                Owners
              </div>
              <div>
                <span className="block text-white font-medium">1.2 ETH</span>
                Floor
              </div>
            </div>
          </div>
        </div>
      </div>
=======
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  useAccount, useConnect, useDisconnect, useBalance,
  useWriteContract, useReadContract, useSimulateContract
} from "wagmi";
import { parseEther, formatEther } from "viem";
import Link from "next/link";
import { 
  Map, Gem, Car, Wallet, ChevronRight, Globe, 
  TrendingUp, Shield, Zap, Users, ArrowRight, Sparkles
} from "lucide-react";
import { CryptoPriceTicker } from "@/components/dashboard/crypto-ticker";

// Real Contract ABIs - simplified for actual interactions
const LAND_REGISTRY_ABI = [
  {
    "inputs": [{"internalType": "string","name": "tier","type": "string"}],
    "name": "mintPrice",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address","name": "to","type": "address"},
      {"internalType": "string","name": "parcelId","type": "string"},
      {"internalType": "string","name": "metadataCid","type": "string"}
    ],
    "name": "mint",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  }
] as const;

const MTW_TOKEN_ABI = [
  {
    "inputs": [{"internalType": "address","name": "account","type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Polygon mainnet contract addresses (placeholder - user needs real addresses)
const CONTRACTS = {
  landRegistry: "0x0000000000000000000000000000000000000000", // Deploy and update
  nftMarketplace: "0x0000000000000000000000000000000000000000",
  mtwToken: "0x0000000000000000000000000000000000000000",
  vehicleRegistry: "0x0000000000000000000000000000000000000000"
};

// Land tiers with real pricing
const LAND_TIERS = [
  { id: "PLOT", name: "Plot", price: "0.01", size: "100x100m", rarity: "Common" },
  { id: "DISTRICT", name: "District", price: "0.1", size: "500x500m", rarity: "Rare" },
  { id: "REGION", name: "Region", price: "1", size: "2x2km", rarity: "Epic" },
  { id: "TERRITORY", name: "Territory", price: "10", size: "10x10km", rarity: "Legendary" }
];

// Animated counter hook
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      countRef.current = Math.floor(end * easeOut);
      setCount(countRef.current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

// Particle background component
function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${10 + Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  );
}

// Featured NFT Card with real data
function FeaturedLandCard({ tier, index }: { tier: typeof LAND_TIERS[0]; index: number }) {
  const { address } = useAccount();
  const [isHovered, setIsHovered] = useState(false);
  
  // Real contract read for price
  const { data: currentPrice } = useReadContract({
    address: CONTRACTS.landRegistry,
    abi: LAND_REGISTRY_ABI,
    functionName: "mintPrice",
    args: [tier.id],
    query: { enabled: false } // Disabled until real contract is deployed
  });

  // Mint function
  const { writeContract: mint, isPending: isMinting } = useWriteContract();

  const handleMint = () => {
    if (!address) return;
    // Will work once contract is deployed and address updated
    mint({
      address: CONTRACTS.landRegistry,
      abi: LAND_REGISTRY_ABI,
      functionName: "mint",
      args: [address, `${tier.id}-${Date.now()}`, "QmPlaceholder"],
      value: parseEther(tier.price)
    });
  };

  const rarityColors: Record<string, string> = {
    Common: "#9ca3af",
    Rare: "#60a5fa",
    Epic: "#a855f7",
    Legendary: "#fbbf24"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="glass-card p-6 relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${isHovered ? 'var(--mouse-x, 50%) var(--mouse-y, 50%)' : '50% 50%'}, ${rarityColors[tier.rarity]}20 0%, transparent 50%)`
        }}
      />
      
      {/* Rarity badge */}
      <div 
        className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
        style={{ 
          color: rarityColors[tier.rarity],
          border: `1px solid ${rarityColors[tier.rarity]}40`,
          background: `${rarityColors[tier.rarity]}10`
        }}
      >
        {tier.rarity}
      </div>

      {/* Land preview */}
      <div className="land-parcel mb-4 flex items-center justify-center">
        <span className="text-4xl font-bold" style={{ color: rarityColors[tier.rarity] }}>
          {tier.name[0]}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-2 font-orbitron">{tier.name}</h3>
      <p className="text-slate-400 text-sm mb-4">{tier.size} virtual land</p>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold text-white">{tier.price} ETH</span>
        <span className="text-slate-500 text-sm">≈ ${(parseFloat(tier.price) * 2000).toLocaleString()}</span>
      </div>

      <button 
        onClick={handleMint}
        disabled={!address || isMinting}
        className="cyber-btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isMinting ? "Minting..." : address ? "Mint Now" : "Connect Wallet"}
      </button>
    </motion.div>
  );
}

// Stats section with animated counters
function StatsSection() {
  const parcelsSold = useCountUp(12543);
  const totalValue = useCountUp(8420);
  const activeUsers = useCountUp(8920);
  const itemsTraded = useCountUp(45600);

  const stats = [
    { label: "Parcels Sold", value: parcelsSold, suffix: "+", icon: Map },
    { label: "Total Value Locked", value: totalValue, suffix: " ETH", icon: TrendingUp },
    { label: "Active Users", value: activeUsers, suffix: "+", icon: Users },
    { label: "Items Traded", value: itemsTraded, suffix: "+", icon: Zap }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-12">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="text-center"
        >
          <div className="flex justify-center mb-3">
            <stat.icon className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="stat-value text-4xl md:text-5xl font-bold mb-2">
            {stat.value.toLocaleString()}{stat.suffix}
          </div>
          <div className="text-slate-400 text-sm">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

// Feature cards
const features = [
  {
    icon: Map,
    title: "Virtual Land",
    desc: "Own, develop, and monetize 1:1 scale digital real estate",
    link: "/inventory"
  },
  {
    icon: Gem,
    title: "NFT Marketplace",
    desc: "Buy, sell, and trade unique digital assets",
    link: "/nft-marketplace"
  },
  {
    icon: Car,
    title: "Vehicles",
    desc: "Collect and customize exclusive digital vehicles",
    link: "/dealership"
  },
  {
    icon: Shield,
    title: "Governance",
    desc: "Vote on proposals and shape the metaverse",
    link: "#governance"
  }
];

// Main component
export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { scrollY } = useScroll();
  
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // Real ETH balance
  const { data: ethBalance } = useBalance({ address });

  // MTW token balance (will work once contract deployed)
  const { data: mtwBalance } = useReadContract({
    address: CONTRACTS.mtwToken,
    abi: MTW_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: false }
  });

  return (
    <main className="relative min-h-screen">
      {/* Background effects */}
      <ParticleBackground />
      <div className="metaverse-bg" />
      <div className="grid-overlay" />
      
      {/* Crypto ticker */}
      <CryptoPriceTicker />

      {/* Hero Section */}
      <motion.section 
        style={{ y: heroY, opacity, scale }}
        className="relative min-h-screen flex items-center justify-center px-4 pt-20"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-cyan-400 text-sm font-medium">Live on Polygon</span>
            </motion.div>

            {/* Main title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="block glitch" data-text="META THE WORLD">
                <span className="neon-text">META THE WORLD</span>
              </span>
              <span className="block text-2xl md:text-3xl text-slate-400 mt-4 font-rajdhani">
                The 1:1 Digital Twin of Earth
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              Own virtual land, trade NFTs, and build your empire in the world's most 
              immersive blockchain metaverse. Every parcel is a real crypto asset.
            </p>

            {/* Wallet connection */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              {!isConnected ? (
                <>
                  {connectors.map((connector) => (
                    <button
                      key={connector.uid}
                      onClick={() => connect({ connector })}
                      className="cyber-btn-primary cyber-btn group"
                    >
                      <Wallet className="inline w-5 h-5 mr-2" />
                      Connect {connector.name}
                    </button>
                  ))}
                </>
              ) : (
                <div className="glass-card p-4 flex items-center gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Connected</p>
                    <p className="font-mono text-sm">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>
                  <div className="border-l border-slate-700 pl-4">
                    <p className="text-xs text-slate-400">Balance</p>
                    <p className="text-cyan-400 font-bold">
                      {ethBalance ? parseFloat(formatEther(ethBalance.value)).toFixed(4) : "0"} ETH
                    </p>
                  </div>
                  <button 
                    onClick={() => disconnect()}
                    className="cyber-btn text-xs py-2 px-4"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>

            {/* Live stats */}
            <StatsSection />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-cyan-400/30 rounded-full flex justify-center pt-2">
            <motion.div 
              animate={{ opacity: [1, 0], y: [0, 12] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Explore The Metaverse</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Discover endless possibilities across virtual real estate, 
              digital assets, and immersive experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={feature.link}>
                  <div className="glass-card p-6 h-full group hover:border-cyan-500/30 transition-all cursor-pointer">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-7 h-7 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      {feature.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Land Tiers */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">Land Tiers</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Own a piece of the metaverse. Each land tier offers unique benefits 
              and earning potential through staking, development, and rentals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LAND_TIERS.map((tier, index) => (
              <FeaturedLandCard key={tier.id} tier={tier} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
            
            <div className="relative z-10">
              <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Enter the Metaverse?
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Connect your wallet and start building your digital empire today. 
                Limited land parcels available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/inventory">
                  <button className="cyber-btn-primary cyber-btn">
                    Start Exploring
                    <ChevronRight className="inline w-4 h-4 ml-2" />
                  </button>
                </Link>
                <Link href="/nft-marketplace">
                  <button className="cyber-btn">
                    Browse Marketplace
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-orbitron font-bold text-xl mb-4">META THE WORLD</h3>
              <p className="text-slate-400 text-sm">
                by PaperBagExpress<br />
                The future of virtual real estate.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/inventory" className="hover:text-cyan-400 transition-colors">Land Map</Link></li>
                <li><Link href="/nft-marketplace" className="hover:text-cyan-400 transition-colors">Marketplace</Link></li>
                <li><Link href="/dealership" className="hover:text-cyan-400 transition-colors">Vehicles</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link></li>
                <li><Link href="/disclaimer" className="hover:text-cyan-400 transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-slate-500 text-sm">
            <p>© 2026 Meta The World by PaperBagExpress. All rights reserved.</p>
            <p className="mt-2 text-xs">
              Cryptocurrency and NFT investments carry significant risk. 
              This is not financial advice.
            </p>
          </div>
        </div>
      </footer>
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7
    </main>
  );
}
