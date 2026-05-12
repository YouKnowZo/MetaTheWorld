import { useState, useEffect, useCallback, useRef } from 'react'

interface ScrollSection {
  id: string
  name: string
}

export const useScrollSections = (sections: ScrollSection[]) => {
  const [currentSection, setCurrentSection] = useState<string>(sections[0]?.id || '')
  const [scrollProgress, setScrollProgress] = useState(0)
  const isScrollingRef = useRef(false)

  // Update scroll progress (kept as scroll listener but throtled/passive)
  const updateScrollProgress = useCallback(() => {
    const scrollTop = window.pageYOffset
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
    setScrollProgress(progress)
  }, [])

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      isScrollingRef.current = true
      setCurrentSection(sectionId)
      
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      // Reset scrolling flag after animation
      setTimeout(() => {
        isScrollingRef.current = false
      }, 1000)
    }
  }, [])

  const scrollToNext = useCallback(() => {
    const currentIndex = sections.findIndex(s => s.id === currentSection)
    if (currentIndex < sections.length - 1) {
      scrollToSection(sections[currentIndex + 1].id)
    }
  }, [currentSection, sections, scrollToSection])

  const scrollToPrevious = useCallback(() => {
    const currentIndex = sections.findIndex(s => s.id === currentSection)
    if (currentIndex > 0) {
      scrollToSection(sections[currentIndex - 1].id)
    }
  }, [currentSection, sections, scrollToSection])

  // Section visibility detection using IntersectionObserver
  useEffect(() => {
    const observers = new Map<string, IntersectionObserver>()

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          if (isScrollingRef.current) return
          
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
              setCurrentSection(section.id)
            }
          })
        },
        { threshold: [0, 0.4, 0.8] }
      )

      observer.observe(element)
      observers.set(section.id, observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [sections])

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateScrollProgress()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [updateScrollProgress])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && (e.altKey || e.ctrlKey)) {
        e.preventDefault()
        scrollToNext()
      } else if (e.key === 'ArrowUp' && (e.altKey || e.ctrlKey)) {
        e.preventDefault()
        scrollToPrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [scrollToNext, scrollToPrevious])

  return {
    currentSection,
    scrollProgress,
    scrollToSection,
    scrollToNext,
    scrollToPrevious,
    sections
  }
}
