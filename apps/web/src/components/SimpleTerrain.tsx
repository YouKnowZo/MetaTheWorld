import React, { useMemo } from 'react'
import { createNoise2D } from 'simplex-noise'
import * as THREE from 'three'

interface SimpleTerrainProps {
  size: number
  segments: number
}

export const SimpleTerrain: React.FC<SimpleTerrainProps> = ({ size = 400, segments = 100 }) => {
  const { geometry, material } = useMemo(() => {
    const noise2D = createNoise2D()
    const geo = new THREE.PlaneGeometry(size, size, segments, segments)
    
    const vertices = geo.attributes.position.array as Float32Array
    
    // Simple terrain generation
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      
      // Basic height variation
      const height = noise2D(x * 0.01, y * 0.01) * 8
      vertices[i + 2] = height
    }
    
    geo.attributes.position.needsUpdate = true
    geo.computeVertexNormals()
    
    // Simple material
    const mat = new THREE.MeshStandardMaterial({
      color: '#2d5a3d',
      roughness: 0.8,
      metalness: 0.1,
      wireframe: false
    })
    
    return { geometry: geo, material: mat }
  }, [size, segments])

  return (
    <mesh 
      geometry={geometry} 
      material={material}
      rotation-x={-Math.PI / 2}
      receiveShadow
      castShadow
    />
  )
}
