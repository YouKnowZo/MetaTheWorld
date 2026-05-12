import { useEffect, Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls, 
  Sky, 
  Stars, 
  Environment,
  Loader
} from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { motion } from 'framer-motion'
import { useGameStore } from './store'
import type { User } from './store'
import { LandPlot } from './components/LandPlot'
import { Terrain } from './components/Terrain'
import ModelLoader from './components/ModelLoader'
import { PlayerController } from './components/PlayerController'
import { WorldProvider } from './game/WorldState'
import { TopNav } from './components/TopNav'
import { ScrollProgress } from './components/ScrollProgress' 
import { 
  HeroSection,
  MetaverseSection,
  LandSection,
  CryptoSection,
  CasinoSection,
  EarningSection,
  SocialSection,
  CustomizeSection
} from './components/ScrollSection'
import { useScrollSections } from './hooks/useScrollSections'
import { CryptoHub } from './components/CryptoHub'
import { CasinoHub } from './components/CasinoHub'
import { EarningHub } from './components/EarningHub'
import { VirtualLife } from './components/VirtualLife'
import { CustomizationHub } from './components/CustomizationHub'
import { PremiumUI } from './components/PremiumUI'

import './App.css'
import './components/ScrollingApp.css'
import './components/ScrollProgress.css'
import { useWallet } from './hooks/useWallet'

// Ultra-Realistic Metaverse Lighting
function Lighting() {
  return (
    <>
      {/* Photorealistic Ambient */}
      <ambientLight intensity={0.08} color="#1a1a2e" />
      
      {/* Volumetric Sun (HDRI-based) */}
      <directionalLight
        position={[180, 150, 100]}
        intensity={3.2}
        color="#fff8dc"
        castShadow
        shadow-mapSize-width={8192}
        shadow-mapSize-height={8192}
        shadow-camera-near={0.1}
        shadow-camera-far={1200}
        shadow-camera-left={-500}
        shadow-camera-right={500}
        shadow-camera-top={500}
        shadow-camera-bottom={-500}
        shadow-bias={-0.00005}
        shadow-normalBias={0.02}
      />
      
      {/* Atmospheric Hemisphere */}
      <hemisphereLight
        args={["#87ceeb", "#2f4f4f", 0.4]}
        position={[0, 200, 0]}
      />
      
      {/* Area Lights for Soft Illumination */}
      <rectAreaLight 
        position={[-120, 60, -120]} 
        width={150} 
        height={100}
        intensity={2.0} 
        color="#4169e1" 
      />
      <rectAreaLight 
        position={[120, 60, 120]} 
        width={150} 
        height={100}
        intensity={2.0} 
        color="#dc143c" 
      />
      
      {/* Volumetric Fog Lights */}
      <pointLight position={[-150, 20, -150]} intensity={1.5} color="#9370db" distance={300} decay={1.8} />
      <pointLight position={[150, 20, 150]} intensity={1.5} color="#20b2aa" distance={300} decay={1.8} />
      <pointLight position={[0, 35, -200]} intensity={2.0} color="#ff6347" distance={400} decay={1.5} />
      
      {/* Cinematic Key Lights */}
      <spotLight
        position={[200, 180, 200]}
        target-position={[0, 0, 0]}
        angle={Math.PI / 5}
        penumbra={0.4}
        intensity={2.8}
        color="#e6e6fa"
        distance={600}
        decay={1.2}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.00008}
      />
    </>
  )
}

