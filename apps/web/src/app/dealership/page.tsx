'use client';
import React, { useEffect, useState } from 'react';
import { fetchVehicles, buyVehicle } from '@/lib/api-client';

export default function DealershipPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    fetchVehicles().then(setVehicles);
  }, []);

  const handleBuy = async (id: string) => {
    await buyVehicle(id);
    alert('Purchase initiated!');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Modular Vehicle Dealership</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map(v => (
          <div key={v.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
            <div className="h-48 bg-slate-700 flex items-center justify-center text-slate-500 font-bold">
              [ {v.name} Image ]
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-white">{v.name}</h3>
              <p className="text-cyan-400 font-bold mt-1">{v.price} {v.currency}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-semibold">Modular Slots: 4</span>
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-semibold">Tier: Genesis</span>
              </div>
              <button 
                onClick={() => handleBuy(v.id)}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
              >
                Buy Vehicle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
