import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/MapView'
import heroImg from '../assets/hero.jpg'
import { PUNTOS_INTERES } from '../data/lugares'

const PREFERENCIAS = [
  { label: 'Gastronomía', emoji: '🍽' },
  { label: 'Turismo', emoji: '🗺' },
  { label: 'Arte', emoji: '🎨' },
  { label: 'Música', emoji: '🎶' },
  { label: 'Cultura', emoji: '🏛' },
  { label: 'Historia', emoji: '📜' },
  { label: 'Naturaleza', emoji: '🌿' },
  { label: 'Deportes', emoji: '⚽' },
]

const CATEGORIAS = ['Todo', 'Gastronomía', 'Arte', 'Música', 'Cultura', 'Turismo']

export default function Home() {
  const navigate = useNavigate()
  const [categoriaActiva, setCategoriaActiva] = useState('Todo')
  const [puntoActivo, setPuntoActivo] = useState(null)
  const [form, setForm] = useState({ origen: '', edad: '', preferencias: [] })
  const [enviado, setEnviado] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)

  const puntosFiltrados = categoriaActiva === 'Todo'
    ? PUNTOS_INTERES
    : PUNTOS_INTERES.filter(p => p.categoria === categoriaActiva)

  const handleCategoriaChange = (cat) => {
    setCategoriaActiva(cat)
    setPuntoActivo(null)
  }

  const handleSelectPunto = (punto) => {
    setPuntoActivo(prev => prev?.id === punto.id ? null : punto)
  }

  const togglePref = (label) =>
    setForm(prev => ({
      ...prev,
      preferencias: prev.preferencias.includes(label)
        ? prev.preferencias.filter(p => p !== label)
        : [...prev.preferencias, label],
    }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const anteriores = JSON.parse(localStorage.getItem('popayan_encuestas') || '[]')
    anteriores.push({ ...form, fecha: new Date().toISOString() })
    localStorage.setItem('popayan_encuestas', JSON.stringify(anteriores))
    setEnviado(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setEnviado(false)
    setForm({ origen: '', edad: '', preferencias: [] })
  }

  return (
    <main>
      {/* ── Hero ── */}
      <section className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="hero-overlay">
          <span className="hero-tag">Popayán · Colombia</span>
          <h1>La Ciudad Blanca</h1>
          <p>Historia, cultura y tradición</p>
        </div>
      </section>

      {/* ── Mapa ── */}
      <section className="mapa-section">
        <div className="mapa-header">
          <h2>Mapa interactivo</h2>
          <div className="filtros">
            {CATEGORIAS.map(cat => (
              <button
                key={cat}
                className={`filtro-chip${categoriaActiva === cat ? ' activo' : ''}`}
                onClick={() => handleCategoriaChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mapa-wrap">
          <div className="mapa-map">
            <MapView
              puntos={puntosFiltrados}
              activePunto={puntoActivo}
              onPuntoClick={(punto) => navigate(`/lugar/${punto.id}`)}
            />
          </div>

          <div className="mapa-lista-panel">
            <div className="lista-header">
              <span className="lista-titulo">Puntos de interés</span>
              <span className="lista-count">{puntosFiltrados.length}</span>
            </div>
            <div className="lista-items">
              {puntosFiltrados.map(punto => (
                <div
                  key={punto.id}
                  className={`poi-card${puntoActivo?.id === punto.id ? ' activo' : ''}`}
                >
                  <button
                    className="poi-card-select"
                    onClick={() => handleSelectPunto(punto)}
                  >
                    <span className="poi-icon">{punto.icon}</span>
                    <div className="poi-info">
                      <span className="poi-nombre">{punto.nombre}</span>
                      <span className="poi-cat-tag">{punto.categoria}</span>
                    </div>
                  </button>
                  <button
                    className="poi-ver-btn"
                    onClick={() => navigate(`/lugar/${punto.id}`)}
                    title="Ver página del lugar"
                  >
                    →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-encuesta">
          <p className="cta-label">Experiencia personalizada</p>
          <h2>¿Cómo es tu visita a Popayán?</h2>
          <p className="cta-desc">
            Comparte tus intereses y ayúdanos a ofrecerte una mejor experiencia en la ciudad.
          </p>
          <button className="btn-abrir-encuesta" onClick={() => setModalAbierto(true)}>
            Ayúdanos a mejorar · Cuéntanos sobre ti
          </button>
        </div>

        <div className="cta-divider" />

        <div className="cta-registro">
          <p className="cta-label">¿Quieres guardar tu experiencia?</p>
          <h3>Crea tu cuenta</h3>
          <p className="cta-desc">
            Guarda tus lugares favoritos y recibe recomendaciones personalizadas.
          </p>
          <button className="btn-registro">
            Registro
          </button>
        </div>
      </section>

      {/* ── Modal encuesta ── */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={cerrarModal}>✕</button>

            {enviado ? (
              <div className="form-success">
                <div className="success-icon">✓</div>
                <p>¡Gracias! Disfruta de tu experiencia.</p>
                <button className="btn-enviar" style={{ marginTop: 16 }} onClick={cerrarModal}>
                  Cerrar
                </button>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h2>Cuéntanos sobre ti</h2>
                  <p>Tus respuestas nos ayudan a mejorar Popayán Go</p>
                </div>

                <form className="postulate-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>¿De dónde eres?</label>
                    <input
                      type="text"
                      placeholder="País de origen"
                      value={form.origen}
                      onChange={e => setForm(p => ({ ...p, origen: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>¿Qué edad tienes?</label>
                    <input
                      type="number"
                      placeholder="Edad"
                      min="1"
                      max="120"
                      value={form.edad}
                      onChange={e => setForm(p => ({ ...p, edad: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>¿Qué te interesa?</label>
                    <div className="prefs-grid">
                      {PREFERENCIAS.map(({ label, emoji }) => (
                        <button
                          type="button"
                          key={label}
                          className={`pref-chip${form.preferencias.includes(label) ? ' sel' : ''}`}
                          onClick={() => togglePref(label)}
                        >
                          <span className="pref-emoji">{emoji}</span>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="btn-enviar">
                    Continuar →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
