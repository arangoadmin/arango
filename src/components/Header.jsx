import { useEffect, useRef, useState } from 'react'
import { content } from '../data/content'

/** @returns {import('react').ReactElement} */
export default function Header() {
  const { phone, email } = content.pt
  const [activeContact, setActiveContact] = useState(
    /** @type {{ label: string, value: string } | null} */ (null)
  )
  const contactDialogRef = useRef(/** @type {HTMLDialogElement | null} */ (null))

  useEffect(() => {
    if (activeContact && contactDialogRef.current && !contactDialogRef.current.open) {
      contactDialogRef.current.showModal()
    }
  }, [activeContact])

  /** @param {import('react').MouseEvent<HTMLDialogElement>} event */
  function handleBackdropClick(event) {
    if (event.target !== event.currentTarget) return

    const dialog = event.currentTarget
    const bounds = dialog.getBoundingClientRect()
    if (
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    ) {
      dialog.close()
    }
  }

  return (
    <header className="site-header">
      <div className="brand-group">
        <div className="brand-logo">
          <img src="/images/logo-arango-white.png" alt="Arango" className="brand-logo-img" />
        </div>
        <div className="brand-sub">
          <span>Desde 2002</span>
          <span className="sep" aria-hidden="true">|</span>
          <span>Região Autónoma da Madeira</span>
        </div>
      </div>

      <div className="header-contact" aria-label="Contactos">
        <button
          type="button"
          className="contact-phone"
          aria-label={`${phone}, ver número de telefone`}
          aria-haspopup="dialog"
          onClick={() => setActiveContact({ label: 'Telefone', value: phone })}
        >
          <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.91-8.67A2 2 0 0 1 3.26 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.79a2 2 0 0 1-.45 2.11L7.23 8.89a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.89.33 1.83.56 2.79.69A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="contact-text">{phone}</span>
        </button>
        <span className="contact-sep" aria-hidden="true">|</span>
        <button
          type="button"
          className="contact-email"
          aria-label={`${email}, ver endereço de email`}
          aria-haspopup="dialog"
          onClick={() => setActiveContact({ label: 'Email', value: email })}
        >
          <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          <span className="contact-text">{email}</span>
        </button>
      </div>

      <dialog
        ref={contactDialogRef}
        className="contact-dialog"
        aria-labelledby="contact-dialog-title"
        onClose={() => setActiveContact(null)}
        onClick={handleBackdropClick}
      >
        <div className="contact-dialog-header">
          <h2 id="contact-dialog-title">{activeContact?.label}</h2>
          <button
            type="button"
            className="contact-dialog-close"
            aria-label="Fechar"
            autoFocus
            onClick={() => contactDialogRef.current?.close()}
          >
            &times;
          </button>
        </div>
        <p className="contact-dialog-value">{activeContact?.value}</p>
      </dialog>
    </header>
  )
}
