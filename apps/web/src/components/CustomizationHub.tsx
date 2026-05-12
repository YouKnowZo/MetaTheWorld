import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store'

export interface Avatar {
  appearance: {
    skin: string
    hair: string
    eyes: string
    face: string
  }
  clothing: {
    top: string
    bottom: string
    shoes: string
    accessories: string[]
  }
  body: {
    height: number
    build: string
  }
  personality: {
    traits: string[]
    interests: string[]
    style: string
  }
  animations: {
    idle: string
    walk: string
    dance: string
    wave: string
  }
}

export interface Vehicle {
  id: string
  type: 'car' | 'motorcycle' | 'truck' | 'sports-car' | 'luxury'
  brand: string
  model: string
  customization: {
    color: string
    wheels: string
    interior: string
    performance: {
      speed: number
      acceleration: number
      handling: number
    }
    accessories: string[]
  }
  owned: boolean
  price: number
}

export interface Home {
  id: string
  type: 'apartment' | 'house' | 'mansion' | 'penthouse'
  size: string
  rooms: Room[]
  exterior: {
    style: string
    color: string
    garden: boolean
    pool: boolean
  }
  value: number
  owned: boolean
}

export interface Room {
  id: string
  type: 'bedroom' | 'living-room' | 'kitchen' | 'bathroom' | 'office' | 'game-room'
  furniture: Furniture[]
  decorations: string[]
  theme: string
}

export interface Furniture {
  id: string
  type: string
  style: string
  color: string
  position: [number, number, number]
  price: number
}

