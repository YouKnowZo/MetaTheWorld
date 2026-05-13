import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './TopNav.css'

interface TopNavProps {
  currentSection?: string
  onSectionChange?: (section: string) => void
}

export const TopNav: React.FC<TopNavProps> = ({ currentSection, onSectionChange }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userConnected, setUserConnected] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'hero', label: 'Home', icon: '🏠' },
    { id: 'metaverse', label: 'Metaverse', icon: '🌐' },
    { id: 'land', label: 'Land NFTs', icon: '🏞️' },
    { id: 'crypto', label: 'Crypto Hub', icon: '₿' },
    { id: 'casino', label: 'Casino', icon: '🎰' },
    { id: 'earning', label: 'Earn', icon: '💎' },
    { id: 'social', label: 'Social', icon: '👥' },
    { id: 'customize', label: 'Avatar', icon: '👤' },
  ]

  const scrollToSection = (sectionId: string) => {
    if (onSectionChange) {
      onSectionChange(sectionId)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    setIsMobileMenuOpen(false)
  }

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        setUserConnected(true)
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  return (
    <>
      <motion.nav 
        className={`top-nav ${isScrolled ? 'scrolled' : ''}`}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="nav-container">
          {/* Logo */}
          <motion.div 
            className="nav-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('hero')}
          >
            <div className="logo-icon">🌍</div>
            <div className="logo-text">
              <span className="logo-main">META</span>
              <span className="logo-sub">THE WORLD</span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="nav-items desktop-only">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                className={`nav-item ${currentSection === item.id ? 'active' : ''}`}
                onClick={() => scrollToSection(item.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* User Controls */}
          <div className="nav-controls">
            {/* Wallet Connection */}
            <motion.button
              className={`wallet-btn ${userConnected ? 'connected' : ''}`}
              onClick={connectWallet}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="wallet-icon">{userConnected ? '🔗' : '👛'}</span>
              <span className="wallet-text">
                {userConnected ? 'Connected' : 'Connect Wallet'}
              </span>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="mobile-menu-btn mobile-only"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="mobile-menu-content">
              <div className="mobile-menu-header">
                <div className="mobile-logo">
                  <span>🌍</span>
                  <span>META THE WORLD</span>
                </div>
                <button 
                  className="close-btn"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="mobile-nav-items">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    className={`mobile-nav-item ${currentSection === item.id ? 'active' : ''}`}
                    onClick={() => scrollToSection(item.id)}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="mobile-nav-icon">{item.icon}</span>
                    <span className="mobile-nav-label">{item.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="mobile-menu-footer">
                <motion.button
                  className={`mobile-wallet-btn ${userConnected ? 'connected' : ''}`}
                  onClick={connectWallet}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{userConnected ? '🔗' : '👛'}</span>
                  <span>{userConnected ? 'Wallet Connected' : 'Connect Wallet'}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
