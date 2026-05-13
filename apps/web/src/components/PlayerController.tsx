import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import React, { useRef } from 'react'

interface PlayerControllerProps {
  children?: React.ReactNode
  position?: [number, number, number]
}

export const PlayerController: React.FC<PlayerControllerProps> = ({ children, position = [0, 1.2, 0] }) => {
  const ref = useRef<THREE.Group | null>(null)

  useFrame((state) => {
    // simple idle bob on the player to indicate presence
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <group ref={ref} position={position}>
      {children}
      {/* small invisible helper, can be extended into first-person controls */}
      <mesh visible={false}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </group>
  )
}

export default PlayerController
