import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { featuredWorks } from '../data/featuredWorks'

const SECTION_KEYS = ['hospital', 'laguaira', 'savoy']

export default function WorksViewer() {
  const { lang } = useLanguage()
  const [activeSection, setActiveSection] = useState('hospital')
  const [photoIndex, setPhotoIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const touchStartRef = useRef(null)

  const currentSectionData = featuredWorks[activeSection] || featuredWorks.hospital
  const works = currentSectionData.works
  const currentWork = works[photoIndex] || works[0]

  const handlePrevPhoto = () => {
    if (works.length <= 1) return
    setPhotoIndex((prev) => (prev - 1 + works.length) % works.length)
  }

  const handleNextPhoto = () => {
    if (works.length <= 1) return
    setPhotoIndex((prev) => (prev + 1) % works.length)
  }

  useEffect(() => {
    if (!isLightboxOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false)
      } else if (e.key === 'ArrowLeft' && works.length > 1) {
        e.preventDefault()
        handlePrevPhoto()
      } else if (e.key === 'ArrowRight' && works.length > 1) {
        e.preventDefault()
        handleNextPhoto()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, works.length])

  const handleTouchStart = (e) => {
    if (works.length <= 1 || e.touches.length !== 1) return
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }

  const handleTouchEnd = (e) => {
    if (works.length <= 1 || !touchStartRef.current) return
    const diffX = e.changedTouches[0].clientX - touchStartRef.current.x
    const diffY = e.changedTouches[0].clientY - touchStartRef.current.y
    touchStartRef.current = null

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handlePrevPhoto()
      } else {
        handleNextPhoto()
      }
    }
  }

  const handleTouchCancel = () => {
    touchStartRef.current = null
  }

  const handleSelectSection = (key) => {
    setActiveSection(key)
    setPhotoIndex(0)
  }

  return (
    <>
      <section className="works-viewer" aria-label="Obras de referência">
        {/* Botões das três secções sem contadores numéricos */}
        <div className="viewer-header">
          <span className="viewer-kicker">
            {lang === 'en' ? 'Featured Projects' : 'Obras de Referência'}
          </span>
          <div className="section-tabs" role="tablist" aria-label="Secções de obras">
            {SECTION_KEYS.map((key) => {
              const section = featuredWorks[key]
              const isActive = key === activeSection
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`section-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectSection(key)}
                >
                  {section.label[lang] || section.label.pt}
                </button>
              )
            })}
          </div>
        </div>

        {/* Visualizador da Obra Ativa */}
        <div className="viewer-body">
          <div
            className="photo-stage clickable"
            role="button"
            tabIndex={0}
            aria-label={lang === 'en' ? 'Click to enlarge photo' : 'Clique para ver maior'}
            onClick={() => setIsLightboxOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setIsLightboxOpen(true)
              }
            }}
          >
            <picture>
              <source srcSet={currentWork.imageWebp} type="image/webp" />
              <img
                src={currentWork.imageJpg}
                alt={currentWork.title[lang] || currentWork.title.pt}
                className="stage-image"
                loading="lazy"
              />
            </picture>
            <span className="stage-zoom-hint" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              <span>{lang === 'en' ? 'Enlarge' : 'Ver maior'}</span>
            </span>
            {works.length > 1 && (
              <span className="stage-counter" aria-label={`Fotografia ${photoIndex + 1} de ${works.length}`}>
                {photoIndex + 1} / {works.length}
              </span>
            )}
          </div>

          <div className="caption-panel">
            <div className="caption-meta">
              <span className="caption-location">
                {currentWork.location[lang] || currentWork.location.pt}
              </span>
              <h3 className="caption-title">
                {currentWork.title[lang] || currentWork.title.pt}
              </h3>
              <p className="caption-description">
                {currentWork.caption[lang] || currentWork.caption.pt}
              </p>
            </div>

            {works.length > 1 && (
              <div className="caption-controls">
                <span className="thumbs-title">
                  {lang === 'en' ? 'Photographs:' : 'Fotografias:'}
                </span>
                <div className="thumbs-row">
                  <div className="thumbs-list" role="tablist" aria-label="Fotografias da obra">
                    {works.map((w, idx) => (
                      <button
                        key={w.id}
                        type="button"
                        role="tab"
                        aria-selected={idx === photoIndex}
                        aria-label={`${w.title[lang] || w.title.pt} (${idx + 1})`}
                        className={`thumb-btn ${idx === photoIndex ? 'active' : ''}`}
                        onClick={() => setPhotoIndex(idx)}
                      >
                        <img
                          src={w.imageWebp || w.imageJpg}
                          alt=""
                          aria-hidden="true"
                          className="thumb-img"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal / Lightbox para ver maior */}
      {isLightboxOpen && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={currentWork.title[lang] || currentWork.title.pt}
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close"
              aria-label={lang === 'en' ? 'Close' : 'Fechar'}
              onClick={() => setIsLightboxOpen(false)}
            >
              &times;
            </button>
            <div
              className="lightbox-image-wrap"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchCancel}
            >
              <picture>
                <source srcSet={currentWork.imageWebp} type="image/webp" />
                <img
                  src={currentWork.imageJpg}
                  alt={currentWork.title[lang] || currentWork.title.pt}
                  className="lightbox-image"
                />
              </picture>

              {works.length > 1 && (
                <>
                  <button
                    type="button"
                    className="lightbox-nav-btn prev"
                    aria-label={lang === 'en' ? 'Previous photo' : 'Fotografia anterior'}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePrevPhoto()
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="lightbox-nav-btn next"
                    aria-label={lang === 'en' ? 'Next photo' : 'Fotografia seguinte'}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNextPhoto()
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                  <span
                    className="stage-counter lightbox-counter"
                    aria-label={lang === 'en' ? `Photo ${photoIndex + 1} of ${works.length}` : `Fotografia ${photoIndex + 1} de ${works.length}`}
                  >
                    {photoIndex + 1} / {works.length}
                  </span>
                </>
              )}
            </div>
            <div className="lightbox-caption">
              <span className="lightbox-location">
                {currentWork.location[lang] || currentWork.location.pt}
              </span>
              <h4 className="lightbox-title">
                {currentWork.title[lang] || currentWork.title.pt}
              </h4>
              <p className="lightbox-description">
                {currentWork.caption[lang] || currentWork.caption.pt}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
