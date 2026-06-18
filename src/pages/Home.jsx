import { Link } from 'react-router-dom'
import MapView from '../components/MapView'
import heroImg from '../assets/hero.png'
import './Home.css'

export default function Home() {
  return (
    <main>
      <section className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-overlay">
          <div className="hero-text">
            <h1>Descubre la Magia de Popayán</h1>
            <p>La Ciudad Blanca te espera con su historia, cultura y tradición</p>
          </div>
          <Link to="/registro" className="btn-registro">
            Registro
          </Link>
        </div>
      </section>

      <section className="map-section">
        <MapView />
      </section>
    </main>
  )
}