// 3D Metaverse Scene
function MetaverseScene() {
  const { lands } = useGameStore()

  const terrainSize = 400

  // Compute a camera position scaled to terrain size so the scene frames well
  const cameraPos: [number, number, number] = [terrainSize * 0.12, terrainSize * 0.12, terrainSize * 0.18]

  return (
    <div className="metaverse-canvas">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: cameraPos, fov: 55 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ 
          antialias: true, 
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false
        }}
      >
        <Suspense fallback={null}>
          {/* Ultra-Realistic HDRI Environment */}
          <Environment 
            preset="sunset"
            background={false}
            backgroundBlurriness={0.3}
            backgroundIntensity={0.8}
            environmentIntensity={1.0}
          />
          
          {/* Photorealistic Atmospheric Sky */}
          <Sky 
            distance={800000}
            sunPosition={[180, 150, 100]}
            inclination={0.1}
            azimuth={0.15}
            rayleigh={1.2}
            turbidity={8}
            mieCoefficient={0.012}
            mieDirectionalG={0.85}
          />
          
          {/* Ultra-Dense Star Field */}
          <Stars 
            // reduced star count for performance while keeping density
            radius={800} 
            depth={120} 
            count={8000} 
            factor={8} 
            saturation={0.08} 
            fade 
            speed={0.6}
          />

          {/* Volumetric Atmospheric Fog */}
          <fog attach="fog" args={['#1a1a2e', 200, 1500]} />

          {/* Enhanced Lighting */}
          <Lighting />

          {/* Cyber Grid Floor */}
          {/* Terrain scaled to the same size used to compute camera framing */}
          <Terrain size={terrainSize} segments={200} />

          {/* Land Plots with Glow */}
          {lands.map((land) => (
            <LandPlot key={land.id} land={land} />
          ))}

          {/* Example model and player controller inside the scene */}
          <ModelLoader src="/models/astronaut.glb" scale={0.6} />
          <PlayerController />

          {/* Camera Controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            // scale max distance relative to terrain so zoom feels natural
            maxDistance={terrainSize * 0.9}
            maxPolarAngle={Math.PI / 2}
            autoRotate={false}
            autoRotateSpeed={0.5}
            makeDefault
          />

          {/* Post Processing Pipeline - Optimized for performance */}
          <EffectComposer multisampling={2}>
            <Bloom 
              intensity={0.6}
              luminanceThreshold={0.7}
              luminanceSmoothing={0.8}
              height={300}
              kernelSize={3}
              mipmapBlur={true}
            />
            
            <ToneMapping 
              adaptive={true}
              resolution={256}
              middleGrey={0.6}
              maxLuminance={16.0}
              averageLuminance={1.0}
              adaptationRate={1.5}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}

// Hero Section Content
function HeroContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [walletConnecting, setWalletConnecting] = useState(false)
  const wallet = useWallet()

  const connectWallet = async () => {
    setWalletConnecting(true)
    try {
      const result = await wallet.connectAndSign()
      if (result?.address) {
        setCurrentUser({ 
          address: result.address, 
          balance: Math.floor(Math.random() * 10000),
          ownedLands: [],
          avatar: { position: [0,0,0], color: '#ffffff' },
          achievements: []
        })
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setWalletConnecting(false)
    }
  }

  return (
    <div className="hero-content">
      <motion.div 
        className="hero-text"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1 className="hero-title">
          <span className="title-main">META</span>
          <span className="title-sub">THE WORLD</span>
        </h1>
        <p className="hero-subtitle">
          Enter the Ultimate Metaverse Experience
        </p>
        <p className="hero-description">
          Own virtual land, build your empire, trade NFTs, play casino games, 
          and earn real crypto rewards in our revolutionary blockchain metaverse.
        </p>
        
        <motion.div 
          className="hero-actions"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <button 
            className="btn-primary"
            onClick={connectWallet}
            disabled={walletConnecting}
          >
            {walletConnecting ? 'Connecting...' : 'Enter Metaverse'}
          </button>
          <button className="btn-secondary" onClick={() => window.open('https://youtube.com', '_blank')}>
            Watch Demo
          </button>
        </motion.div>

        {currentUser && (
          <motion.div 
            className="user-status"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="status-text">
              Connected: {currentUser.address.slice(0, 6)}...{currentUser.address.slice(-4)} | {currentUser.balance} MTW
            </span>
          </motion.div>
        )}
      </motion.div>

      <motion.div 
        className="hero-stats"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <div className="stat-item">
          <span className="stat-number">12,847</span>
          <span className="stat-label">Active Users</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">$2.8M</span>
          <span className="stat-label">Total Volume</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">847</span>
          <span className="stat-label">Lands Sold</span>
        </div>
      </motion.div>
    </div>
  )
}

