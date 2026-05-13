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
    </main>
  );
}
