import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { featuredWorks } from '../data/featuredWorks'

const SECTION_KEYS = ['madeira', 'portugal', 'venezuela']

export default function WorksViewer() {
  const { lang } = useLanguage()
  const [activeSection, setActiveSection] = useState('madeira')
  const [photoIndex, setPhotoIndex] = useState(0)
  const [thumbScroll, setThumbScroll] = useState({ previous: false, next: false })
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const thumbsListRef = useRef(null)
  const lightboxRef = useRef(null)
  const closeButtonRef = useRef(null)
  const photoTriggerRef = useRef(null)
  const touchStartRef = useRef(null)

  const currentSectionData = featuredWorks[activeSection] || featuredWorks.madeira
  const works = currentSectionData.works
  const currentWork = works[photoIndex] || works[0]

  useEffect(() => {
    const list = thumbsListRef.current
    if (list) list.scrollLeft = 0
  }, [activeSection])

  useEffect(() => {
    const list = thumbsListRef.current
    if (!list) return

    const updateThumbScroll = () => {
      const previous = list.scrollLeft > 1
      const next = list.scrollLeft + list.clientWidth < list.scrollWidth - 1
      setThumbScroll((current) => (
        current.previous === previous && current.next === next ? current : { previous, next }
      ))
    }

    const revealSelectedThumb = () => {
      const selected = list.children[photoIndex]
      if (selected) {
        const bounds = list.getBoundingClientRect()
        const thumb = selected.getBoundingClientRect()
        if (thumb.left < bounds.left + 2) {
          list.scrollBy({ left: thumb.left - bounds.left - 2, behavior: 'instant' })
        } else if (thumb.right > bounds.right - 2) {
          list.scrollBy({ left: thumb.right - bounds.right + 2, behavior: 'instant' })
        }
      }
      updateThumbScroll()
    }

    const handleWheel = (event) => {
      if (event.ctrlKey || event.deltaX !== 0 || event.deltaY === 0 || list.scrollWidth <= list.clientWidth) return
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? list.clientWidth : 1
      event.preventDefault()
      list.scrollBy({ left: event.deltaY * unit, behavior: 'instant' })
    }

    const observer = new ResizeObserver(revealSelectedThumb)
    observer.observe(list)
    list.addEventListener('scroll', updateThumbScroll)
    list.addEventListener('wheel', handleWheel, { passive: false })
    revealSelectedThumb()

    return () => {
      observer.disconnect()
      list.removeEventListener('scroll', updateThumbScroll)
      list.removeEventListener('wheel', handleWheel)
    }
  }, [activeSection, photoIndex])

  const handleScrollThumbs = (direction) => {
    const list = thumbsListRef.current
    list.scrollBy({ left: direction * list.clientWidth, behavior: 'instant' })
  }

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

    const dialog = lightboxRef.current
    const photoTrigger = photoTriggerRef.current
    const previousOverflow = [document.documentElement, document.body].flatMap((element) => (
      ['overflow-x', 'overflow-y'].map((property) => ({
        element,
        property,
        value: element.style.getPropertyValue(property),
        priority: element.style.getPropertyPriority(property)
      }))
    ))

    previousOverflow.forEach(({ element, property }) => element.style.setProperty(property, 'hidden'))
    dialog.showModal()
    closeButtonRef.current.focus({ preventScroll: true })

    return () => {
      if (dialog.open) dialog.close()
      previousOverflow.forEach(({ element, property, value, priority }) => {
        element.style.setProperty(property, value, priority)
      })
      touchStartRef.current = null
      if (photoTrigger.isConnected) photoTrigger.focus({ preventScroll: true })
    }
  }, [isLightboxOpen])

  const handleLightboxKeyDown = (e) => {
    if (e.key === 'ArrowLeft' && works.length > 1) {
      e.preventDefault()
      handlePrevPhoto()
    } else if (e.key === 'ArrowRight' && works.length > 1) {
      e.preventDefault()
      handleNextPhoto()
    }
  }

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
      <section className="works-viewer" aria-label={lang === 'en' ? 'Featured projects' : 'Obras de referência'}>
        <div className="viewer-header">
          <span className="viewer-kicker">
            {lang === 'en' ? 'Featured Projects' : 'Obras de Referência'}
          </span>
          <div className="section-tabs" role="tablist" aria-label={lang === 'en' ? 'Project sections' : 'Secções de obras'}>
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

        <div className="viewer-body">
          <div
            className="photo-stage clickable"
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
            <button ref={photoTriggerRef} type="button" className="photo-enlarge" aria-label={lang === 'en' ? 'Enlarge photo' : 'Ver fotografia maior'} onClick={() => setIsLightboxOpen(true)} />
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
              <div className="stage-navigation">
                <button type="button" className="thumb-nav-arrow" aria-label={lang === 'en' ? 'Previous photo' : 'Fotografia anterior'} onClick={(e) => { e.stopPropagation(); handlePrevPhoto() }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <button type="button" className="thumb-nav-arrow" aria-label={lang === 'en' ? 'Next photo' : 'Fotografia seguinte'} onClick={(e) => { e.stopPropagation(); handleNextPhoto() }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
            )}
            {works.length > 1 && (
              <span
                className="stage-counter"
                aria-label={lang === 'en' ? `Photo ${photoIndex + 1} of ${works.length}` : `Fotografia ${photoIndex + 1} de ${works.length}`}
              >
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
            </div>

            {works.length > 1 && (
              <div className="caption-controls">
                <span className="thumbs-title">
                  {lang === 'en' ? 'Photographs:' : 'Fotografias:'}
                </span>
                <div className="thumbs-row">
                  {(thumbScroll.previous || thumbScroll.next) && (
                    <button
                      type="button"
                      className="thumb-nav-arrow prev"
                      aria-label={lang === 'en' ? 'Previous photographs' : 'Fotografias anteriores'}
                      onClick={() => handleScrollThumbs(-1)}
                      disabled={!thumbScroll.previous}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                  )}

                  <div ref={thumbsListRef} className="thumbs-list" role="tablist" aria-label={lang === 'en' ? 'Project photographs' : 'Fotografias da obra'}>
                    {works.map((work, actualIndex) => (
                      <button
                        key={work.id}
                        type="button"
                        role="tab"
                        aria-selected={actualIndex === photoIndex}
                        aria-label={`${work.title[lang] || work.title.pt} (${actualIndex + 1})`}
                        className={`thumb-btn ${actualIndex === photoIndex ? 'active' : ''}`}
                        onClick={() => setPhotoIndex(actualIndex)}
                      >
                        <img
                          src={work.imageWebp || work.imageJpg}
                          alt=""
                          aria-hidden="true"
                          className="thumb-img"
                        />
                      </button>
                    ))}
                  </div>

                  {(thumbScroll.previous || thumbScroll.next) && (
                    <button
                      type="button"
                      className="thumb-nav-arrow next"
                      aria-label={lang === 'en' ? 'Next photographs' : 'Fotografias seguintes'}
                      onClick={() => handleScrollThumbs(1)}
                      disabled={!thumbScroll.next}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <dialog
        ref={lightboxRef}
        className="lightbox-overlay"
        aria-label={currentWork.title[lang] || currentWork.title.pt}
        onCancel={() => setIsLightboxOpen(false)}
        onClose={(e) => {
          if (!e.currentTarget.open) setIsLightboxOpen(false)
        }}
        onKeyDown={handleLightboxKeyDown}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsLightboxOpen(false)
        }}
      >
        <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
          <button
            ref={closeButtonRef}
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
          </div>
        </div>
      </dialog>
    </>
  )
}
