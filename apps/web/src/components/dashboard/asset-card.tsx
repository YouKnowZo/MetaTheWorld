'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink, Info, Shirt, LandPlot, CarFront } from 'lucide-react';
import { Asset } from '@/lib/api-client';

interface AssetCardProps {
  asset: Asset;
  onViewDetails: (asset: Asset) => void;
}

export function AssetCard({ asset, onViewDetails }: AssetCardProps) {
  const getIconForAssetType = (type: Asset['type']) => {
    switch (type) {
      case 'LAND': return <LandPlot size={16} className="mr-1" />;
      case 'WARDROBE': return <Shirt size={16} className="mr-1" />;
      case 'VEHICLE': return <CarFront size={16} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={asset.imageUrl} 
          alt={asset.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 flex items-center bg-black/50 backdrop-blur-sm rounded-full pr-3 py-1">
          {getIconForAssetType(asset.type)}
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-wider",
            asset.type === 'LAND' ? "text-cyan-400" : asset.type === 'WARDROBE' ? "text-purple-400" : "text-yellow-400"
          )}>
            {asset.type}
          </span>
        </div>
        {asset.quantity > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            x{asset.quantity}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold truncate">{asset.name}</h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{asset.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-500">
            ID: {asset.id}
          </span>
          <div className="flex space-x-2">
            <button onClick={() => console.log(`Info about ${asset.name}`)} className="text-slate-500 hover:text-white transition-colors">
              <Info size={16} />
            </button>
            {asset.type === 'LAND' && (
              <button onClick={() => console.log(`View on map: ${asset.name}`)} className="text-slate-500 hover:text-white transition-colors">
                <ExternalLink size={16} />
              </button>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => onViewDetails(asset)}
          className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {asset.type === 'WARDROBE' ? 'Equip' : asset.type === 'VEHICLE' ? 'Drive' : 'Manage'}
        </button>
      </div>
    </div>
  );
}
