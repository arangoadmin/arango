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
        <span className="contact-phone">+351 291 969 450</span>
        <span className="contact-sep" aria-hidden="true">|</span>
        <span className="contact-email">geral@arango.pt</span>
      </div>
    </header>
  )
}
