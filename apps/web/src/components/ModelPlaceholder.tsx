import React from 'react'

export const ModelPlaceholder: React.FC<{ size?: number; color?: string }> = ({ size = 1, color = '#888' }) => {
  return (
    <div className="model-placeholder" style={{ backgroundColor: color, width: size * 10, height: size * 10 }}>
      Model
    </div>
  )
}

export default ModelPlaceholder
