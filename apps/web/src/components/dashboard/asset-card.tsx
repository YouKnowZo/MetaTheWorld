'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink, Info } from 'lucide-react';

interface AssetCardProps {
  asset: {
    id: string;
    name: string;
    type: string;
    image: string;
    tier?: string;
    rarity?: string;
  };
}

export function AssetCard({ asset }: AssetCardProps) {
  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={asset.image} 
          alt={asset.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2">
          <span className={cn(
            "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
            asset.type === 'LAND' ? "bg-cyan-500 text-black" : "bg-purple-500 text-white"
          )}>
            {asset.type}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold truncate">{asset.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-400">
            {asset.tier || asset.rarity}
          </span>
          <div className="flex space-x-2">
            <button className="text-slate-500 hover:text-white transition-colors">
              <Info size={16} />
            </button>
            <button className="text-slate-500 hover:text-white transition-colors">
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
        
        <button className="w-full mt-4 py-2 bg-slate-800 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}
