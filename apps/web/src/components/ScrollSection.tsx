import { motion } from 'framer-motion'
import type { HTMLMotionProps, Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import './ScrollSection.css'

interface ScrollSectionProps extends HTMLMotionProps<"section"> {
  id: string
  className?: string
  background?: 'dark' | 'gradient' | 'transparent' | 'glass'
  padding?: 'none' | 'small' | 'medium' | 'large'
  minHeight?: 'auto' | 'screen' | 'half'
  children: ReactNode
  variants?: Variants
}

export const ScrollSection: React.FC<ScrollSectionProps> = ({
  id,
  className = '',
  background = 'transparent',
  padding = 'large',
  minHeight = 'auto',
  children,
  ...motionProps
}) => {
  const backgroundClasses = {
    dark: 'bg-dark',
    gradient: 'bg-gradient',
    transparent: 'bg-transparent',
    glass: 'bg-glass'
  }

  const paddingClasses = {
    none: 'p-none',
    small: 'p-small',
    medium: 'p-medium',
    large: 'p-large'
  }

  const heightClasses = {
    auto: 'h-auto',
    screen: 'h-screen',
    half: 'h-half'
  }

  return (
    <motion.section
      id={id}
      className={`scroll-section ${backgroundClasses[background]} ${paddingClasses[padding]} ${heightClasses[minHeight]} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      {...motionProps}
    >
      <div className="section-container">
        {/* Superior Alignment: Consistent flex layout */}
        <div className="section-layout">
          {children}
        </div>
      </div>
    </motion.section>
  )
}

interface SpecializedSectionProps extends HTMLMotionProps<"section"> {
  children: ReactNode
  className?: string
  variants?: Variants
}

// Specialized sections
export const HeroSection: React.FC<SpecializedSectionProps> = ({ children, className = '', ...props }) => (
  <ScrollSection id="hero" background="gradient" minHeight="screen" className={`hero-section ${className}`} {...props}>
    {children}
  </ScrollSection>
)

export const MetaverseSection: React.FC<SpecializedSectionProps> = ({ children, className = '', ...props }) => (
  <ScrollSection id="metaverse" background="dark" minHeight="screen" className={`metaverse-section ${className}`} {...props}>
    {children}
  </ScrollSection>
)

export const LandSection: React.FC<SpecializedSectionProps> = ({ children, className = '', ...props }) => (
  <ScrollSection id="land" background="glass" minHeight="screen" className={`land-section ${className}`} {...props}>
    {children}
  </ScrollSection>
)

export const CryptoSection: React.FC<SpecializedSectionProps> = ({ children, className = '', ...props }) => (
  <ScrollSection id="crypto" background="gradient" minHeight="screen" className={`crypto-section ${className}`} {...props}>
    {children}
  </ScrollSection>
)

export const CasinoSection: React.FC<SpecializedSectionProps> = ({ children, className = '', ...props }) => (
  <ScrollSection id="casino" background="dark" minHeight="screen" className={`casino-section ${className}`} {...props}>
    {children}
  </ScrollSection>
)

export const EarningSection: React.FC<SpecializedSectionProps> = ({ children, className = '', ...props }) => (
  <ScrollSection id="earning" background="glass" minHeight="screen" className={`earning-section ${className}`} {...props}>
    {children}
  </ScrollSection>
)

export const SocialSection: React.FC<SpecializedSectionProps> = ({ children, className = '', ...props }) => (
  <ScrollSection id="social" background="gradient" minHeight="screen" className={`social-section ${className}`} {...props}>
    {children}
  </ScrollSection>
)

export const CustomizeSection: React.FC<SpecializedSectionProps> = ({ children, className = '', ...props }) => (
  <ScrollSection id="customize" background="dark" minHeight="screen" className={`customize-section ${className}`} {...props}>
    {children}
  </ScrollSection>
)
