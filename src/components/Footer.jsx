import { slides } from '../data/slides'

export default function Footer({ currentSlide, onSelectSlide }) {
  const activeSlide = slides[currentSlide] || slides[0]

  return (
    <footer className="site-footer">
      <div className="footer-company">
        <strong>Arango, Estruturas e Moldagens de Varão, Lda.</strong>
        <span className="footer-divider" aria-hidden="true">|</span>
        <span>Zona Franca Industrial da Madeira, Caniçal</span>
      </div>

      <div className="slideshow-controls" role="region" aria-label="Fotografias de obras em destaque">
        <div className="caption-indicator">
          <span className="caption-name">{activeSlide.caption?.pt || activeSlide.caption}</span>
        </div>

        <div className="indicators-track" aria-label="Selecionar fotografia">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              className={`indicator-bar ${idx === currentSlide ? 'active' : ''}`}
              aria-label={`Fotografia ${idx + 1}`}
              aria-current={idx === currentSlide ? 'true' : undefined}
              onClick={() => onSelectSlide(idx)}
            />
          ))}
        </div>
      </div>
    </footer>
  )
}
