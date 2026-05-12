import React, { useState } from 'react'
import { useGameStore } from '../store'
import { motion, AnimatePresence } from 'framer-motion'
import { SocialSystem } from './SocialSystem'
import { CustomizationHub } from './CustomizationHub'
import { CareerHub } from './CareerHub'

export const UI: React.FC = () => {
  const { 
    currentUser, 
    selectedLand, 
    gameMode, 
    setGameMode, 
    purchaseLand,
    lands 
  } = useGameStore()

  const [activePanel, setActivePanel] = useState<string | null>(null)

  const handlePurchase = () => {
    if (selectedLand && currentUser) {
      purchaseLand(selectedLand.id, selectedLand.price)
    }
  }

  const ownedLands = lands.filter(land => land.owner === currentUser?.address)
  const totalValue = ownedLands.reduce((sum, land) => sum + land.price, 0)

  return (
    <div className="ui-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="logo">
          <h1>🌍 Meta The World</h1>
          <p>Next-Gen Metaverse</p>
        </div>
        
        <div className="user-stats">
          {currentUser && (
            <>
              <div className="stat">
                <span className="label">Balance:</span>
                <span className="value">${currentUser.balance} ETH</span>
              </div>
              <div className="stat">
                <span className="label">Lands:</span>
                <span className="value">{ownedLands.length}</span>
              </div>
              <div className="stat">
                <span className="label">Portfolio:</span>
                <span className="value">${totalValue} ETH</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Game Mode Selector */}
      <div className="mode-selector">
        {(['explore', 'build', 'trade'] as const).map((mode) => (
          <button
            key={mode}
            className={`mode-btn ${gameMode === mode ? 'active' : ''}`}
            onClick={() => setGameMode(mode)}
          >
            {mode === 'explore' && '🗺️'} 
            {mode === 'build' && '🏗️'} 
            {mode === 'trade' && '💰'} 
            {mode.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Land Details Panel */}
      <AnimatePresence>
        {selectedLand && (
          <motion.div
            className="land-panel"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="panel-header">
              <h3>Land #{selectedLand.id}</h3>
              <div className={`land-type ${selectedLand.type}`}>
                {selectedLand.type}
              </div>
            </div>
            
            <div className="panel-content">
              <div className="property">
                <span>Type:</span> 
                <span className="capitalize">{selectedLand.type}</span>
              </div>
              <div className="property">
                <span>Price:</span> 
                <span>${selectedLand.price} ETH</span>
              </div>
              <div className="property">
                <span>Resources:</span> 
                <span>{selectedLand.resources}/100</span>
              </div>
              <div className="property">
                <span>Buildings:</span> 
                <span>{selectedLand.buildings.length}</span>
              </div>
              <div className="property">
                <span>Owner:</span> 
                <span>{selectedLand.owner || 'Available'}</span>
              </div>
              <div className="property">
                <span>Coordinates:</span> 
                <span>
                  {selectedLand.coordinates.lat.toFixed(4)}, 
                  {selectedLand.coordinates.lng.toFixed(4)}
                </span>
              </div>
            </div>

            {!selectedLand.owner && currentUser && (
              <div className="panel-actions">
                <button
                  className="purchase-btn"
                  onClick={handlePurchase}
                  disabled={currentUser.balance < selectedLand.price}
                >
                  {currentUser.balance >= selectedLand.price 
                    ? `Purchase for $${selectedLand.price} ETH`
                    : 'Insufficient Funds'
                  }
                </button>
              </div>
            )}

            {selectedLand.owner === currentUser?.address && (
              <div className="panel-actions">
                <button className="build-btn">🏗️ Build</button>
                <button className="sell-btn">💰 Sell</button>
                <button className="develop-btn">⚡ Develop</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Map */}
      <div className="mini-map">
        <h4>World Map</h4>
        <div className="map-grid">
          {lands.slice(0, 100).map((land) => (
            <div
              key={land.id}
              className={`map-cell ${land.type} ${
                land.owner ? 'owned' : 'available'
              } ${selectedLand?.id === land.id ? 'selected' : ''}`}
              onClick={() => useGameStore.getState().selectLand(land)}
            />
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="activity-feed">
        <h4>Recent Activity</h4>
        <div className="feed-item">🏠 New building constructed on Land #42</div>
        <div className="feed-item">💰 Land #78 sold for $350 ETH</div>
        <div className="feed-item">🌱 Land #23 developed into park</div>
        <div className="feed-item">⚡ Resource discovery on Land #91</div>
      </div>

      {/* Navigation Panel */}
      <div className="navigation-panel">
        <h4>🎮 Metaverse Hub</h4>
        <div className="nav-buttons">
          <button 
            className={`nav-btn ${activePanel === 'social' ? 'active' : ''}`}
            onClick={() => setActivePanel(activePanel === 'social' ? null : 'social')}
          >
            👥 Social & Dating
          </button>
          <button 
            className={`nav-btn ${activePanel === 'customize' ? 'active' : ''}`}
            onClick={() => setActivePanel(activePanel === 'customize' ? null : 'customize')}
          >
            ✨ Customize Avatar
          </button>
          <button 
            className={`nav-btn ${activePanel === 'career' ? 'active' : ''}`}
            onClick={() => setActivePanel(activePanel === 'career' ? null : 'career')}
          >
            💼 Career & Jobs
          </button>
          <button 
            className={`nav-btn ${activePanel === 'build' ? 'active' : ''}`}
            onClick={() => setActivePanel(activePanel === 'build' ? null : 'build')}
          >
            🏠 Build Home
          </button>
        </div>
      </div>

      {/* Dynamic Panels */}
      <AnimatePresence>
        {activePanel === 'social' && (
          <motion.div
            key="social-panel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="overlay-panel"
          >
            <button 
              className="close-panel"
              onClick={() => setActivePanel(null)}
            >
              ✕
            </button>
            <SocialSystem />
          </motion.div>
        )}

        {activePanel === 'customize' && (
          <motion.div
            key="customize-panel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="overlay-panel"
          >
            <button 
              className="close-panel"
              onClick={() => setActivePanel(null)}
            >
              ✕
            </button>
            <CustomizationHub />
          </motion.div>
        )}

        {activePanel === 'career' && (
          <motion.div
            key="career-panel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="overlay-panel"
          >
            <button 
              className="close-panel"
              onClick={() => setActivePanel(null)}
            >
              ✕
            </button>
            <CareerHub />
          </motion.div>
        )}

        {activePanel === 'build' && (
          <motion.div
            key="build-panel"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="overlay-panel"
          >
            <button 
              className="close-panel"
              onClick={() => setActivePanel(null)}
            >
              ✕
            </button>
            <div className="build-system">
              <h2>🏠 Home Builder</h2>
              <p>Design and build your dream home in the metaverse!</p>
              <div className="build-options">
                <button className="build-option">🏠 Build House</button>
                <button className="build-option">🏢 Build Apartment</button>
                <button className="build-option">🏰 Build Mansion</button>
                <button className="build-option">🏬 Build Business</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
