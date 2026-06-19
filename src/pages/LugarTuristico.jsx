import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { PUNTOS_INTERES } from '../data/lugares'
import './LugarTuristico.css'

const SEED_COMENTARIOS = {
  1: [
    { id: 1, nombre: 'Ana García', texto: 'El parque es hermoso, especialmente en las mañanas. El ambiente tranquilo y las palomas lo hacen un espacio especial.', valoracion: 5, fecha: '2026-06-15T09:30:00Z' },
    { id: 2, nombre: 'Carlos M.', texto: 'Rodeado de historia por todos lados. Las fachadas blancas de los edificios coloniales son impresionantes. Visita obligada.', valoracion: 5, fecha: '2026-06-12T14:00:00Z' },
  ],
  2: [
    { id: 1, nombre: 'María López', texto: 'La catedral es majestuosa por dentro y por fuera. Los vitrales son preciosos y la acústica durante las misas es perfecta.', valoracion: 5, fecha: '2026-06-10T11:00:00Z' },
    { id: 2, nombre: 'Pedro Vargas', texto: 'Monumental arquitectura neoclásica. La visité durante la misa del domingo y la experiencia fue increíblemente emotiva.', valoracion: 5, fecha: '2026-05-28T10:30:00Z' },
  ],
  3: [
    { id: 1, nombre: 'Luisa Fernanda', texto: 'De noche el puente es un espectáculo de luz y sombra. Lo fotografié desde abajo y quedó una foto perfecta.', valoracion: 5, fecha: '2026-06-14T20:00:00Z' },
  ],
  4: [
    { id: 1, nombre: 'Jorge Artunduaga', texto: 'El interior con los retablos dorados es simplemente impresionante. El museo de arte religioso adyacente es un tesoro.', valoracion: 5, fecha: '2026-06-08T12:00:00Z' },
  ],
  5: [
    { id: 1, nombre: 'Diego Torres', texto: 'El atardecer desde el Morro es absolutamente espectacular. Las 90 gradas valen completamente el esfuerzo. Vista 360 increíble.', valoracion: 5, fecha: '2026-06-16T18:00:00Z' },
    { id: 2, nombre: 'Valentina R.', texto: 'Fui con mi familia y a los niños les encantó la estatua del conquistador. El parque alrededor es ideal para descansar.', valoracion: 4, fecha: '2026-06-08T15:30:00Z' },
  ],
  6: [
    { id: 1, nombre: 'Sofía Castaño', texto: 'Asistí a una obra del Festival Iberoamericano y fue una experiencia mágica. El teatro tiene una acústica excepcional.', valoracion: 5, fecha: '2026-06-05T21:00:00Z' },
  ],
  8: [
    { id: 1, nombre: 'Ricardo H.', texto: 'Como amante de la literatura, este museo fue un viaje en el tiempo. Los manuscritos originales de Valencia son emocionantes.', valoracion: 5, fecha: '2026-06-11T15:00:00Z' },
  ],
  11: [
    { id: 1, nombre: 'Juliana B.', texto: '¡El pipián es el mejor que he probado en mi vida! Ambiente cálido y auténtico. Precios muy razonables para la calidad.', valoracion: 5, fecha: '2026-06-17T13:00:00Z' },
    { id: 2, nombre: 'Roberto V.', texto: 'Excelente cocina caucana tradicional. Los tamales del fin de semana son extraordinarios. Servicio amable y atento.', valoracion: 5, fecha: '2026-06-14T19:00:00Z' },
  ],
  12: [
    { id: 1, nombre: 'Camila Ríos', texto: 'El desayuno payanés que sirven es espectacular. El café de origen caucano es simplemente el mejor que he tomado.', valoracion: 5, fecha: '2026-06-13T08:30:00Z' },
  ],
}

