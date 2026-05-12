import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sphere } from '@react-three/drei'
import { useGameStore } from '../store'
import type { Land, Building } from '../store'
import * as THREE from 'three'

interface LandPlotProps {
  land: Land
}

const BuildingComponent: React.FC<{ building: Building }> = ({ building }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  const getBuildingGeometry = () => {
    switch (building.type) {
      case 'skyscraper':
        return <boxGeometry args={[0.8, 3 + building.level, 0.8]} />
      case 'house':
        return <boxGeometry args={[1, 1 + building.level * 0.3, 1]} />
      case 'shop':
        return <boxGeometry args={[1.2, 1.5, 0.8]} />
      case 'factory':
        return <boxGeometry args={[1.5, 2, 1.5]} />
      case 'landmark':
        return <sphereGeometry args={[0.8, 16, 16]} />
      default:
        return <boxGeometry args={[0.5, 0.5, 0.5]} />
    }
  }

  const getBuildingColor = () => {
    switch (building.type) {
      case 'skyscraper': return '#4a90e2'
      case 'house': return '#8b4513'
      case 'shop': return '#ffa500'
      case 'factory': return '#696969'
      case 'landmark': return '#ffd700'
      default: return '#cccccc'
    }
  }

  return (
    <mesh ref={meshRef} position={building.position}>
      {getBuildingGeometry()}
      <meshStandardMaterial 
        color={getBuildingColor()} 
        roughness={0.3}
        metalness={building.type === 'skyscraper' ? 0.8 : 0.1}
      />
    </mesh>
  )
}

export const LandPlot: React.FC<LandPlotProps> = ({ land }) => {
  const { selectLand, selectedLand, currentUser } = useGameStore()
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = React.useState(false)

  useFrame((state) => {
    if (meshRef.current && selectedLand?.id === land.id) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  const getLandColor = () => {
    if (selectedLand?.id === land.id) return '#ffff00'
    if (hovered) return '#00ff00'
    if (land.owner) return land.owner === currentUser?.address ? '#0080ff' : '#ff4444'
    
    switch (land.type) {
      case 'residential': return '#90EE90'
      case 'commercial': return '#FFD700'
      case 'industrial': return '#A0A0A0'
      case 'park': return '#228B22'
      case 'beach': return '#F4A460'
      case 'mountain': return '#8B7355'
      default: return '#90EE90'
    }
  }

  const getLandHeight = () => {
    switch (land.type) {
      case 'mountain': return 1.5
      case 'beach': return 0.1
      default: return 0.3
    }
  }

  return (
    <group position={land.position}>
      {/* Land Plot */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => selectLand(selectedLand?.id === land.id ? null : land)}
        scale={hovered ? 1.05 : 1}
      >
        <boxGeometry args={[3.8, getLandHeight(), 3.8]} />
        <meshStandardMaterial 
          color={getLandColor()} 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Land Border */}
      <mesh position={[0, getLandHeight() / 2 + 0.01, 0]}>
        <ringGeometry args={[1.8, 1.95, 32]} />
        <meshBasicMaterial 
          color={land.owner ? '#ffffff' : '#333333'}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Buildings */}
      {land.buildings.map((building) => (
        <BuildingComponent key={building.id} building={building} />
      ))}

      {/* Land ID Text */}
      <Text
        position={[0, getLandHeight() + 0.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        #{land.id}
      </Text>

      {/* Price Tag for unowned land */}
      {!land.owner && (
        <Text
          position={[0, getLandHeight() + 0.8, 0]}
          fontSize={0.15}
          color="#ffff00"
          anchorX="center"
          anchorY="middle"
        >
          ${land.price} ETH
        </Text>
      )}

      {/* Resource Indicator */}
      {land.resources > 50 && (
        <Sphere position={[1.5, getLandHeight() + 0.3, 1.5]} args={[0.1, 16, 16]}>
          <meshStandardMaterial color="#00ff00" emissive="#004400" />
        </Sphere>
      )}
    </group>
  )
}
