export default function Header() {
  return (
    <header className="site-header">
      <div className="brand-group">
        <a href="#" className="brand-logo" aria-label="Arango - Página Inicial">
          <img src="/images/logo-arango-white.png" alt="Arango" className="brand-logo-img" />
        </a>
        <div className="brand-sub">
          <span>Desde 2002</span>
          <span className="sep" aria-hidden="true">|</span>
          <span>Região Autónoma da Madeira</span>
        </div>
      </div>

      <div className="header-contact" aria-label="Contactos">
        <a href="tel:+351291969450" className="contact-link contact-phone" title="Ligar para +351 291 969 450">
          <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span className="contact-text">+351 291 969 450</span>
        </a>
        <span className="contact-sep" aria-hidden="true">|</span>
        <a href="mailto:geral@arango.pt" className="contact-link contact-email" title="Enviar email para geral@arango.pt">
          <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          <span className="contact-text">geral@arango.pt</span>
        </a>
      </div>
    </header>
  )
}
