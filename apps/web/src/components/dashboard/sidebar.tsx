'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Map as MapIcon,
  LayoutDashboard,
  ShoppingBag,
  Settings,
  User,
  Box,
  Store,
  TrendingUp,
  Users,
  Crown,
  Megaphone,
  Coins,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const navItems = [
  { name: 'Map View', href: '/', icon: MapIcon },
  { name: 'Inventory', href: '/inventory', icon: Box },
  { name: 'Diamond District', href: '/diamond-district', icon: LayoutDashboard },
  { name: 'Dealership', href: '/dealership', icon: ShoppingBag },
  { name: 'NFT Marketplace', href: '/nft-marketplace', icon: Store },
  { name: 'Crypto Prices', href: '/crypto-prices', icon: TrendingUp },
  { name: 'Party Room', href: '/party-room', icon: Users },
  { name: 'VIP Rooms', href: '/vip-rooms', icon: Crown },
  { name: 'Ad Space', href: '/ad-space', icon: Megaphone },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-slate-900 text-white h-screen border-r border-slate-800 overflow-y-auto">
      <div className="p-6 shrink-0">
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          META THE WORLD
        </h1>
        <p className="text-slate-500 text-xs mt-1">Digital Twin Metaverse</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* MTW Balance */}
      <div className="mx-4 mb-3 px-3 py-2 bg-slate-800 rounded-lg border border-yellow-500/20 shrink-0">
        <div className="flex items-center space-x-2">
          <Coins size={16} className="text-yellow-400" />
          <div>
            <p className="text-yellow-400 font-bold text-sm">1,250 MTW</p>
            <p className="text-slate-500 text-[10px]">≈ $105.88 USD</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 shrink-0">
        <ConnectButton label="Connect" showBalance={false} chainStatus="icon" accountStatus="avatar" />
      </div>
    </div>
  );
}
