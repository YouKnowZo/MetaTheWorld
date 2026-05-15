import React from 'react'

interface TerrainProps {
  size: number
  segments: number
}

export const Terrain: React.FC<TerrainProps> = ({ size = 400, segments = 128 }) => {
  return (
    <div style={{ display: 'none' }} className="terrain-placeholder">
      Terrain placeholder
    </div>
  )
}

export default Terrain
