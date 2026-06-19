import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'Inicio',     to: '/' },
  { label: 'Eventos',    to: '/eventos' },
  { label: 'Calendario', to: '/calendario' },
]

const IconSearch = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

const IconClose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function Navbar({ onSearchOpen }) {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 70)
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isHome = pathname === '/'
  const glass = isHome && !scrolled && !menuOpen

  return (
    <>
      <nav className={`navbar${glass ? ' navbar--glass' : ' navbar--solid'}`}>
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-dot" />
          Pubenza
        </Link>

        {/* Desktop links */}
        <div className="navbar-links navbar-links--desktop">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link${pathname === to ? ' nav-link--active' : ''}`}
            >
              {label}
            </Link>
          ))}

          <span className="navbar-sep" />

          <button
            className="nav-search-btn"
            onClick={onSearchOpen}
            aria-label="Buscar"
          >
            <IconSearch />
            <span>Buscar</span>
          </button>
        </div>

        {/* Mobile controls */}
        <div className="navbar-mobile-controls">
          <button className="nav-icon-btn" onClick={onSearchOpen} aria-label="Buscar">
            <IconSearch />
          </button>
          <button className="nav-icon-btn" onClick={() => setMenuOpen(o => !o)} aria-label="Menú">
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-links">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`mobile-menu-link${pathname === to ? ' active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="mobile-menu-footer">
            <Link to="/registro" className="mobile-menu-cta" onClick={() => setMenuOpen(false)}>
              Registro de turista
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
