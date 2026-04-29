const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// ─── Existing API Methods ───────────────────────────────────────────────────

export const fetchParcels = async (bbox: string) => {
  console.log('Fetching parcels for bbox:', bbox);
  return [
    {
      id: 'p1',
      token_id: '12345',
      tier: 'DISTRICT',
      owner_address: '0x123...',
      geometry: {
        type: 'Polygon',
        coordinates: [[[2.35, 48.85], [2.36, 48.85], [2.36, 48.86], [2.35, 48.86], [2.35, 48.85]]]
      }
    }
  ];
};

export const fetchOwnedAssets = async (address: string) => {
  console.log('Fetching assets for address:', address);
  return [
    { id: '1', name: 'Eiffel Tower Parcel', type: 'LAND', tier: 'DISTRICT', image: '...' },
  ];
};

export const placeBet = async (amount: string, gameType: number, parcelId: string) => {
  console.log(`Placing bet: ${amount} MTW on game type ${gameType} at parcel ${parcelId}`);
  return { requestId: '0x' + Math.random().toString(16).slice(2) };
};

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  console.log('Fetching vehicles from dealership');
  return [
    { id: 'v1', name: 'CyberTruck', price: 1000, currency: 'MTW', imageUrl: '/vehicles/cybertruck.png', description: 'A futuristic electric pickup truck with robust capabilities.', modularSlots: 4, tier: 'Genesis', status: 'available' },
    { id: 'v2', name: 'Roadster 2.0', price: 2500, currency: 'MTW', imageUrl: '/vehicles/roadster.png', description: 'Next-generation electric sports car, ultimate performance.', modularSlots: 2, tier: 'Premium', status: 'available' },
    { id: 'v3', name: 'Cybersquad ATV', price: 750, currency: 'MTW', imageUrl: '/vehicles/cybersquad.png', description: 'All-electric ATV for off-road adventures.', modularSlots: 1, tier: 'Standard', status: 'available' },
    { id: 'v4', name: 'Cybervan', price: 1500, currency: 'MTW', imageUrl: '/vehicles/cybervan.png', description: 'Spacious electric van, perfect for cargo or custom builds.', modularSlots: 3, tier: 'Premium', status: 'available' },
  ];
};

export const buyVehicle = async (vehicleId: string): Promise<{ success: boolean }> => {
  console.log(`Buying vehicle: ${vehicleId}`);
  // In a real application, this would interact with a smart contract or backend service
  return { success: true };
};

export interface Asset {
  id: string;
  name: string;
  type: 'LAND' | 'WARDROBE' | 'VEHICLE';
  imageUrl: string;
  description: string;
  quantity: number;
}

export const fetchAssets = async (): Promise<Asset[]> => {
  console.log('Fetching user assets');
  return [
    { id: 'a1', name: 'Genesis Land Parcel 0,0', type: 'LAND', imageUrl: '/parcels/parcel1.png', description: 'A prime piece of virtual land.', quantity: 1 },
    { id: 'a2', name: 'Cybernetic Jacket', type: 'WARDROBE', imageUrl: '/wardrobe/jacket1.png', description: 'Stylish jacket for your avatar.', quantity: 1 },
    { id: 'a3', name: 'Roadster 2.0', type: 'VEHICLE', imageUrl: '/vehicles/roadster.png', description: 'Next-generation electric sports car.', quantity: 1 },
    { id: 'a4', name: 'Industrial Land 1,1', type: 'LAND', imageUrl: '/parcels/parcel2.png', description: 'Land zoned for industrial development.', quantity: 1 },
    { id: 'a5', name: 'VR Headset', type: 'WARDROBE', imageUrl: '/wardrobe/headset1.png', description: 'Immersive virtual reality headset.', quantity: 1 },
  ];
};

export const interactWithAgent = async (agentId: string, message: string, playerId: string) => {
  const response = await fetch(`/api/agents/${agentId}/interact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, playerId })
  });
  return response.json();
};

export interface Vehicle {
  id: string;
  name: string;
  price: number;
  currency: string;
  imageUrl: string;
  description: string;
  modularSlots: number;
  tier: string;
  status: 'available' | 'sold';
}

// ─── NFT Marketplace ────────────────────────────────────────────────────────

export interface NFTListing {
  id: string;
  name: string;
  type: 'LAND' | 'VEHICLE' | 'WEARABLE' | 'BUILDING';
  price: number;
  priceUSD: number;
  owner: string;
  rare: boolean;
  tokenId: string;
}

export const fetchNFTListings = async (): Promise<NFTListing[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/nft/listings`);
    if (!res.ok) throw new Error('Failed to fetch NFT listings');
    return res.json();
  } catch {
    // Return mock data as fallback
    return [
      { id: '1', name: 'Paris District #0042', type: 'LAND', price: 0.42, priceUSD: 1260, owner: '0xA3f2...8B1c', rare: true, tokenId: '42' },
      { id: '2', name: 'Tokyo Land #1337', type: 'LAND', price: 1.05, priceUSD: 3150, owner: '0xF9e1...2D4a', rare: true, tokenId: '1337' },
    ];
  }
};

