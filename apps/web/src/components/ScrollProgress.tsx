import { motion } from 'framer-motion'
import { useScrollSections } from '../hooks/useScrollSections'
import './ScrollProgress.css'

interface ScrollProgressProps {
  sections: Array<{ id: string; name: string }>
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ sections }) => {
  const { currentSection, scrollProgress, scrollToSection } = useScrollSections(sections)

  return (
    <>
      {/* Progress Bar */}
      <div className="scroll-progress-bar">
        <motion.div 
          className="progress-fill"
          style={{ width: `${scrollProgress}%` }}
          transition={{ type: "tween", ease: "linear" }}
        />
      </div>

      {/* Section Dots */}
      <div className="scroll-dots">
        {sections.map((section, index) => (
          <motion.button
            key={section.id}
            className={`scroll-dot ${currentSection === section.id ? 'active' : ''}`}
            onClick={() => scrollToSection(section.id)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: 1, 
              x: 0
            }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
          >
            <span className="dot-tooltip">{section.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Scroll Hint */}
      <motion.div
        className="scroll-hint"
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
          opacity: scrollProgress > 5 ? 0 : 1,
          y: scrollProgress > 5 ? 20 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="scroll-hint-text">Scroll Down</div>
        <div className="scroll-hint-arrow">↓</div>
      </motion.div>
    </>
  )
}
