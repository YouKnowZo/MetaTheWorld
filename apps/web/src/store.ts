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

<<<<<<< HEAD
export interface ToastNotification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
=======
export interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  timestamp: number
>>>>>>> 078f28a (fix: resolve TypeScript deprecations, update Tailwind v4 PostCSS config, fix dependencies)
}

interface GameState {
  lands: Land[]
  users: User[]
  currentUser: User | null
  selectedLand: Land | null
  gameMode: 'explore' | 'build' | 'trade'
  worldSeed: number
<<<<<<< HEAD
  notifications: ToastNotification[]
=======
  notifications: Notification[]
>>>>>>> 078f28a (fix: resolve TypeScript deprecations, update Tailwind v4 PostCSS config, fix dependencies)
  
  // Actions
  addNotification: (message: string, type?: 'success' | 'error' | 'info') => void
  removeNotification: (id: string) => void
  setCurrentUser: (user: User) => void
  selectLand: (land: Land | null) => void
  setGameMode: (mode: 'explore' | 'build' | 'trade') => void
  purchaseLand: (landId: number, price: number) => void
  buildOnLand: (landId: number, building: Building) => void
<<<<<<< HEAD
  syncBackend: () => Promise<void>
  fetchLands: () => Promise<void>
  saveAvatar: (avatarData: any) => Promise<void>
  buyVehicle: (vehicleData: any) => Promise<void>
=======
  generateWorld: () => void
  addNotification: (message: string, type: Notification['type']) => void
  removeNotification: (id: string) => void
>>>>>>> 078f28a (fix: resolve TypeScript deprecations, update Tailwind v4 PostCSS config, fix dependencies)
}

export const useGameStore = create<GameState>((set, get) => ({
  lands: [],
  users: [],
  currentUser: null,
  selectedLand: null,
  gameMode: 'explore',
  worldSeed: Math.random(),
  notifications: [],
<<<<<<< HEAD
  
  addNotification: (message, type = 'success') => set((state) => ({
    notifications: [...state.notifications, { id: Date.now().toString() + Math.random(), message, type }]
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
=======
>>>>>>> 078f28a (fix: resolve TypeScript deprecations, update Tailwind v4 PostCSS config, fix dependencies)
  
  setCurrentUser: (user) => set({ currentUser: user }),
  selectLand: (land) => set({ selectedLand: land }),
  setGameMode: (mode) => set({ gameMode: mode }),
  
<<<<<<< HEAD
  purchaseLand: async (landId, price) => {
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
=======
  addNotification: (message, type) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        id: Date.now().toString(),
        message,
        type,
        timestamp: Date.now()
      }
    ]
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  purchaseLand: (landId, price) => set((state) => {
    if (!state.currentUser || state.currentUser.balance < price) {
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now().toString(),
            message: 'Insufficient balance to purchase land',
            type: 'error',
            timestamp: Date.now()
          }
        ]
      }
    }
    
    const lands = state.lands.map(land => 
      land.id === landId 
        ? { ...land, owner: state.currentUser!.address }
        : land
    )
    
    const currentUser = {
      ...state.currentUser,
      balance: state.currentUser.balance - price,
      ownedLands: [...state.currentUser.ownedLands, landId]
    }
    
    return {
      lands,
      currentUser,
      notifications: [
        ...state.notifications,
        {
          id: Date.now().toString(),
          message: `Land purchased successfully for ${price} tokens`,
          type: 'success',
          timestamp: Date.now()
        }
      ]
    }
  }),
  
  buildOnLand: (landId, building) => set((state) => {
    const lands = state.lands.map(land => 
      land.id === landId 
        ? { ...land, buildings: [...land.buildings, building], developed: true }
        : land
    )
    
    return {
      lands,
      notifications: [
        ...state.notifications,
        {
          id: Date.now().toString(),
          message: `${building.type} built successfully`,
          type: 'success',
          timestamp: Date.now()
        }
      ]
    }
  }),
  
  generateWorld: () => set(() => {
    const lands: Land[] = []
    const gridSize = 20
    const landTypes: Land['type'][] = ['residential', 'commercial', 'industrial', 'park', 'beach', 'mountain']
    
    for (let x = -gridSize; x <= gridSize; x++) {
      for (let z = -gridSize; z <= gridSize; z++) {
        const id = x * 1000 + z
        const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1)
        const height = noise * 2
        
        lands.push({
          id,
          position: [x * 4, height, z * 4],
          owner: Math.random() > 0.8 ? 'demo-user' : null,
          price: Math.floor(100 + Math.random() * 500),
          type: landTypes[Math.floor(Math.random() * landTypes.length)],
          buildings: [],
          resources: Math.floor(Math.random() * 100),
          developed: Math.random() > 0.7,
          coordinates: {
            lat: 40.7128 + (x * 0.001),
            lng: -74.0060 + (z * 0.001)
          }
        })
>>>>>>> 078f28a (fix: resolve TypeScript deprecations, update Tailwind v4 PostCSS config, fix dependencies)
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
  }
}))