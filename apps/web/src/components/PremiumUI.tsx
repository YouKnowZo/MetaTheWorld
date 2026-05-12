import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store'

interface CryptoData {
  ethPrice: number
  landsSold: number
  totalRevenue: number
  activeUsers: number
}

interface PremiumUIProps {
  cryptoData: CryptoData
}

export const PremiumUI: React.FC<PremiumUIProps> = ({ cryptoData }) => {
  const { 
    currentUser, 
    selectedLand, 
    purchaseLand,
    lands 
  } = useGameStore()

  const [activePanel, setActivePanel] = useState<'marketplace' | 'portfolio' | 'leaderboard' | null>('marketplace')
  const [landFilter, setLandFilter] = useState<'all' | 'residential' | 'commercial' | 'industrial' | 'park' | 'beach' | 'mountain'>('all')
  const [showNotification, setShowNotification] = useState(false)
  const [recentSales, setRecentSales] = useState([
    { id: 1, price: 15.7, buyer: '0x8a3f...2c4d', rarity: 'rare' },
    { id: 2, price: 28.2, buyer: '0x7b2e...9f1a', rarity: 'epic' },
    { id: 3, price: 45.8, buyer: '0x9c4f...8e3b', rarity: 'legendary' }
  ])

  // Simulate live activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setRecentSales(prev => [
          {
            id: Math.floor(Math.random() * 1000),
            price: Math.random() * 50 + 5,
            buyer: `0x${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 4)}`,
            rarity: ['common', 'rare', 'epic', 'legendary'][Math.floor(Math.random() * 4)] as 'common' | 'rare' | 'epic' | 'legendary'
          },
          ...prev.slice(0, 4)
        ])
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 3000)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const ownedLands = lands.filter(land => land.owner === currentUser?.address)
  const totalValue = ownedLands.reduce((sum, land) => sum + land.price, 0)
  const profitLoss = totalValue - ownedLands.reduce((sum, land) => sum + (land.purchasePrice || land.price), 0)

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
      case 'legendary': return '#ff6b00'
      case 'epic': return '#9c27b0'
      case 'rare': return '#2196f3'
      default: return '#4caf50'
    }
  }

  const handlePurchase = async (landId?: number, price?: number) => {
    const targetId = landId || selectedLand?.id
    const targetPrice = price || selectedLand?.price
    
    if (targetId && targetPrice && currentUser && currentUser.balance >= targetPrice) {
      await purchaseLand(targetId, targetPrice)
    }
  }

  return (
    <>
      {/* Live Notifications */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="live-notification"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            🔥 Someone just bought Land #{recentSales[0]?.id} for {recentSales[0]?.price.toFixed(2)} ETH!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Header */}
      <div className="premium-header">
        <div className="brand-section">
          <h1 className="brand-title">🌍 META THE WORLD</h1>
          <div className="live-indicator">
            <span className="pulse-dot"></span>
            LIVE
          </div>
        </div>

        <div className="crypto-ticker">
          <div className="ticker-item">
            <span className="ticker-label">ETH</span>
            <span className="ticker-value">${cryptoData.ethPrice.toFixed(2)}</span>
            <span className="ticker-change positive">+2.4%</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-label">Volume</span>
            <span className="ticker-value">{cryptoData.totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        {currentUser && (
          <div className="user-profile">
            <div className="avatar-container">
              <div className="avatar-ring"></div>
              <div className="avatar-inner">
                <span className="vip-level">VIP {currentUser.vipLevel}</span>
              </div>
            </div>
            <div className="user-info">
              <div className="user-address">{currentUser.address}</div>
              <div className="user-balance">{currentUser.balance.toFixed(2)} ETH</div>
            </div>
          </div>
        )}
      </div>

      {/* Side Panel Navigation */}
      <div className="side-nav">
        {[
          { id: 'marketplace', icon: '🏪', label: 'Marketplace' },
          { id: 'portfolio', icon: '💼', label: 'Portfolio' },
          { id: 'leaderboard', icon: '🏆', label: 'Leaderboard' }
        ].map((item) => (
          <motion.button
            key={item.id}
            className={`nav-btn ${activePanel === item.id ? 'active' : ''}`}
            onClick={() => setActivePanel(item.id as 'marketplace' | 'portfolio' | 'leaderboard')}
            whileHover={{ scale: 1.1, x: 10 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Main Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePanel}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="main-panel-wrapper"
        >
          {activePanel === 'marketplace' && (
            <div className="marketplace-panel">
              <div className="panel-header">
                <h2>🏪 Land Marketplace</h2>
                <div className="filter-tabs">
                  {['all', 'residential', 'commercial', 'industrial', 'park', 'beach', 'mountain'].map((filter) => (
                    <button
                      key={filter}
                      className={`filter-tab ${landFilter === filter ? 'active' : ''}`}
                      onClick={() => setLandFilter(filter as 'all' | 'residential' | 'commercial' | 'industrial' | 'park' | 'beach' | 'mountain')}
                    >
                      {filter.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="marketplace-grid">
                {lands
                  .filter(land => landFilter === 'all' || land.type === landFilter)
                  .slice(0, 6)
                  .map((land) => (
                  <motion.div
                    key={land.id}
                    className={`land-card ${land.owner ? 'owned' : 'available'}`}
                    whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                    onClick={() => !land.owner && handlePurchase(land.id, land.price)}
                  >
                    <div className="card-header">
                      <div className="land-id">#{land.id}</div>
                      <div 
                        className="rarity-badge" 
                        style={{ backgroundColor: getRarityColor(land.type) }}
                      >
                        {land.type.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="land-preview">
                      <div className="land-visualization"></div>
                      {land.owner && <div className="sold-overlay">SOLD</div>}
                    </div>
                    
                    <div className="card-footer">
                      <div className="price-section">
                        <span className="price">{land.price} ETH</span>
                        <span className="usd-price">${(land.price * cryptoData.ethPrice).toFixed(0)}</span>
                      </div>
                      {!land.owner && (
                        <button className="buy-btn">
                          ⚡ BUY NOW
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="recent-activity">
                <h3>🔥 Recent Sales</h3>
                <div className="activity-list">
                  {recentSales.map((sale, index) => (
                    <motion.div
                      key={sale.id}
                      className="activity-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="sale-info">
                        <span className="land-id">Land #{sale.id}</span>
                        <span className="buyer">{sale.buyer}</span>
                      </div>
                      <div className="sale-price">{sale.price.toFixed(2)} ETH</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePanel === 'portfolio' && (
            <div className="portfolio-panel">
              <div className="panel-header">
                <h2>💼 Your Portfolio</h2>
              </div>

              <div className="portfolio-stats">
                <div className="stat-card">
                  <div className="stat-icon">🏠</div>
                  <div className="stat-content">
                    <div className="stat-value">{ownedLands.length}</div>
                    <div className="stat-label">Lands Owned</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-content">
                    <div className="stat-value">{totalValue.toFixed(2)} ETH</div>
                    <div className="stat-label">Total Value</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <div className={`stat-value ${profitLoss >= 0 ? 'positive' : 'negative'}`}>
                      {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)} ETH
                    </div>
                    <div className="stat-label">P&L</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-content">
                    <div className="stat-value">{currentUser?.reputation || 0}</div>
                    <div className="stat-label">Reputation</div>
                  </div>
                </div>
              </div>

              {ownedLands.length > 0 && (
                <div className="owned-lands">
                  <h3>Your Lands</h3>
                  <div className="lands-grid">
                    {ownedLands.map((land) => (
                      <div key={land.id} className="owned-land-card">
                        <div className="land-image"></div>
                        <div className="land-details">
                          <div className="land-title">Land #{land.id}</div>
                          <div className="land-value">{land.price} ETH</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activePanel === 'leaderboard' && (
            <div className="leaderboard-panel">
              <div className="panel-header">
                <h2>🏆 Leaderboard</h2>
              </div>

              <div className="leaderboard-list">
                {[
                  { rank: 1, address: '0x742d...35Cc', lands: 47, value: 892.5, vip: 7 },
                  { rank: 2, address: '0x8b5a...29Df', lands: 35, value: 674.2, vip: 6 },
                  { rank: 3, address: '0x9c6e...48Aa', lands: 28, value: 523.8, vip: 5 },
                  { rank: 4, address: currentUser?.address || '0x1234...5678', lands: ownedLands.length, value: totalValue, vip: currentUser?.vipLevel || 1 }
                ].map((user, index) => (
                  <motion.div
                    key={user.address}
                    className={`leaderboard-item ${user.address === currentUser?.address ? 'current-user' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="rank-badge">#{user.rank}</div>
                    <div className="user-info">
                      <div className="user-address">{user.address}</div>
                      <div className="vip-badge">VIP {user.vip}</div>
                    </div>
                    <div className="user-stats">
                      <div className="stat">{user.lands} lands</div>
                      <div className="stat">{user.value.toFixed(1)} ETH</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Selected Land Panel */}
      <AnimatePresence>
        {selectedLand && (
          <motion.div
            className="selected-land-panel"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="land-showcase">
              <div className="land-3d-preview">
                <div className="preview-placeholder">
                  🏞️ 3D Preview
                </div>
              </div>
              
              <div className="land-info">
                <h3>Land #{selectedLand.id}</h3>
                <div className="land-rarity" style={{ '--rarity-color': getRarityColor(selectedLand.type) } as React.CSSProperties}>
                  ✨ {selectedLand.type.toUpperCase()} RARITY
                </div>
                
                <div className="price-display">
                  <div className="eth-price">{selectedLand.price} ETH</div>
                  <div className="usd-price">${(selectedLand.price * cryptoData.ethPrice).toFixed(2)}</div>
                </div>

                <div className="land-features">
                  <div className="feature">📍 Prime Location</div>
                  <div className="feature">🏗️ Build Ready</div>
                  <div className="feature">💎 Investment Grade</div>
                </div>

                {!selectedLand.owner && currentUser && (
                  <motion.button
                    className="purchase-btn"
                    onClick={() => handlePurchase(selectedLand.id, selectedLand.price)}
                    disabled={currentUser.balance < selectedLand.price}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentUser.balance >= selectedLand.price ? 
                      `🚀 Purchase for ${selectedLand.price} ETH` : 
                      '❌ Insufficient Balance'
                    }
                  </motion.button>
                )}

                {selectedLand.owner && (
                  <div className="owned-indicator">
                    ✅ OWNED BY {selectedLand.owner === currentUser?.address ? 'YOU' : 'ANOTHER USER'}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
