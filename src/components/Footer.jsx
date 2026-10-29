import { useLanguage } from '../context/LanguageContext'
import { content } from '../data/content'
import { slides } from '../data/slides'

export default function Footer({ currentSlide, onSelectSlide }) {
  const { lang } = useLanguage()
  const t = content[lang] || content.pt
  const activeSlide = slides[currentSlide] || slides[0]

  return (
    <footer className="site-footer">
      <div className="footer-company">
        <strong className="footer-company-name">{t.companyLegal}</strong>
        <span className="footer-divider" aria-hidden="true">|</span>
        <span className="footer-location">{t.facilitiesValue}</span>
      </div>

      <div className="slideshow-controls" role="region" aria-label="Fotografias de obras em destaque">
        <div className="caption-indicator">
          <span className="caption-name">{activeSlide.caption?.[lang] || activeSlide.caption?.pt || activeSlide.caption}</span>
        </div>

        <div className="indicators-track" role="presentation">
          {slides.map((slide, idx) => (
            <span
              key={slide.id}
              className={`indicator-bar ${idx === currentSlide ? 'active' : ''}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </footer>
  )
}
