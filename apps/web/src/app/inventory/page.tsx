'use client';

import { Sidebar } from "@/components/dashboard/sidebar";
import { AssetCard } from "@/components/dashboard/asset-card";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Asset, fetchAssets } from "@/lib/api-client";
import { Package } from "lucide-react";

export default function InventoryPage() {
  const [filter, setFilter] = useState<'ALL' | 'LAND' | 'WARDROBE' | 'VEHICLE'>('ALL');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const loadAssets = useCallback(async () => {
    setLoading(true);
    const fetchedAssets = await fetchAssets();
    setAssets(fetchedAssets);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const filteredAssets = assets.filter(a => filter === 'ALL' || a.type === filter);

  const handleViewDetails = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowDetailsModal(true);
  };

  return (
    <main className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-8 py-6">
          <div className="flex items-center space-x-3">
            <Package size={28} className="text-blue-400" />
            <h1 className="text-2xl font-bold text-white">Your Inventory</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Manage your digital properties and wearables.</p>
        </div>

        <div className="p-8 max-w-6xl mx-auto">
          <header className="mb-8 flex justify-between items-end">
            {/* Filter Buttons */}
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              {(['ALL', 'LAND', 'WARDROBE', 'VEHICLE'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                    filter === t ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </header>

          {loading ? (
            <div className="text-center text-slate-500 py-10">Loading assets...</div>
          ) : filteredAssets.length === 0 ? (
            <div className="text-center text-slate-500 py-10">No assets found for this filter.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} onViewDetails={handleViewDetails} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Asset Details Modal */}
      {showDetailsModal && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl border border-slate-700 max-w-md w-full relative">
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-4">{selectedAsset.name}</h2>
            <img src={selectedAsset.imageUrl} alt={selectedAsset.name} className="w-full h-48 object-cover rounded-md mb-4" />
            <p className="text-slate-300 mb-2">{selectedAsset.description}</p>
            <p className="text-slate-400 text-sm">Type: <span className="font-semibold">{selectedAsset.type}</span></p>
            {selectedAsset.quantity > 1 && (
              <p className="text-slate-400 text-sm">Quantity: <span className="font-semibold">{selectedAsset.quantity}</span></p>
            )}
            <p className="text-slate-400 text-sm">ID: <span className="font-mono text-xs">{selectedAsset.id}</span></p>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => console.log(`Action for ${selectedAsset.name} (${selectedAsset.type})`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {selectedAsset.type === 'WARDROBE' ? 'Equip' : selectedAsset.type === 'VEHICLE' ? 'Drive' : 'Use'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
