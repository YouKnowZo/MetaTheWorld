import { useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky } from '@react-three/drei'
import { useGameStore } from './store'
import { UI } from './components/UI'
import './App.css'

// Simple 3D Box for testing
function TestBox() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

function App() {
  const { generateWorld, setCurrentUser } = useGameStore()

  useEffect(() => {
    // Initialize the game world
    generateWorld()
    
    // Initialize demo user
    setCurrentUser({
      address: '0x1234...5678',
      balance: 10000,
      ownedLands: [],
      avatar: {
        position: [0, 5, 0],
        color: '#00d4ff'
      },
      achievements: ['First Login', 'World Explorer']
    })
  }, [generateWorld, setCurrentUser])

  return (
    <>
      <div className="canvas-container">
        <Canvas
          shadows
          camera={{ position: [10, 10, 10], fov: 75 }}
          gl={{ 
            antialias: true, 
            alpha: false,
            powerPreference: "high-performance"
          }}
        >
          <Suspense fallback={null}>
            <Sky sunPosition={[100, 20, 100]} />
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <TestBox />
          </Suspense>
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
          />
        </Canvas>
      </div>

      <UI />

      {/* Loading indicator */}
      <div className="loading-indicator">
        <div className="loading-spinner"></div>
        <p>Loading Meta The World...</p>
      </div>
    </>
  )
}

export default App
