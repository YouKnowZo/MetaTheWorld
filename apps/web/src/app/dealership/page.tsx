'use client';
import { fetchVehicles, buyVehicle, Vehicle } from '@/lib/api-client';
import { X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Sidebar } from '@/components/dashboard/sidebar';

function BuyVehicleModal({ vehicle, onClose, onBuy }: { vehicle: Vehicle; onClose: () => void; onBuy: (id: string) => void }) {
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  const handlePurchase = async () => {
    setPurchasing(true);
    await new Promise(r => setTimeout(r, 2000));
    // In a real application, this would interact with the VehicleDealership smart contract
    // e.g., await vehicleDealershipContract.buyVehicle(vehicle.id);
    onBuy(vehicle.id);
    setPurchasing(false);
    setPurchased(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Confirm Vehicle Purchase</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {purchased ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-green-400 text-lg font-bold">Vehicle Purchased Successfully!</p>
            <p className="text-slate-400 text-sm mt-2">Your new {vehicle.name} is ready for pickup.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full h-48 bg-slate-800 rounded-lg overflow-hidden">
              <Image src={vehicle.imageUrl} alt={vehicle.name} layout="fill" objectFit="cover" />
            </div>
            <h3 className="text-white text-lg font-semibold">{vehicle.name}</h3>
            <p className="text-slate-400 text-sm">{vehicle.description}</p>
            <div className="flex justify-between items-center bg-slate-800/60 rounded-lg p-3">
              <div>
                <p className="text-slate-400 text-sm">Price</p>
                <p className="text-white font-bold text-xl">{vehicle.price} {vehicle.currency}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-semibold mb-1">Modular Slots: {vehicle.modularSlots}</span>
                <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-semibold">Tier: {vehicle.tier}</span>
              </div>
            </div>
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {purchasing ? (
                <><Loader2 size={18} className="animate-spin" /><span>Processing...</span></>
              ) : (
                <span>Buy Now for {vehicle.price} {vehicle.currency}</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DealershipPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    fetchVehicles().then(setVehicles);
  }, []);

  const handleBuy = async (id: string) => {
    const vehicleToBuy = vehicles.find(v => v.id === id);
    if (vehicleToBuy) {
      setSelectedVehicle(vehicleToBuy);
      setShowBuyModal(true);
    }
  };

  const confirmPurchase = (id: string) => {
    setVehicles(prevVehicles =>
      prevVehicles.map(v =>
        v.id === id ? { ...v, status: 'sold' } : v
      )
    );
    setShowBuyModal(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-white">Modular Vehicle Dealership</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map(v => (
            <div key={v.id} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-600 transition-colors">
              <div className="relative w-full h-48 bg-slate-800 flex items-center justify-center">
                <Image src={v.imageUrl} alt={v.name} layout="fill" objectFit="cover" />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">{v.name}</h3>
                <p className="text-slate-400 text-sm mb-3">{v.description}</p>
                <p className="text-cyan-400 font-bold text-lg mb-4">{v.price} {v.currency}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-semibold">Modular Slots: {v.modularSlots}</span>
                  <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-semibold">Tier: {v.tier}</span>
                </div>
                <button
                  onClick={() => handleBuy(v.id)}
                  disabled={v.status === 'sold'}
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {v.status === 'sold' ? 'Sold Out' : 'Buy Vehicle'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      {showBuyModal && selectedVehicle && <BuyVehicleModal vehicle={selectedVehicle} onClose={() => setShowBuyModal(false)} onBuy={confirmPurchase} />}
    </div>
  );
}
