'use client';

import React, { useEffect, useState } from 'react';
import { fetchVehicles, buyVehicle } from '@/lib/api-client';
import { motion } from 'framer-motion';
import { Car, ShoppingCart, ShieldCheck, Gauge } from 'lucide-react';
import Image from 'next/image';

export default function DealershipPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles().then(data => {
      setVehicles(data);
      setLoading(false);
    });
  }, []);

  const handleBuy = async (id: string) => {
    await buyVehicle(id);
    alert('Purchase initiated! Your vehicle will be delivered to your inventory shortly.');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
          <Car className="text-blue-500 w-10 h-10" />
          Modular Dealership
        </h1>
        <p className="text-slate-400 mt-2 text-lg">High-performance vehicles for the modern explorer.</p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[450px] bg-slate-900 animate-pulse rounded-3xl border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((v, index) => (
            <motion.div 
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-3xl overflow-hidden border border-slate-800 flex flex-col group"
            >
              <div className="relative h-56 overflow-hidden">
                <Image 
                  src="/cyber-car.png" 
                  alt={v.name}
                  fill
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold text-cyan-400">
                  NEW ARRIVAL
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-white">{v.name}</h3>
                  <div className="text-xl font-black text-cyan-400 font-mono">{v.price} <span className="text-xs uppercase">MTW</span></div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-black/40 p-2 rounded-xl border border-white/5">
                    <Gauge size={14} className="text-blue-500" />
                    <span>Speed: 280km/h</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 bg-black/40 p-2 rounded-xl border border-white/5">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Armor: Heavy</span>
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBuy(v.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                  >
                    <ShoppingCart size={20} />
                    Reserve Vehicle
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
