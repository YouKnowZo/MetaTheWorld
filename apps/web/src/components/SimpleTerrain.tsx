import React from 'react'

interface SimpleTerrainProps {
  size: number
  segments: number
}

export const SimpleTerrain: React.FC<SimpleTerrainProps> = ({ size = 400, segments = 100 }) => {
  return (
    <div style={{ display: 'none' }} className="simple-terrain-placeholder">
      Terrain placeholder
    </div>
  )
}

export default SimpleTerrain