function App() {
  const { fetchLands, syncBackend } = useGameStore()
  const { address } = useWallet()
  
  const sections = [
    { id: 'hero', name: 'Home' },
    { id: 'metaverse', name: 'Metaverse' },
    { id: 'land', name: 'Land NFTs' },
    { id: 'crypto', name: 'Crypto Hub' },
    { id: 'casino', name: 'Casino' },
    { id: 'earning', name: 'Earning' },
    { id: 'social', name: 'Social' },
    { id: 'customize', name: 'Customize' }
  ]

  const { currentSection, scrollToSection } = useScrollSections(sections)

  useEffect(() => {
    fetchLands()
  }, [fetchLands])

  useEffect(() => {
    if (address) {
      syncBackend()
    }
  }, [address, syncBackend])

  const sectionVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for "premium" feel
        staggerChildren: 0.2
      } 
    }
  }

  return (
    <WorldProvider>
      <div className="app-container">
      {/* Top Navigation */}
      <TopNav 
        currentSection={currentSection}
        onSectionChange={scrollToSection}
      />

      {/* Scroll Progress Indicators */}
      <ScrollProgress sections={sections} />

      {/* Hero Section */}
      <HeroSection 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <HeroContent />
      </HeroSection>

      {/* Metaverse Section - 3D Scene */}
      <MetaverseSection
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="section-header" variants={sectionVariants}>
          <h2 className="section-title">Experience the Metaverse</h2>
          <p className="section-subtitle">
            Immerse yourself in our ultra-realistic 3D world
          </p>
        </motion.div>
        <MetaverseScene />
        {/* Example placeholder model loaded into the scene (no hidden DOM needed) */}
      </MetaverseSection>

      {/* Land NFTs Section */}
      <LandSection
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="section-header" variants={sectionVariants}>
          <h2 className="section-title">Own Virtual Land</h2>
          <p className="section-subtitle">
            Buy, sell, and develop your digital real estate
          </p>
        </motion.div>
        <PremiumUI cryptoData={{
          ethPrice: 3247.82,
          landsSold: 847,
          totalRevenue: 2847291,
          activeUsers: 12847
        }} />
      </LandSection>

      {/* Crypto Hub Section */}
      <CryptoSection
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="section-header" variants={sectionVariants}>
          <h2 className="section-title">Crypto Trading Hub</h2>
          <p className="section-subtitle">
            Trade, stake, and earn with cryptocurrency
          </p>
        </motion.div>
        <CryptoHub isVisible={true} onClose={() => {}} />
      </CryptoSection>

      {/* Casino Section */}
      <CasinoSection
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="section-header" variants={sectionVariants}>
          <h2 className="section-title">Virtual Casino</h2>
          <p className="section-subtitle">
            Play games and win real crypto rewards
          </p>
        </motion.div>
        <CasinoHub isVisible={true} />
      </CasinoSection>

      {/* Earning Section */}
      <EarningSection
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="section-header" variants={sectionVariants}>
          <h2 className="section-title">Earn Rewards</h2>
          <p className="section-subtitle">
            Multiple ways to earn in the metaverse
          </p>
        </motion.div>
        <EarningHub isVisible={true} />
      </EarningSection>

      {/* Social Section */}
      <SocialSection
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="section-header" variants={sectionVariants}>
          <h2 className="section-title">Social Universe</h2>
          <p className="section-subtitle">
            Connect, chat, and socialize with others
          </p>
        </motion.div>
        <VirtualLife isVisible={true} />
      </SocialSection>

      {/* Customize Section */}
      <CustomizeSection
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="section-header" variants={sectionVariants}>
          <h2 className="section-title">Customize Everything</h2>
          <p className="section-subtitle">
            Personalize your avatar, vehicles, and properties
          </p>
        </motion.div>
        <CustomizationHub />
      </CustomizeSection>

      {/* Loading Screen */}
      <Suspense fallback={<Loader />} />
      </div>
    </WorldProvider>
  )
}

export default App
