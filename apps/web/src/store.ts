import { create } from 'zustand'

export interface Land {
  id: number
  position: [number, number, number]
  ownerId: string | null
  price: number
  type: 'residential' | 'commercial' | 'industrial' | 'park' | 'beach' | 'mountain'
  buildings: Building[]
  resources: number
  developed: boolean
  coordinates: { lat: number; lng: number }
  purchasePrice?: number
}

export interface Building {
  id: string
  type: 'house' | 'skyscraper' | 'shop' | 'factory' | 'park' | 'landmark'
  position: [number, number, number]
  level: number
  income: number
}

export interface User {
  id: string
  address: string
  balance: number
  ownedLands: number[]
  avatar: {
    position: [number, number, number]
    color: string
  }
  achievements: string[]
  vipLevel?: number
  reputation?: number
}

export interface ToastNotification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface GameState {
  lands: Land[]
  users: User[]
  currentUser: User | null
  selectedLand: Land | null
  gameMode: 'explore' | 'build' | 'trade'
  worldSeed: number
  notifications: ToastNotification[]
  
  // Actions
  generateWorld: () => void
  addNotification: (message: string, type?: 'success' | 'error' | 'info') => void
  removeNotification: (id: string) => void
  setCurrentUser: (user: User) => void
  selectLand: (land: Land | null) => void
  setGameMode: (mode: 'explore' | 'build' | 'trade') => void
  purchaseLand: (landId: number, price: number) => void
  buildOnLand: (landId: number, building: Building) => void
  syncBackend: () => Promise<void>
  fetchLands: () => Promise<void>
  saveAvatar: (avatarData: any) => Promise<void>
  buyVehicle: (vehicleData: any) => Promise<void>
  playCasino: (game: string, betAmount: number) => Promise<any>
}

export const useGameStore = create<GameState>((set, get) => ({
  lands: [],
  users: [],
  currentUser: null,
  selectedLand: null,
  gameMode: 'explore',
  worldSeed: Math.random(),
  notifications: [],

  generateWorld: () => {
    if (get().lands.length === 0) {
      console.log("🌎 Generating Metaverse World...");
      // Logic to initialize your digital twin's spatial registry
    }
  },
  
  addNotification: (message, type = 'success') => set((state) => ({
    notifications: [...state.notifications, { id: Date.now().toString() + Math.random(), message, type }]
  })),
  
  removeNotification: (id) => set({
    notifications: get().notifications.filter(n => n.id !== id)
  }),
  
  setCurrentUser: (user) => set({ currentUser: user }),
  selectLand: (land) => set({ selectedLand: land }),
  setGameMode: (mode) => set({ gameMode: mode }),
  
  purchaseLand: async (landId, _price) => {
    const token = localStorage.getItem('meta_token')
    if (!token) {
      get().addNotification('Please login to purchase lands', 'error')
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/lands/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ landId })
      })
      if (res.ok) {
        get().addNotification(`Successfully purchased Land #${landId}!`, 'success')
        get().syncBackend()
        get().fetchLands()
      } else {
        const error = await res.json()
        get().addNotification(`Failed to purchase: ${error.error || 'Unknown error'}`, 'error')
      }
    } catch(err) {
      console.error(err)
      get().addNotification('Network error occurred', 'error')
    }
  },
  
  buildOnLand: async (landId, building) => {
    const token = localStorage.getItem('meta_token')
    if (!token) {
      get().addNotification('Please login to build', 'error')
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/buildings/build', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ landId, type: building.type })
      })
      if (res.ok) {
        get().addNotification(`Successfully built ${building.type}!`, 'success')
        get().syncBackend()
        get().fetchLands()
      } else {
        const error = await res.json()
        get().addNotification(`Failed to build: ${error.error || 'Unknown error'}`, 'error')
      }
    } catch(err) {
      console.error(err)
      get().addNotification('Network error occurred', 'error')
    }
  },
  
  syncBackend: async () => {
    const token = localStorage.getItem('meta_token')
    if (!token) return

    try {
      const res = await fetch('http://localhost:4000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const user = await res.json()
        set({ currentUser: user })
      }
    } catch(err) {
      console.error(err)
    }
  },

  fetchLands: async () => {
    try {
      const res = await fetch('http://localhost:4000/api/lands')
      if (res.ok) {
        const lands = await res.json()
        set({ lands: lands.map((l: any) => ({ ...l, id: l.landId, ownerId: l.ownerId })) })
      }
    } catch(err) {
      console.error(err)
    }
  },

  saveAvatar: async (avatarData) => {
    const token = localStorage.getItem('meta_token')
    if (!token) {
      get().addNotification('Please login to save avatar', 'error')
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/avatar/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(avatarData)
      });
      if (res.ok) {
        get().addNotification('Avatar saved successfully!', 'success');
        get().syncBackend();
      } else {
        const error = await res.json();
        get().addNotification(`Failed to save avatar: ${error.error || 'Unknown'}`, 'error');
      }
    } catch (e) {
      get().addNotification('Network error occurred', 'error')
    }
  },

  buyVehicle: async (vehicleData) => {
    const token = localStorage.getItem('meta_token')
    if (!token) {
      get().addNotification('Please login to buy vehicles', 'error')
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/vehicles/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(vehicleData)
      });
      if (res.ok) {
        get().addNotification(`Vehicle purchased successfully!`, 'success');
        get().syncBackend();
      } else {
        const error = await res.json();
        get().addNotification(`Failed to buy vehicle: ${error.error || 'Unknown'}`, 'error');
      }
    } catch (e) {
      get().addNotification('Network error occurred', 'error')
    }
  },

  playCasino: async (game, betAmount) => {
    const token = localStorage.getItem('meta_token')
    if (!token) {
      get().addNotification('Please login to play', 'error')
      return null;
    }
    try {
      const res = await fetch('http://localhost:4000/api/casino/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ game, betAmount })
      });
      if (res.ok) {
        const data = await res.json();
        get().syncBackend();
        return data;
      } else {
        const error = await res.json();
        get().addNotification(`Failed to play: ${error.error || 'Unknown'}`, 'error');
        return null;
      }
    } catch (e) {
      get().addNotification('Network error occurred', 'error')
      return null;
    }
  }
}))