export const CustomizationHub: React.FC = () => {
  const { saveAvatar, buyVehicle, addNotification } = useGameStore()
  const [activeCategory, setActiveCategory] = useState<'avatar' | 'home' | 'vehicle'>('avatar')
  const [currentAvatar, setCurrentAvatar] = useState<Avatar>({
    appearance: {
      skin: 'medium',
      hair: 'black-short',
      eyes: 'brown',
      face: 'friendly'
    },
    clothing: {
      top: 'casual-tshirt',
      bottom: 'jeans',
      shoes: 'sneakers',
      accessories: []
    },
    body: {
      height: 170,
      build: 'average'
    },
    personality: {
      traits: ['friendly', 'creative'],
      interests: ['building', 'socializing'],
      style: 'casual'
    },
    animations: {
      idle: 'relaxed',
      walk: 'confident',
      dance: 'freestyle',
      wave: 'friendly'
    }
  })

  const [vehicles] = useState<Vehicle[]>([
    {
      id: 'v1',
      type: 'car',
      brand: 'MetaCar',
      model: 'City Cruiser',
      customization: {
        color: '#ff6b6b',
        wheels: 'sport',
        interior: 'leather',
        performance: { speed: 85, acceleration: 70, handling: 80 },
        accessories: ['spoiler', 'tinted-windows']
      },
      owned: true,
      price: 25000
    },
    {
      id: 'v2',
      type: 'sports-car',
      brand: 'VirtualVelocity',
      model: 'Thunder Bolt',
      customization: {
        color: '#4ecdc4',
        wheels: 'racing',
        interior: 'carbon-fiber',
        performance: { speed: 95, acceleration: 90, handling: 85 },
        accessories: ['nitro', 'racing-stripes']
      },
      owned: false,
      price: 75000
    }
  ])

  const [homes] = useState<Home[]>([
    {
      id: 'h1',
      type: 'apartment',
      size: 'cozy',
      rooms: [
        {
          id: 'r1',
          type: 'bedroom',
          furniture: [],
          decorations: ['poster', 'plants'],
          theme: 'modern'
        },
        {
          id: 'r2',
          type: 'living-room',
          furniture: [],
          decorations: ['art', 'books'],
          theme: 'contemporary'
        }
      ],
      exterior: {
        style: 'modern',
        color: 'white',
        garden: false,
        pool: false
      },
      value: 150000,
      owned: true
    }
  ])

  const avatarOptions = {
    skin: ['light', 'medium', 'dark', 'tan'],
    hair: ['black-short', 'brown-long', 'blonde-curly', 'red-straight', 'blue-punk'],
    eyes: ['brown', 'blue', 'green', 'hazel', 'grey'],
    clothing: {
      tops: ['casual-tshirt', 'button-shirt', 'hoodie', 'blazer', 'dress'],
      bottoms: ['jeans', 'shorts', 'skirt', 'slacks', 'leggings'],
      shoes: ['sneakers', 'boots', 'heels', 'sandals', 'dress-shoes']
    }
  }

  const updateAvatar = (category: string, subcategory: string, value: string) => {
    setCurrentAvatar(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof Avatar],
        [subcategory]: value
      }
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="customization-hub"
    >
      <div className="customization-header">
        <h2>✨ Customization Hub</h2>
        <div className="category-tabs">
          {(['avatar', 'home', 'vehicle'] as const).map(category => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'avatar' && '👤'}
              {category === 'home' && '🏠'}
              {category === 'vehicle' && '🚗'}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="customization-content">
        <div className="preview-section">
          <h3>Preview</h3>
          <div className="preview-area">
            {activeCategory === 'avatar' && (
              <div className="avatar-preview">
                <div className="avatar-model">
                  <span className="large-icon">👤</span>
                  <div className="avatar-details">
                    <p>Skin: {currentAvatar.appearance.skin}</p>
                    <p>Hair: {currentAvatar.appearance.hair}</p>
                    <p>Top: {currentAvatar.clothing.top}</p>
                    <p>Bottom: {currentAvatar.clothing.bottom}</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeCategory === 'vehicle' && (
              <div className="vehicle-preview">
                <span className="large-icon">🚗</span>
                <div className="vehicle-stats">
                  <div className="stat-bar">
                    <span>Speed</span>
                    <div className="bar">
                      <div className="fill speed"></div>
                    </div>
                  </div>
                  <div className="stat-bar">
                    <span>Acceleration</span>
                    <div className="bar">
                      <div className="fill acceleration"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeCategory === 'home' && (
              <div className="home-preview">
                <span className="large-icon">🏠</span>
                <div className="home-details">
                  <p>Type: {homes[0]?.type}</p>
                  <p>Rooms: {homes[0]?.rooms.length}</p>
                  <p>Value: ${homes[0]?.value.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="options-section">
          <AnimatePresence mode="wait">
            {activeCategory === 'avatar' && (
              <motion.div
                key="avatar-options"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="avatar-options"
              >
                <div className="option-group">
                  <h4>Appearance</h4>
                  <div className="option-grid">
                    <div className="option-category">
                      <label>Skin Tone</label>
                      <div className="option-buttons">
                        {avatarOptions.skin.map(skin => (
                          <button
                            key={skin}
                            className={`option-btn ${currentAvatar.appearance.skin === skin ? 'selected' : ''}`}
                            onClick={() => updateAvatar('appearance', 'skin', skin)}
                          >
                            {skin}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="option-category">
                      <label>Hair Style</label>
                      <div className="option-buttons">
                        {avatarOptions.hair.map(hair => (
                          <button
                            key={hair}
                            className={`option-btn ${currentAvatar.appearance.hair === hair ? 'selected' : ''}`}
                            onClick={() => updateAvatar('appearance', 'hair', hair)}
                          >
                            {hair.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="option-group">
                  <h4>Clothing</h4>
                  <div className="clothing-grid">
                    <div className="clothing-category">
                      <label>Top</label>
                      <div className="clothing-options">
                        {avatarOptions.clothing.tops.map(top => (
                          <button
                            key={top}
                            className={`clothing-btn ${currentAvatar.clothing.top === top ? 'selected' : ''}`}
                            onClick={() => updateAvatar('clothing', 'top', top)}
                          >
                            {top.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="clothing-category">
                      <label>Bottom</label>
                      <div className="clothing-options">
                        {avatarOptions.clothing.bottoms.map(bottom => (
                          <button
                            key={bottom}
                            className={`clothing-btn ${currentAvatar.clothing.bottom === bottom ? 'selected' : ''}`}
                            onClick={() => updateAvatar('clothing', 'bottom', bottom)}
                          >
                            {bottom}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="save-section">
                  <button className="save-btn" onClick={() => saveAvatar({
                    skin: currentAvatar.appearance.skin,
                    hair: currentAvatar.appearance.hair,
                    top: currentAvatar.clothing.top,
                    bottom: currentAvatar.clothing.bottom
                  })}>
                    💾 Save Avatar Changes
                  </button>
                </div>
              </motion.div>
            )}

            {activeCategory === 'vehicle' && (
              <motion.div
                key="vehicle-options"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="vehicle-options"
              >
                <div className="vehicle-grid">
                  {vehicles.map(vehicle => (
                    <div key={vehicle.id} className={`vehicle-card ${vehicle.owned ? 'owned' : ''}`}>
                      <div className="vehicle-image">
                        <span className="medium-icon">🚗</span>
                      </div>
                      <div className="vehicle-info">
                        <h4>{vehicle.brand} {vehicle.model}</h4>
                        <p className="vehicle-type">{vehicle.type.replace('-', ' ')}</p>
                        <div className="performance-bars">
                          <div className="perf-stat">
                            <span>Speed: {vehicle.customization.performance.speed}</span>
                            <div className="perf-bar">
                              <div 
                                className="perf-fill"
                                style={{ width: `${vehicle.customization.performance.speed}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <p className="price">${vehicle.price.toLocaleString()}</p>
                        <button 
                          className={`vehicle-btn ${vehicle.owned ? 'customize' : 'buy'}`}
                          onClick={() => {
                            if (vehicle.owned) {
                              addNotification('This feature is yet to be fully implemented!', 'info')
                            } else {
                              buyVehicle({
                                brand: vehicle.brand,
                                model: vehicle.model,
                                type: vehicle.type,
                                price: vehicle.price
                              })
                            }
                          }}
                        >
                          {vehicle.owned ? '🔧 Customize' : '💰 Buy'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeCategory === 'home' && (
              <motion.div
                key="home-options"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="home-options"
              >
                <div className="home-builder">
                  <h4>🏗️ Home Builder</h4>
                  <div className="room-grid">
                    {homes[0]?.rooms.map(room => (
                      <div key={room.id} className="room-card">
                        <h5>{room.type.replace('-', ' ')}</h5>
                        <div className="room-preview">
                          <span className="small-icon">
                            {room.type === 'bedroom' && '🛏️'}
                            {room.type === 'living-room' && '🛋️'}
                            {room.type === 'kitchen' && '🍳'}
                            {room.type === 'bathroom' && '🚿'}
                          </span>
                        </div>
                        <p>Theme: {room.theme}</p>
                        <p>Items: {room.decorations.length}</p>
                        <button className="room-btn" onClick={() => addNotification('This feature is yet to be fully implemented!', 'info')}>🎨 Decorate</button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="add-room-section">
                    <button className="add-room-btn" onClick={() => addNotification('This feature is yet to be fully implemented!', 'info')}>
                      ➕ Add New Room
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