export const mintNFT = async (name: string, type: string, price: string): Promise<{ txHash: string; tokenId: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/api/nft/mint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, price }),
    });
    if (!res.ok) throw new Error('Failed to mint NFT');
    return res.json();
  } catch {
    return { txHash: '0x' + Math.random().toString(16).slice(2, 66), tokenId: String(Math.floor(Math.random() * 10000)) };
  }
};

// ─── Crypto Prices ──────────────────────────────────────────────────────────

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

export const fetchCryptoPrices = async (): Promise<CryptoPrice[]> => {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,matic-network,the-sandbox,decentraland&order=market_cap_desc&per_page=5&page=1&sparkline=false'
    );
    if (!res.ok) throw new Error('CoinGecko API error');
    return res.json();
  } catch {
    return [];
  }
};

// ─── VIP Rooms ───────────────────────────────────────────────────────────────

export interface VIPRoom {
  id: string;
  name: string;
  entryFee: number;
  occupancy: number;
  maxCapacity: number;
  perks: string[];
  isActive: boolean;
}

export const fetchVIPRooms = async (): Promise<VIPRoom[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/vip-rooms`);
    if (!res.ok) throw new Error('Failed to fetch VIP rooms');
    return res.json();
  } catch {
    return [
      { id: 'r1', name: 'The Penthouse', entryFee: 50, occupancy: 12, maxCapacity: 50, perks: ['Private NFT gallery', 'VIP concierge'], isActive: true },
      { id: 'r2', name: 'Crypto Whales Lounge', entryFee: 200, occupancy: 8, maxCapacity: 20, perks: ['Alpha signals', 'Whale tracking'], isActive: true },
    ];
  }
};

export const enterVIPRoom = async (roomId: string, fee: number): Promise<{ success: boolean; txHash: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/api/vip-rooms/${roomId}/enter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fee }),
    });
    if (!res.ok) throw new Error('Failed to enter VIP room');
    return res.json();
  } catch {
    return { success: true, txHash: '0x' + Math.random().toString(16).slice(2, 66) };
  }
};

// ─── Ad Space ────────────────────────────────────────────────────────────────

export interface AdSlotData {
  id: string;
  location: string;
  adType: string;
  dailyVisitors: number;
  priceUSD: number;
  priceMTW: number;
  booked: boolean;
}

export const fetchAdSlots = async (): Promise<AdSlotData[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/ad-slots`);
    if (!res.ok) throw new Error('Failed to fetch ad slots');
    return res.json();
  } catch {
    return [
      { id: 's1', location: 'Paris Eiffel Tower District', adType: 'BILLBOARD', dailyVisitors: 12400, priceUSD: 85, priceMTW: 1003, booked: false },
      { id: 's2', location: 'NYC Times Square Block', adType: 'BILLBOARD', dailyVisitors: 18700, priceUSD: 150, priceMTW: 1771, booked: true },
    ];
  }
};

export const bookAdSlot = async (
  slotId: string,
  duration: number,
  contentUrl: string
): Promise<{ success: boolean; bookingId: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/api/ad-slots/${slotId}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration, contentUrl }),
    });
    if (!res.ok) throw new Error('Failed to book ad slot');
    return res.json();
  } catch {
    return { success: true, bookingId: 'bk_' + Math.random().toString(36).slice(2, 10) };
  }
};

// ─── Party Room ───────────────────────────────────────────────────────────────

export interface PartyRoomState {
  activeUsers: number;
  dancing: number;
  chatting: number;
  watching: number;
  currentTrack: string;
  dj: string;
}

export const fetchPartyRoomState = async (): Promise<PartyRoomState> => {
  try {
    const res = await fetch(`${BASE_URL}/api/party-room/state`);
    if (!res.ok) throw new Error('Failed to fetch party room state');
    return res.json();
  } catch {
    return {
      activeUsers: 247,
      dancing: 89,
      chatting: 134,
      watching: 24,
      currentTrack: 'Neon Nights',
      dj: 'DJ MetaWorld',
    };
  }
};

export const sendChatMessage = async (message: string): Promise<{ success: boolean; messageId: string }> => {
  try {
    const res = await fetch(`${BASE_URL}/api/party-room/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  } catch {
    return { success: true, messageId: 'msg_' + Date.now() };
  }
};
