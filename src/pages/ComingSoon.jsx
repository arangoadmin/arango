import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Countdown from '../components/Countdown'
import { slides } from '../data/slides'

export default function ComingSoon() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {/* Background Slideshow Layer */}
      <div className="slideshow-viewport" aria-hidden="true">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`slide-item ${idx === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url('${slide.imageWebp}'), url('${slide.imageJpg}')`
            }}
          />
        ))}
        <div className="slideshow-overlay" />
      </div>

      {/* Foreground Container */}
      <div className="page-container">
        <Header />

        <main className="hero-content">
          <div className="section-badge">
            <span className="badge-text">Construção Civil & Obras Públicas</span>
          </div>

          <h1 className="hero-title">
            O novo website oficial<br />está a chegar.
          </h1>

          <p className="hero-description">
            Mais de duas décadas a produzir, moldar e armar varão de aço para obras de referência na Região.
          </p>

          <Countdown />
        </main>

        <Footer
          currentSlide={currentSlide}
          onSelectSlide={idx => setCurrentSlide(idx)}
        />
      </div>
    </>
  )
}
