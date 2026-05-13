'use client';

import { Sidebar } from "@/components/dashboard/sidebar";
import { AssetCard } from "@/components/dashboard/asset-card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MOCK_ASSETS } from "@/mocks/assets";

export default function InventoryPage() {
  const [filter, setFilter] = useState<'ALL' | 'LAND' | 'WARDROBE'>('ALL');

  const filteredAssets = MOCK_ASSETS.filter(a => filter === 'ALL' || a.type === filter);

  return (
    <main className="flex h-screen bg-black overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white">Your Inventory</h1>
              <p className="text-slate-400 mt-2">Manage your digital properties and wearables.</p>
            </div>
            
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              {(['ALL', 'LAND', 'WARDROBE'] as const).map((t) => (
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
