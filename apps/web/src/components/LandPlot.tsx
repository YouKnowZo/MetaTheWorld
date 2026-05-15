import React from 'react'
import type { Land, Building } from '../store'

interface LandPlotProps {
  land: Land
}

export const LandPlot: React.FC<LandPlotProps> = ({ land }) => {
  return (
    <div className="land-plot-placeholder" style={{ display: 'none' }}>
      {/* 3D features temporarily disabled due to build environment limits */}
      Land #{land.id}
    </div>
  )
}