function Stars({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="lt-stars-input" role="group" aria-label="Calificación">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          className={`lt-star-btn${n <= (hover || value) ? ' filled' : ''}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
        >★</button>
      ))}
    </div>
  )
}

function StarsDisplay({ value, size = 'sm' }) {
  return (
    <span className={`lt-stars-display lt-stars-display--${size}`} aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} className={`lt-star-icon${n <= value ? ' filled' : ''}`}>★</span>
      ))}
    </span>
  )
}

const TABS = [
  { id: 'descripcion', label: 'Descripción' },
  { id: 'historia', label: 'Historia' },
  { id: 'practica', label: 'Info práctica' },
]

export default function LugarTuristico() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lugar = PUNTOS_INTERES.find(p => p.id === parseInt(id, 10))

  const [tabActiva, setTabActiva] = useState('descripcion')
  const [comentarios, setComentarios] = useState([])
  const [form, setForm] = useState({ nombre: '', texto: '', valoracion: 5 })
  const [enviado, setEnviado] = useState(false)
  const [verMas, setVerMas] = useState(false)

  useEffect(() => {
    if (!lugar) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const guardados = JSON.parse(localStorage.getItem(`popayan_com_${lugar.id}`) || '[]')
    const seed = SEED_COMENTARIOS[lugar.id] || []
    setComentarios([...seed, ...guardados])
    setTabActiva('descripcion')
    setVerMas(false)
  }, [lugar?.id])

  if (!lugar) {
    return (
      <div className="lt-notfound">
        <span className="lt-notfound-icon">🗺️</span>
        <h2>Lugar no encontrado</h2>
        <p>El punto de interés que buscas no existe o ha sido removido.</p>
        <Link to="/" className="lt-btn-back">← Volver al mapa</Link>
      </div>
    )
  }

  const promedioVal = comentarios.length
    ? (comentarios.reduce((a, c) => a + c.valoracion, 0) / comentarios.length).toFixed(1)
    : null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.texto.trim()) return
    const nuevo = {
      id: Date.now(),
      nombre: form.nombre.trim(),
      texto: form.texto.trim(),
      valoracion: form.valoracion,
      fecha: new Date().toISOString(),
    }
    const previos = JSON.parse(localStorage.getItem(`popayan_com_${lugar.id}`) || '[]')
    const actualizados = [...previos, nuevo]
    localStorage.setItem(`popayan_com_${lugar.id}`, JSON.stringify(actualizados))
    const seed = SEED_COMENTARIOS[lugar.id] || []
    setComentarios([...seed, ...actualizados])
    setForm({ nombre: '', texto: '', valoracion: 5 })
    setEnviado(true)
    setTimeout(() => setEnviado(false), 3500)
  }

  const cercanos = PUNTOS_INTERES.filter(p => p.id !== lugar.id).slice(0, 5)

  return (
    <div className="lt-page">
      {/* ── Hero ── */}
      <div className="lt-hero" style={{ background: lugar.colorGradient }}>
        <div className="lt-hero-overlay">
          <button className="lt-back" onClick={() => navigate(-1)}>
            ← Volver
          </button>

          <div className="lt-hero-body">
            <div className="lt-hero-icon-wrap">
              <span className="lt-hero-icon">{lugar.icon}</span>
            </div>
            <span className="lt-cat-badge">{lugar.categoria}</span>
            <h1 className="lt-hero-titulo">{lugar.nombre}</h1>
            <p className="lt-hero-tagline">{lugar.tagline}</p>

            {promedioVal && (
              <div className="lt-hero-rating">
                <span className="lt-hero-rating-num">{promedioVal}</span>
                <StarsDisplay value={Math.round(parseFloat(promedioVal))} size="md" />
                <span className="lt-hero-rating-count">{comentarios.length} opiniones</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Info rápida ── */}
      <div className="lt-info-bar">
        <div className="lt-info-item">
          <span className="lt-info-icon">🕐</span>
          <div className="lt-info-text">
            <span className="lt-info-label">Horarios</span>
            <span className="lt-info-val">{lugar.horarios.split('\n')[0]}</span>
          </div>
        </div>
        <div className="lt-info-sep" />
        <div className="lt-info-item">
          <span className="lt-info-icon">🎟️</span>
          <div className="lt-info-text">
            <span className="lt-info-label">Entrada</span>
            <span className="lt-info-val">{lugar.entrada}</span>
          </div>
        </div>
        <div className="lt-info-sep" />
        <div className="lt-info-item">
          <span className="lt-info-icon">📍</span>
          <div className="lt-info-text">
            <span className="lt-info-label">Ubicación</span>
            <span className="lt-info-val">{lugar.ubicacion}</span>
          </div>
        </div>
        {lugar.telefono && (
          <>
            <div className="lt-info-sep" />
            <div className="lt-info-item">
              <span className="lt-info-icon">📞</span>
              <div className="lt-info-text">
                <span className="lt-info-label">Teléfono</span>
                <span className="lt-info-val">{lugar.telefono}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Layout principal ── */}
      <div className="lt-container">
        <div className="lt-main">

          {/* Tabs */}
          <nav className="lt-tabs" aria-label="Secciones">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`lt-tab${tabActiva === t.id ? ' activo' : ''}`}
                onClick={() => setTabActiva(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* Contenido de tab */}
          <div className="lt-tab-panel">
            {tabActiva === 'descripcion' && (
              <p className="lt-texto-cuerpo">{lugar.descripcion}</p>
            )}
            {tabActiva === 'historia' && (
              <p className="lt-texto-cuerpo">{lugar.historia}</p>
            )}
            {tabActiva === 'practica' && (
              <div className="lt-practica-grid">
                <div className="lt-practica-item">
                  <span className="lt-practica-icon">🕐</span>
                  <div>
                    <strong>Horarios de atención</strong>
                    <p style={{ whiteSpace: 'pre-line' }}>{lugar.horarios}</p>
                  </div>
                </div>
                <div className="lt-practica-item">
                  <span className="lt-practica-icon">🎟️</span>
                  <div>
                    <strong>Tarifa de entrada</strong>
                    <p>{lugar.entrada}</p>
                  </div>
                </div>
                <div className="lt-practica-item">
                  <span className="lt-practica-icon">📍</span>
                  <div>
                    <strong>Dirección</strong>
                    <p>{lugar.ubicacion}</p>
                  </div>
                </div>
                {lugar.telefono && (
                  <div className="lt-practica-item">
                    <span className="lt-practica-icon">📞</span>
                    <div>
                      <strong>Teléfono de contacto</strong>
                      <p>{lugar.telefono}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Recomendaciones ── */}
          <section className="lt-recs-section">
            <h2 className="lt-section-titulo">Recomendaciones para visitantes</h2>
            <div className="lt-recs-grid">
              {lugar.recomendaciones.map((rec, i) => (
                <div key={i} className="lt-rec-card">
                  <span className="lt-rec-emoji">{rec.emoji}</span>
                  <div className="lt-rec-body">
                    <strong>{rec.titulo}</strong>
                    <p>{rec.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Comentarios ── */}
          <section className="lt-com-section">
            <div className="lt-com-header">
              <h2 className="lt-section-titulo">Opiniones y experiencias</h2>
              {promedioVal && (
                <div className="lt-com-prom">
                  <span className="lt-com-prom-num">{promedioVal}</span>
                  <div className="lt-com-prom-right">
                    <StarsDisplay value={Math.round(parseFloat(promedioVal))} size="md" />
                    <span className="lt-com-prom-label">{comentarios.length} opiniones</span>
                  </div>
                </div>
              )}
            </div>

            {/* Lista */}
            {comentarios.length === 0 ? (
              <div className="lt-com-vacio">
                <span>💬</span>
                <p>Sé el primero en compartir tu experiencia con este lugar</p>
              </div>
            ) : (
              <div className="lt-com-lista">
                {(verMas ? comentarios : comentarios.slice(0, 3)).map(com => (
                  <article key={com.id} className="lt-com-item">
                    <div className="lt-com-avatar">
                      {com.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="lt-com-body">
                      <div className="lt-com-meta">
                        <span className="lt-com-nombre">{com.nombre}</span>
                        <StarsDisplay value={com.valoracion} />
                        <span className="lt-com-fecha">
                          {new Date(com.fecha).toLocaleDateString('es-CO', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="lt-com-texto">{com.texto}</p>
                    </div>
                  </article>
                ))}
                {comentarios.length > 3 && (
                  <button className="lt-ver-mas" onClick={() => setVerMas(v => !v)}>
                    {verMas ? 'Ver menos comentarios ↑' : `Ver ${comentarios.length - 3} comentarios más ↓`}
                  </button>
                )}
              </div>
            )}

            {/* Formulario */}
            <div className="lt-form-wrap">
              <h3 className="lt-form-titulo">Comparte tu experiencia</h3>
              <p className="lt-form-sub">Tu opinión ayuda a otros visitantes a conocer mejor este lugar</p>

              {enviado ? (
                <div className="lt-form-success">
                  <span className="lt-form-success-icon">✓</span>
                  <div>
                    <strong>¡Gracias por tu opinión!</strong>
                    <p>Tu comentario ya está visible para otros visitantes.</p>
                  </div>
                </div>
              ) : (
                <form className="lt-form" onSubmit={handleSubmit}>
                  <div className="lt-form-row">
                    <div className="lt-form-field">
                      <label>Tu nombre</label>
                      <input
                        type="text"
                        placeholder="¿Cómo te llamas?"
                        value={form.nombre}
                        onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                        required
                        maxLength={50}
                      />
                    </div>
                    <div className="lt-form-field">
                      <label>Calificación</label>
                      <Stars value={form.valoracion} onChange={v => setForm(p => ({ ...p, valoracion: v }))} />
                    </div>
                  </div>
                  <div className="lt-form-field lt-form-field--full">
                    <label>Tu experiencia</label>
                    <textarea
                      placeholder="Cuéntanos cómo fue tu visita, qué te gustó más, algún consejo para otros visitantes..."
                      value={form.texto}
                      onChange={e => setForm(p => ({ ...p, texto: e.target.value }))}
                      required
                      maxLength={500}
                      rows={4}
                    />
                    <span className="lt-char-count">{form.texto.length}/500</span>
                  </div>
                  <button type="submit" className="lt-form-btn">
                    Publicar opinión →
                  </button>
                </form>
              )}
            </div>
          </section>
        </div>

        {/* ── Sidebar ── */}
        <aside className="lt-aside">
          {/* Widget: coords */}
          <div className="lt-aside-map">
            <div className="lt-aside-map-preview" style={{ background: lugar.colorGradient }}>
              <span className="lt-aside-map-icon">{lugar.icon}</span>
            </div>
            <div className="lt-aside-map-body">
              <span className="lt-aside-map-coords">
                📍 {lugar.coords[1].toFixed(4)}°N, {Math.abs(lugar.coords[0]).toFixed(4)}°O
              </span>
              <Link to="/" className="lt-aside-map-link">Ver en el mapa →</Link>
            </div>
          </div>

          {/* Lugares cercanos */}
          <div className="lt-aside-cercanos">
            <h3 className="lt-aside-titulo">Otros lugares</h3>
            <div className="lt-aside-lista">
              {cercanos.map(p => (
                <Link key={p.id} to={`/lugar/${p.id}`} className="lt-aside-item">
                  <span
                    className="lt-aside-icon"
                    style={{ background: p.colorGradient }}
                  >
                    {p.icon}
                  </span>
                  <div className="lt-aside-info">
                    <span className="lt-aside-nombre">{p.nombre}</span>
                    <span className="lt-aside-cat">{p.categoria}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Info card */}
          <div className="lt-aside-info-card">
            <h3 className="lt-aside-titulo">Información de contacto</h3>
            <div className="lt-aside-detalles">
              <div className="lt-aside-detalle">
                <span>🕐</span>
                <span>{lugar.horarios.split('\n')[0]}</span>
              </div>
              <div className="lt-aside-detalle">
                <span>🎟️</span>
                <span>{lugar.entrada}</span>
              </div>
              {lugar.telefono && (
                <div className="lt-aside-detalle">
                  <span>📞</span>
                  <span>{lugar.telefono}</span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
