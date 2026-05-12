import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sky, Environment } from '@react-three/drei'
import { SimpleTerrain } from './components/SimpleTerrain'
import './App.css'

function App() {
  return (
    <div className="app">
      <Canvas
        shadows
        camera={{ position: [50, 50, 50], fov: 60 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Basic lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight 
            position={[100, 100, 50]} 
            intensity={1} 
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={500}
            shadow-camera-left={-200}
            shadow-camera-right={200}
            shadow-camera-top={200}
            shadow-camera-bottom={-200}
          />
          
          {/* Environment */}
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="sunset" />
          
          {/* Simple terrain */}
          <SimpleTerrain size={200} segments={50} />
          
          {/* Controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={200}
          />
        </Suspense>
      </Canvas>
      
      <div className="ui-overlay">
        <h1>Meta The World - Testing</h1>
        <p>If you see this text and the 3D scene above, the app is working!</p>
      </div>
    </div>
  )
}

export default App
