import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// import { useProgress } from '@react-three/drei'
// Mock hook since three dependencies are missing
const useProgress = () => {
  const [progress, setProgress] = React.useState(0);
  const [active, setActive] = React.useState(true);
  
  React.useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      if (current >= 100) {
        current = 100;
        setActive(false);
        clearInterval(interval);
      }
      setProgress(current);
    }, 200);
    return () => clearInterval(interval);
  }, []);
  
  return { active, progress };
}

export const PremiumMetaverseLoader: React.FC = () => {
  const { active, progress } = useProgress()

  return (
    <AnimatePresence>
      {(active || progress < 100) && (
        <motion.div
          className="premium-loader-overlay"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: 'blur(10px)',
            transition: { duration: 1.2, ease: "circOut" }
          }}
        >
          <div className="loader-content">
            <motion.div 
              className="loader-logo"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                textShadow: [
                  "0 0 10px #00ffff",
                  "0 0 30px #00ffff",
                  "0 0 10px #00ffff"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              META THE WORLD
            </motion.div>
            
            <div className="progress-container">
              <motion.div 
                className="progress-bar"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
              <div className="progress-glow" style={{ width: `${progress}%` }} />
            </div>
            
            <div className="loader-status">
              <motion.span
                key={Math.floor(progress / 10)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {progress < 30 && "INITIALIZING NEURAL GRID..."}
                {progress >= 30 && progress < 60 && "LOADING SPATIAL ASSETS..."}
                {progress >= 60 && progress < 90 && "CONSTRUCTING ENVIRONMENTS..."}
                {progress >= 90 && "SYNCHRONIZING..."}
              </motion.span>
              <span className="percent">{Math.round(progress)}%</span>
            </div>
          </div>
          
          <div className="scanning-line" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PremiumMetaverseLoader
