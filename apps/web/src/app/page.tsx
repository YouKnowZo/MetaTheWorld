'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Zap, Trophy, ArrowRight, Globe, Layers, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 animate-slow-zoom bg-hero-pattern"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black" />
          
          {/* Glowing Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-cyan-400 font-mono tracking-widest uppercase text-sm mb-4">
              The Next Evolution of Digital Ownership
            </h2>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
              META <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">THE WORLD</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              A hyper-realistic digital twin metaverse where you can own virtual land, build empires, and experience the future of blockchain integration.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-black font-bold rounded-full flex items-center gap-2 group transition-all hover:bg-cyan-400 hover:text-black shadow-[0_0_20px_rgba(34,211,238,0.3)]"
                >
                  Enter Metaverse
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <Link href="#features">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-slate-900 text-white font-bold rounded-full border border-slate-800 hover:border-slate-600 transition-all"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-slate-500 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative z-10 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-3xl md:text-5xl font-bold mb-4">Master Your Digital Destiny</h3>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Everything you need to succeed in the paperbagexpress ecosystem, built on high-performance blockchain tech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Globe className="text-cyan-400" />}
              title="Global Real Estate"
              description="Own exact 1:1 digital twins of real-world locations. From Paris to NYC, the world is your canvas."
            />
            <FeatureCard 
              icon={<Layers className="text-blue-500" />}
              title="Building Engine"
              description="Construct massive structures, luxury apartments, or business hubs on your parcels with our intuitive tools."
            />
            <FeatureCard 
              icon={<Zap className="text-yellow-400" />}
              title="Instant Liquidity"
              description="Trade your assets instantly on the marketplace with low fees and near-zero latency."
            />
            <FeatureCard 
              icon={<Shield className="text-purple-500" />}
              title="Secured by Polygon"
              description="Your ownership is immutable and secured by world-class cryptographic proofs."
            />
            <FeatureCard 
              icon={<Trophy className="text-emerald-400" />}
              title="VIP Rewards"
              description="Join the elite Diamond District and earn passive income from your developed properties."
            />
            <FeatureCard 
              icon={<Users className="text-orange-400" />}
              title="Social Hubs"
              description="Host parties, meet other explorers, and build communities in our high-fidelity social spaces."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              META THE WORLD
            </h2>
            <p className="text-slate-500 text-sm mt-2">© 2026 Meta World Foundation. All rights reserved.</p>
          </div>
          
          <div className="flex gap-8 text-slate-400 text-sm">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
            <Link href="https://github.com/YouKnowZo" className="hover:text-white transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 transition-all group"
    >
      <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
