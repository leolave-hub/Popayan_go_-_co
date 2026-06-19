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
          key={n} type="button"
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

function distancia(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)
}

function ShareButton({ lugar }) {
  const [copied, setCopied] = useState(false)
  const url = window.location.href
  const msg = `¡Descubre ${lugar.nombre} en Popayán! ${lugar.tagline} — ${url}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignored */ }
  }

  const shareWa = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
  }

  return (
    <div className="lt-share-wrap">
      <button className="lt-share-btn lt-share-btn--wa" onClick={shareWa} title="Compartir por WhatsApp">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.83L.525 23.45a.75.75 0 0 0 .927.927l5.62-.997A11.956 11.956 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.71 9.71 0 0 1-4.95-1.354l-.355-.213-3.68.652.663-3.619-.234-.372A9.712 9.712 0 0 1 2.25 12C2.25 6.617 6.617 2.25 12 2.25S21.75 6.617 21.75 12 17.383 21.75 12 21.75z"/>
        </svg>
        WhatsApp
      </button>
      <button className="lt-share-btn lt-share-btn--copy" onClick={copyLink} title="Copiar enlace">
        {copied
          ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> ¡Copiado!</>
          : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copiar enlace</>
        }
      </button>
    </div>
  )
}

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
    const nuevo = { id: Date.now(), nombre: form.nombre.trim(), texto: form.texto.trim(), valoracion: form.valoracion, fecha: new Date().toISOString() }
    const previos = JSON.parse(localStorage.getItem(`popayan_com_${lugar.id}`) || '[]')
    const actualizados = [...previos, nuevo]
    localStorage.setItem(`popayan_com_${lugar.id}`, JSON.stringify(actualizados))
    setComentarios([...(SEED_COMENTARIOS[lugar.id] || []), ...actualizados])
    setForm({ nombre: '', texto: '', valoracion: 5 })
    setEnviado(true)
    setTimeout(() => setEnviado(false), 3500)
  }

  const cercanos = PUNTOS_INTERES
    .filter(p => p.id !== lugar.id)
    .sort((a, b) => distancia(a.coords, lugar.coords) - distancia(b.coords, lugar.coords))
    .slice(0, 4)

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lugar.coords[1]},${lugar.coords[0]}`

  return (
    <div className="lt-page">
      {/* ── Hero con foto real ── */}
      <div className="lt-hero">
        {lugar.foto
          ? <img src={lugar.foto} alt={lugar.nombre} className="lt-hero-foto" />
          : <div className="lt-hero-grad" style={{ background: lugar.colorGradient }} />
        }
        <div className="lt-hero-overlay">
          <div className="lt-hero-top">
            <button className="lt-back" onClick={() => navigate(-1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Volver
            </button>
            <ShareButton lugar={lugar} />
          </div>

          <div className="lt-hero-body">
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

      {/* ── Info bar ── */}
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
        <div className="lt-info-sep" />
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="lt-como-llegar-btn"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Cómo llegar
        </a>
      </div>

      {/* ── Audio ── */}
      {lugar.audio && (
        <div className="lt-audio-player">
          <div className="lt-audio-icon-wrap"><span className="lt-audio-icon">🎧</span></div>
          <div className="lt-audio-body">
            <span className="lt-audio-label">Narración del lugar</span>
            <p className="lt-audio-sub">Escucha la historia de {lugar.nombre}</p>
            <audio controls src={lugar.audio} className="lt-audio-el" preload="none" />
          </div>
        </div>
      )}

      {/* ── Layout principal ── */}
      <div className="lt-container">
        <div className="lt-main">
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

          <div className="lt-tab-panel">
            {tabActiva === 'descripcion' && <p className="lt-texto-cuerpo">{lugar.descripcion}</p>}
            {tabActiva === 'historia' && <p className="lt-texto-cuerpo">{lugar.historia}</p>}
            {tabActiva === 'practica' && (
              <div className="lt-practica-grid">
                <div className="lt-practica-item"><span className="lt-practica-icon">🕐</span><div><strong>Horarios de atención</strong><p style={{ whiteSpace: 'pre-line' }}>{lugar.horarios}</p></div></div>
                <div className="lt-practica-item"><span className="lt-practica-icon">🎟️</span><div><strong>Tarifa de entrada</strong><p>{lugar.entrada}</p></div></div>
                <div className="lt-practica-item"><span className="lt-practica-icon">📍</span><div><strong>Dirección</strong><p>{lugar.ubicacion}</p></div></div>
                {lugar.telefono && <div className="lt-practica-item"><span className="lt-practica-icon">📞</span><div><strong>Teléfono</strong><p>{lugar.telefono}</p></div></div>}
              </div>
            )}
          </div>

          {/* Recomendaciones */}
          <section className="lt-recs-section">
            <h2 className="lt-section-titulo">Recomendaciones para visitantes</h2>
            <div className="lt-recs-grid">
              {lugar.recomendaciones.map((rec, i) => (
                <div key={i} className="lt-rec-card">
                  <span className="lt-rec-emoji">{rec.emoji}</span>
                  <div className="lt-rec-body"><strong>{rec.titulo}</strong><p>{rec.texto}</p></div>
                </div>
              ))}
            </div>
          </section>

          {/* Comentarios */}
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

            {comentarios.length === 0 ? (
              <div className="lt-com-vacio"><span>💬</span><p>Sé el primero en compartir tu experiencia</p></div>
            ) : (
              <div className="lt-com-lista">
                {(verMas ? comentarios : comentarios.slice(0, 3)).map(com => (
                  <article key={com.id} className="lt-com-item">
                    <div className="lt-com-avatar">{com.nombre.charAt(0).toUpperCase()}</div>
                    <div className="lt-com-body">
                      <div className="lt-com-meta">
                        <span className="lt-com-nombre">{com.nombre}</span>
                        <StarsDisplay value={com.valoracion} />
                        <span className="lt-com-fecha">
                          {new Date(com.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="lt-com-texto">{com.texto}</p>
                    </div>
                  </article>
                ))}
                {comentarios.length > 3 && (
                  <button className="lt-ver-mas" onClick={() => setVerMas(v => !v)}>
                    {verMas ? 'Ver menos ↑' : `Ver ${comentarios.length - 3} opiniones más ↓`}
                  </button>
                )}
              </div>
            )}

            <div className="lt-form-wrap">
              <h3 className="lt-form-titulo">Comparte tu experiencia</h3>
              <p className="lt-form-sub">Tu opinión ayuda a otros visitantes a conocer mejor este lugar</p>
              {enviado ? (
                <div className="lt-form-success">
                  <span className="lt-form-success-icon">✓</span>
                  <div><strong>¡Gracias por tu opinión!</strong><p>Tu comentario ya está visible.</p></div>
                </div>
              ) : (
                <form className="lt-form" onSubmit={handleSubmit}>
                  <div className="lt-form-row">
                    <div className="lt-form-field">
                      <label>Tu nombre</label>
                      <input type="text" placeholder="¿Cómo te llamas?" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} required maxLength={50} />
                    </div>
                    <div className="lt-form-field">
                      <label>Calificación</label>
                      <Stars value={form.valoracion} onChange={v => setForm(p => ({ ...p, valoracion: v }))} />
                    </div>
                  </div>
                  <div className="lt-form-field lt-form-field--full">
                    <label>Tu experiencia</label>
                    <textarea placeholder="Cuéntanos cómo fue tu visita..." value={form.texto} onChange={e => setForm(p => ({ ...p, texto: e.target.value }))} required maxLength={500} rows={4} />
                    <span className="lt-char-count">{form.texto.length}/500</span>
                  </div>
                  <button type="submit" className="lt-form-btn">Publicar opinión →</button>
                </form>
              )}
            </div>
          </section>
        </div>

        {/* ── Sidebar ── */}
        <aside className="lt-aside">
          <div className="lt-aside-map">
            <div className="lt-aside-map-preview" style={{ background: lugar.colorGradient }}>
              <span className="lt-aside-map-icon">{lugar.icon}</span>
            </div>
            <div className="lt-aside-map-body">
              <span className="lt-aside-map-coords">📍 {lugar.coords[1].toFixed(4)}°N, {Math.abs(lugar.coords[0]).toFixed(4)}°O</span>
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="lt-aside-map-link">Abrir en Google Maps →</a>
            </div>
          </div>

          {/* Lugares cercanos reales */}
          <div className="lt-aside-cercanos">
            <h3 className="lt-aside-titulo">Lugares cercanos</h3>
            <div className="lt-aside-lista">
              {cercanos.map(p => (
                <Link key={p.id} to={`/lugar/${p.id}`} className="lt-aside-item">
                  {p.foto
                    ? <img src={p.foto} alt={p.nombre} className="lt-aside-img" />
                    : <span className="lt-aside-icon" style={{ background: p.colorGradient }}>{p.icon}</span>
                  }
                  <div className="lt-aside-info">
                    <span className="lt-aside-nombre">{p.nombre}</span>
                    <span className="lt-aside-cat">{p.categoria}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="lt-aside-info-card">
            <h3 className="lt-aside-titulo">Contacto</h3>
            <div className="lt-aside-detalles">
              <div className="lt-aside-detalle"><span>🕐</span><span>{lugar.horarios.split('\n')[0]}</span></div>
              <div className="lt-aside-detalle"><span>🎟️</span><span>{lugar.entrada}</span></div>
              {lugar.telefono && <div className="lt-aside-detalle"><span>📞</span><span>{lugar.telefono}</span></div>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
