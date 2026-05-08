import React, { createContext, useContext, useState } from 'react'

type WorldContextType = {
  timeOfDay: number
  setTimeOfDay: (t: number) => void
}

const WorldContext = createContext<WorldContextType | null>(null)

export const WorldProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [timeOfDay, setTimeOfDay] = useState<number>(12)

  return (
    <WorldContext.Provider value={{ timeOfDay, setTimeOfDay }}>
      {children}
    </WorldContext.Provider>
  )
}

export const useWorld = () => {
  const ctx = useContext(WorldContext)
  if (!ctx) throw new Error('useWorld must be used within WorldProvider')
  return ctx
}

export default WorldProvider
