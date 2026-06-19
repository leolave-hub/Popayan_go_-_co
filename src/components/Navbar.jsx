import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'Home',       to: '/' },
  { label: 'Calendario', to: '/calendario' },
  { label: 'Eventos',    to: '/eventos' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 70)
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  const isHome = pathname === '/'
  const glass = isHome && !scrolled

  return (
    <nav className={`navbar${glass ? ' navbar--glass' : ' navbar--solid'}`}>
      <Link to="/" className="navbar-logo">
        <span className="navbar-logo-dot" />
        Popayán Go
      </Link>

      <div className="navbar-links">
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

        <Link
          to="/secretaria"
          className={`nav-link nav-link--admin${pathname.startsWith('/secretaria') ? ' nav-link--active' : ''}`}
        >
          Secretaría
        </Link>
      </div>
    </nav>
  )
}
