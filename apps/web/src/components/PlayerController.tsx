import React from 'react'

interface PlayerControllerProps {
  children?: React.ReactNode
  position?: [number, number, number]
}

export const PlayerController: React.FC<PlayerControllerProps> = ({ children, position = [0, 1.2, 0] }) => {
  return (
    <div style={{ display: 'none' }} className="player-controller-placeholder">
      {children}
    </div>
  )
}

export default PlayerController
