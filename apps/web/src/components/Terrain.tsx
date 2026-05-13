import React, { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { createNoise2D } from 'simplex-noise'
import * as THREE from 'three'

interface TerrainProps {
  size: number
  segments: number
}

export const Terrain: React.FC<TerrainProps> = ({ size = 400, segments = 128 }) => {
  const terrainRef = React.useRef<THREE.Mesh>(null)
  
  const { geometry, diffuseTexture, normalTexture, displacementTexture } = useMemo(() => {
    const noise2D = createNoise2D()
    const geo = new THREE.PlaneGeometry(size, size, segments, segments)
    
    const vertices = geo.attributes.position.array as Float32Array
    
    // Generate realistic terrain with stable noise
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      
      const height1 = noise2D(x * 0.008, y * 0.008) * 12
      const height2 = noise2D(x * 0.02, y * 0.02) * 4
      const finalHeight = (height1 + height2) * 0.05
      
      vertices[i + 2] = finalHeight
    }
    
    geo.attributes.position.needsUpdate = true
    geo.computeVertexNormals()
    
    // Optimization: Use smaller canvases for textures (512x512)
    const createTexCanvas = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      return canvas
    }

    const diffuseCanvas = createTexCanvas()
    const diffuseCtx = diffuseCanvas.getContext('2d')!
    
    const normalCanvas = createTexCanvas()
    const normalCtx = normalCanvas.getContext('2d')!
    
    const displacementCanvas = createTexCanvas()
    const displacementCtx = displacementCanvas.getContext('2d')!
    
    const diffuseImageData = diffuseCtx.createImageData(512, 512)
    const normalImageData = normalCtx.createImageData(512, 512)
    const displacementImageData = displacementCtx.createImageData(512, 512)
    
    for (let i = 0; i < diffuseImageData.data.length; i += 4) {
      const pixelIndex = i / 4
      const x = pixelIndex % 512
      const y = Math.floor(pixelIndex / 512)
      
      const height = noise2D(x * 0.01, y * 0.01) * 10
      const finalHeight = height
      
      if (finalHeight < -3) {
        diffuseImageData.data[i] = 15; diffuseImageData.data[i + 1] = 76; diffuseImageData.data[i + 2] = 129
      } else if (finalHeight < 0.5) {
        diffuseImageData.data[i] = 238; diffuseImageData.data[i + 1] = 203; diffuseImageData.data[i + 2] = 173
      } else if (finalHeight < 6) {
        diffuseImageData.data[i] = 34; diffuseImageData.data[i + 1] = 139; diffuseImageData.data[i + 2] = 34
      } else {
        diffuseImageData.data[i] = 240; diffuseImageData.data[i + 1] = 248; diffuseImageData.data[i + 2] = 255
      }
      
      diffuseImageData.data[i + 3] = 255
      
      const hNorm = (finalHeight + 10) / 20 * 255
      normalImageData.data[i] = 128
      normalImageData.data[i + 1] = 128
      normalImageData.data[i + 2] = hNorm
      normalImageData.data[i + 3] = 255
      
      displacementImageData.data[i] = hNorm
      displacementImageData.data[i + 1] = hNorm
      displacementImageData.data[i + 2] = hNorm
      displacementImageData.data[i + 3] = 255
    }
    
    diffuseCtx.putImageData(diffuseImageData, 0, 0)
    normalCtx.putImageData(normalImageData, 0, 0)
    displacementCtx.putImageData(displacementImageData, 0, 0)
    
    const diffTex = new THREE.CanvasTexture(diffuseCanvas)
    const normTex = new THREE.CanvasTexture(normalCanvas)
    const dispTex = new THREE.CanvasTexture(displacementCanvas)
    
    const textures = [diffTex, normTex, dispTex]
    textures.forEach((tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
      tex.repeat.set(4, 4)
      tex.minFilter = THREE.LinearFilter
    })
    
    return { 
      geometry: geo, 
      diffuseTexture: diffTex,
      normalTexture: normTex,
      displacementTexture: dispTex
    }
  }, [size, segments])

  // Disposal to prevent memory leaks
  React.useEffect(() => {
    return () => {
      geometry.dispose()
      diffuseTexture.dispose()
      normalTexture.dispose()
      displacementTexture.dispose()
    }
  }, [geometry, diffuseTexture, normalTexture, displacementTexture])

  useFrame((state) => {
    if (terrainRef.current && terrainRef.current.material instanceof THREE.MeshStandardMaterial) {
      const time = state.clock.elapsedTime
      // Throttle update slightly or use a smoother curve
      terrainRef.current.material.displacementScale = 0.5 + Math.sin(time * 0.1) * 0.05
    }
  })

  return (
    <>
      {/* Main terrain mesh */}
      <mesh ref={terrainRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <primitive object={geometry} />
        <meshStandardMaterial
          map={diffuseTexture}
          normalMap={normalTexture}
          displacementMap={displacementTexture}
          displacementScale={0.5}
          roughness={0.9}
          metalness={0.05}
          envMapIntensity={0.3}
        />
      </mesh>
      
      {/* Underwater caustics effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <planeGeometry args={[size * 0.8, size * 0.8]} />
        <meshBasicMaterial
          color="#00aaff"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Atmospheric fog plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 10, 0]}>
        <planeGeometry args={[size * 2, size * 2]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  )
}
