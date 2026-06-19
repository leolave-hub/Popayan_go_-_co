import { Link } from 'react-router-dom'
import './Footer.css'

const IconIG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const IconFB = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const IconYT = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20.06 12 20.06 12 20.06s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
)

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-dot" />
            Pubenza
          </Link>
          <p className="footer-tagline">
            La plataforma oficial de turismo<br />de la Ciudad Blanca de Colombia
          </p>
          <div className="footer-socials">
            <a href="#" className="footer-social" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><IconIG /></a>
            <a href="#" className="footer-social" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><IconFB /></a>
            <a href="#" className="footer-social" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><IconYT /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Explorar</h4>
          <ul>
            <li><Link to="/">Mapa interactivo</Link></li>
            <li><Link to="/eventos">Eventos culturales</Link></li>
            <li><Link to="/calendario">Calendario</Link></li>
            <li><Link to="/registro">Registro de turistas</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Descubrir</h4>
          <ul>
            <li><Link to="/lugar/1">Parque Caldas</Link></li>
            <li><Link to="/lugar/2">Catedral Basílica</Link></li>
            <li><Link to="/lugar/5">Morro de Tulcán</Link></li>
            <li><Link to="/lugar/3">Puente del Humilladero</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Información</h4>
          <ul>
            <li><a href="#">Acerca de Pubenza</a></li>
            <li><a href="#">Contacto</a></li>
            <li><a href="#">Prensa y medios</a></li>
            <li><Link to="/secretaria/login">Secretaría de Turismo</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-base">
        <span>© 2026 Pubenza · Secretaría de Turismo del Cauca</span>
        <div className="footer-base-links">
          <a href="#">Privacidad</a>
          <a href="#">Accesibilidad</a>
          <a href="#">Términos de uso</a>
        </div>
      </div>
    </footer>
  )
}
