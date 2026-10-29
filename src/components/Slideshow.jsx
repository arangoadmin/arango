import { useState, useEffect } from 'react'
import { slides } from '../data/slides'
import { useLanguage } from '../context/LanguageContext'

export default function Slideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { lang } = useLanguage()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div className="slideshow-viewport" aria-hidden="true">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`slide-item ${idx === currentIndex ? 'active' : ''}`}
            style={{
              backgroundImage: `url('${slide.imageWebp}'), url('${slide.imageJpg}')`
            }}
          />
        ))}
        <div className="slideshow-overlay" />
      </div>

      {/* Floating Widget Controls mounted at footer level via context/props if needed */}
    </>
  )
}
