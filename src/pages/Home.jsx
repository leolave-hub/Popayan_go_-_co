import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import MapView from '../components/MapView'
import heroImg from '../assets/hero.jpg'
import imagen1 from '../assets/imagen1.jpg'
import imagen2 from '../assets/imagen2.jpg'
import { PUNTOS_INTERES } from '../data/lugares'
import { EVENTOS, CATEGORIAS_INFO } from '../data/eventos'
import { RUTAS_CURADAS } from '../data/rutas'
import './Home.css'

const PREFERENCIAS = [
  { label: 'Gastronomía', emoji: '🍽' },
  { label: 'Turismo', emoji: '🗺' },
  { label: 'Arte', emoji: '🎨' },
  { label: 'Cultura', emoji: '🏛' },
  { label: 'Historia', emoji: '📜' },
  { label: 'Naturaleza', emoji: '🌿' },
  { label: 'Deportes', emoji: '⚽' },
]

const CATEGORIAS = ['Todo', 'Gastronomía', 'Arte', 'Cultura', 'Turismo', 'Vida Nocturna', 'Comercial', 'Recreativo']

const toISO = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getEventosFinDeSemana() {
  const hoy = new Date()
  const diaSemana = hoy.getDay()
  const diasHastaSab = diaSemana === 6 ? 0 : diaSemana === 0 ? 6 : 6 - diaSemana
  const sab = new Date(hoy); sab.setDate(hoy.getDate() + diasHastaSab)
  const dom = new Date(sab); dom.setDate(sab.getDate() + 1)
  const sabStr = toISO(sab)
  const domStr = toISO(dom)
  return EVENTOS.filter(ev => {
    const inicio = ev.fechaInicio
    const fin = ev.fechaFin
    return (sabStr >= inicio && sabStr <= fin) || (domStr >= inicio && domStr <= fin)
  }).slice(0, 4)
}

function ordenarPorCercania(inicio, lugares) {
  const pendientes = [...lugares]
  const ordenados = []
  let actual = inicio
  while (pendientes.length > 0) {
    let minIdx = 0, minDist = Infinity
    pendientes.forEach((p, i) => {
      const d = (p.coords[0] - actual[0]) ** 2 + (p.coords[1] - actual[1]) ** 2
      if (d < minDist) { minDist = d; minIdx = i }
    })
    ordenados.push(pendientes[minIdx])
    actual = pendientes[minIdx].coords
    pendientes.splice(minIdx, 1)
  }
  return ordenados
}

async function fetchRutaMapbox(coordenadas) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  const coords = coordenadas.map(([lng, lat]) => `${lng},${lat}`).join(';')
  const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coords}?geometries=geojson&overview=full&access_token=${token}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Error de red')
  const data = await res.json()
  if (!data.routes?.length) throw new Error('Sin rutas disponibles')
  return data.routes[0].geometry
}

const formatFecha = (str) =>
  new Date(str + 'T12:00:00').toLocaleDateString('es-CO', {
    weekday: 'short', day: 'numeric', month: 'short',
  })

const HERO_IMAGES = [
  imagen2, // "Imagen 2" (principal)
  imagen1, // "Imagen 1"
  heroImg  // "Imagen original"
]

export default function Home() {
  const navigate = useNavigate()
  const mapaSectionRef = useRef(null)
  const [categoriaActiva, setCategoriaActiva] = useState('Todo')
  const [puntoActivo, setPuntoActivo] = useState(null)
  const [form, setForm] = useState({ origen: '', edad: '', preferencias: [] })
  const [enviado, setEnviado] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)

  const [modoRuta, setModoRuta] = useState(false)
  const [geoStatus, setGeoStatus] = useState('idle')
  const [userLocation, setUserLocation] = useState(null)
  const [lugaresRuta, setLugaresRuta] = useState(new Set())
  const [rutaGeojson, setRutaGeojson] = useState(null)
  const [rutaOrdenada, setRutaOrdenada] = useState([])
  const [calculando, setCalculando] = useState(false)
  const [rutaError, setRutaError] = useState(null)
  
  const [heroImageIdx, setHeroImageIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIdx(prev => (prev + 1) % HERO_IMAGES.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const eventosFinDeSemana = getEventosFinDeSemana()
  const puntosFiltrados = categoriaActiva === 'Todo'
    ? PUNTOS_INTERES
    : PUNTOS_INTERES.filter(p => p.categoria === categoriaActiva)

  const scrollAlMapa = () => {
    mapaSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCategoriaChange = (cat) => { setCategoriaActiva(cat); setPuntoActivo(null) }
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
    setModalAbierto(false); setEnviado(false)
    setForm({ origen: '', edad: '', preferencias: [] })
  }

  const pedirUbicacion = () => {
    if (!navigator.geolocation) { setGeoStatus('error'); return }
    setGeoStatus('pidiendo')
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLocation([pos.coords.longitude, pos.coords.latitude]); setGeoStatus('ok') },
      () => setGeoStatus('error'),
      { timeout: 12000 }
    )
  }

  const activarModoRuta = () => { setModoRuta(true); pedirUbicacion() }
  const toggleLugarRuta = (id) => {
    setLugaresRuta(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const calcularRuta = async () => {
    if (!userLocation || lugaresRuta.size === 0) return
    setCalculando(true); setRutaError(null)
    try {
      const seleccionados = PUNTOS_INTERES.filter(p => lugaresRuta.has(p.id))
      const ordenados = ordenarPorCercania(userLocation, seleccionados)
      setRutaOrdenada(ordenados)
      const coordenadas = [userLocation, ...ordenados.map(p => p.coords)]
      const geometry = await fetchRutaMapbox(coordenadas)
      setRutaGeojson(geometry)
    } catch { setRutaError('No se pudo calcular la ruta. Intenta de nuevo.') }
    finally { setCalculando(false) }
  }

  const nuevaSeleccion = () => { setRutaOrdenada([]); setRutaGeojson(null); setLugaresRuta(new Set()); setRutaError(null) }
  const limpiarRuta = () => {
    setModoRuta(false); setGeoStatus('idle'); setUserLocation(null)
    setLugaresRuta(new Set()); setRutaGeojson(null); setRutaOrdenada([]); setRutaError(null)
  }

  return (
    <main>
      {/* ── Hero Large Image Slider ── */}
      <section className="hero-large">
        <div className="hero-image-container">
          {HERO_IMAGES.map((src, idx) => (
            <img 
              key={src} 
              src={src} 
              alt={`Popayán ${idx + 1}`} 
              className={`hero-main-img hero-main-img--slide ${idx === heroImageIdx ? 'active' : ''}`} 
            />
          ))}
          <div className="hero-overlay-gradient"></div>
          
          <h1 className="hero-marca-texto">La ciudad blanca de Colombia</h1>
        </div>

        <div className="hero-bottom-bar">
          <p className="hero-bottom-desc">
            Descubre un patrimonio colonial vivo. Historia, cultura y tradición en cada rincón.
          </p>
          <div className="hero-bottom-actions">
            <button className="hero-btn-pill hero-btn-pill--primary" onClick={scrollAlMapa}>
              Explorar el mapa <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
            </button>
            <Link to="/eventos" className="hero-btn-pill hero-btn-pill--ghost">
              Ver calendario
            </Link>
          </div>
        </div>
      </section>

      {/* ── Este fin de semana ── */}
      {eventosFinDeSemana.length > 0 && (
        <section className="weekend-section">
          <div className="weekend-inner">
            <div className="weekend-header">
              <div>
                <p className="section-eyebrow">Agenda cultural</p>
                <h2 className="section-title">Este fin de semana</h2>
              </div>
              <Link to="/eventos" className="weekend-ver-todos">
                Ver todos los eventos →
              </Link>
            </div>
            <div className="weekend-grid">
              {eventosFinDeSemana.map(ev => {
                const info = CATEGORIAS_INFO[ev.categoria]
                return (
                  <Link key={ev.id} to="/eventos" className="weekend-card">
                    <div className="weekend-card-accent" style={{ background: info?.color }} />
                    <div className="weekend-card-body">
                      <span className="weekend-card-cat" style={{ color: info?.color }}>{ev.categoria}</span>
                      <h3 className="weekend-card-titulo">{ev.titulo}</h3>
                      <div className="weekend-card-meta">
                        <span>📅 {formatFecha(ev.fechaInicio)}</span>
                        <span>📍 {ev.lugar}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Rutas curadas ── */}
      <section className="rutas-section">
        <div className="rutas-inner">
          <div className="rutas-header">
            <p className="section-eyebrow">Recorridos temáticos</p>
            <h2 className="section-title">Rutas para explorar Popayán</h2>
            <p className="section-desc">
              Itinerarios curados para descubrir lo mejor de la Ciudad Blanca a tu ritmo
            </p>
          </div>
          <div className="rutas-grid">
            {RUTAS_CURADAS.map(ruta => (
              <button
                key={ruta.id}
                className="ruta-card"
                onClick={activarModoRuta}
              >
                <div className="ruta-card-img-wrap">
                  <img src={ruta.foto} alt={ruta.titulo} className="ruta-card-img" />
                  <div className="ruta-card-overlay" style={{ background: `${ruta.color}CC` }} />
                  <span className="ruta-card-icon">{ruta.icon}</span>
                </div>
                <div className="ruta-card-body">
                  <h3 className="ruta-card-titulo">{ruta.titulo}</h3>
                  <p className="ruta-card-desc">{ruta.descripcion}</p>
                  <div className="ruta-card-meta">
                    <span>⏱ {ruta.duracion}</span>
                    <span>📍 {ruta.paradas} paradas</span>
                    <span>🚶 {ruta.distancia}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mapa ── */}
      <section className="mapa-section" ref={mapaSectionRef}>
        <div className="mapa-header">
          <h2>Mapa interactivo</h2>
          <div className="mapa-header-right">
            <div className="filtros">
              {CATEGORIAS.map(cat => (
                <button
                  key={cat}
                  className={`filtro-chip${categoriaActiva === cat ? ' activo' : ''}`}
                  onClick={() => handleCategoriaChange(cat)}
                  disabled={modoRuta}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              className={`ruta-btn${modoRuta ? ' activa' : ''}`}
              onClick={modoRuta ? limpiarRuta : activarModoRuta}
            >
              {modoRuta ? '✕ Cerrar ruta' : '🗺 Crear mi ruta'}
            </button>
          </div>
        </div>

        <div className="mapa-wrap">
          <div className="mapa-map">
            <MapView
              puntos={puntosFiltrados}
              activePunto={modoRuta ? null : puntoActivo}
              onPuntoClick={modoRuta ? null : (punto) => {
                if (punto === null) setPuntoActivo(null)
                else setPuntoActivo(prev => prev?.id === punto.id ? null : punto)
              }}
              onVerMas={(punto) => navigate(`/lugar/${punto.id}`)}
              ruta={rutaGeojson}
              userLocation={userLocation}
            />
          </div>

          <div className="mapa-lista-panel">
            {modoRuta ? (
              <>
                <div className="lista-header">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span className="lista-titulo">
                      {rutaOrdenada.length > 0 ? 'Tu ruta' : 'Planifica tu ruta'}
                    </span>
                    {geoStatus === 'ok' && rutaOrdenada.length === 0 && (
                      <span className="geo-badge geo-badge--ok">Ubicación obtenida</span>
                    )}
                    {geoStatus === 'pidiendo' && (
                      <span className="geo-badge geo-badge--pidiendo">Obteniendo ubicación...</span>
                    )}
                    {geoStatus === 'error' && (
                      <span className="geo-badge geo-badge--error">Sin acceso a ubicación</span>
                    )}
                  </div>
                  {rutaOrdenada.length > 0
                    ? <span className="lista-count">{rutaOrdenada.length} paradas</span>
                    : lugaresRuta.size > 0
                      ? <span className="ruta-sel-count">{lugaresRuta.size} sel.</span>
                      : null
                  }
                </div>

                {rutaOrdenada.length > 0 ? (
                  <div className="ruta-pasos-list">
                    <div className="ruta-paso ruta-paso--inicio">
                      <div className="ruta-paso-num" style={{ background: '#3D88F5' }}>📍</div>
                      <div className="ruta-paso-info">
                        <span className="ruta-paso-nombre">Tu ubicación</span>
                        <span className="ruta-paso-cat">Punto de partida</span>
                      </div>
                    </div>
                    {rutaOrdenada.map((p, i) => (
                      <div key={p.id} className="ruta-paso">
                        <div className="ruta-paso-num">{i + 1}</div>
                        <div className="ruta-paso-info">
                          <span className="ruta-paso-nombre">{p.icon} {p.nombre}</span>
                          <span className="ruta-paso-cat">{p.categoria}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="ruta-panel-inner">
                    {geoStatus === 'error' && (
                      <div className="ruta-geo-status">
                        <span>No se pudo obtener tu ubicación</span>
                        <button className="btn-reintentar-geo" onClick={pedirUbicacion}>Reintentar</button>
                      </div>
                    )}
                    <p className="ruta-hint">Selecciona los lugares que quieres visitar:</p>
                    <div className="ruta-check-list">
                      {PUNTOS_INTERES.map(punto => (
                        <button
                          key={punto.id}
                          className={`ruta-check-item${lugaresRuta.has(punto.id) ? ' sel' : ''}`}
                          onClick={() => toggleLugarRuta(punto.id)}
                        >
                          <div className="ruta-check-box">{lugaresRuta.has(punto.id) && '✓'}</div>
                          <span className="poi-icon" style={{ fontSize: 13, width: 26, height: 26 }}>{punto.icon}</span>
                          <div className="ruta-paso-info">
                            <span className="ruta-paso-nombre">{punto.nombre}</span>
                            <span className="ruta-paso-cat">{punto.categoria}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="ruta-footer">
                  {rutaError && (
                    <p style={{ fontSize: 11.5, color: '#c62828', margin: 0, textAlign: 'center' }}>{rutaError}</p>
                  )}
                  {rutaOrdenada.length > 0 ? (
                    <button className="btn-limpiar-ruta" onClick={nuevaSeleccion}>Cambiar selección</button>
                  ) : (
                    <button
                      className="btn-calcular-ruta"
                      onClick={calcularRuta}
                      disabled={calculando || lugaresRuta.size === 0 || geoStatus !== 'ok'}
                    >
                      {calculando ? 'Calculando...'
                        : lugaresRuta.size === 0 ? 'Selecciona al menos un lugar'
                        : geoStatus !== 'ok' ? 'Esperando ubicación...'
                        : `Trazar ruta · ${lugaresRuta.size} parada${lugaresRuta.size !== 1 ? 's' : ''}`}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="lista-header">
                  <span className="lista-titulo">Puntos de interés</span>
                  <span className="lista-count">{puntosFiltrados.length}</span>
                </div>
                <div className="lista-items">
                  {puntosFiltrados.map(punto => (
                    <div key={punto.id} className={`poi-card${puntoActivo?.id === punto.id ? ' activo' : ''}`}>
                      <button className="poi-card-select" onClick={() => handleSelectPunto(punto)}>
                        <span className="poi-icon">{punto.icon}</span>
                        <div className="poi-info">
                          <span className="poi-nombre">{punto.nombre}</span>
                          <span className="poi-cat-tag">{punto.categoria}</span>
                        </div>
                      </button>
                      <button className="poi-ver-btn" onClick={() => navigate(`/lugar/${punto.id}`)} title="Ver página del lugar">→</button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Lugares destacados ── */}
      <section className="destacados-section">
        <div className="destacados-inner">
          <p className="section-eyebrow">Lo imperdible</p>
          <h2 className="section-title">Lugares que no te puedes perder</h2>
          <div className="destacados-grid">
            {PUNTOS_INTERES.slice(0, 6).map(lugar => (
              <Link key={lugar.id} to={`/lugar/${lugar.id}`} className="dest-card">
                <div className="dest-card-img-wrap">
                  {lugar.foto
                    ? <img src={lugar.foto} alt={lugar.nombre} className="dest-card-img" />
                    : <div className="dest-card-img dest-card-img--grad" style={{ background: lugar.colorGradient }}>
                        <span className="dest-card-emoji">{lugar.icon}</span>
                      </div>
                  }
                  <span className="dest-card-cat">{lugar.categoria}</span>
                </div>
                <div className="dest-card-body">
                  <h3 className="dest-card-nombre">{lugar.nombre}</h3>
                  <p className="dest-card-tagline">{lugar.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="destacados-cta">
            <button className="btn-ver-todos-map" onClick={scrollAlMapa}>
              Ver todos los lugares en el mapa
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA mejorado ── */}
      <section className="cta-section">
        <div className="cta-encuesta">
          <p className="cta-label">Personaliza tu visita</p>
          <h2>¿Primera vez en Popayán?</h2>
          <p className="cta-desc">
            Cuéntanos tus intereses y te ayudamos a descubrir los lugares perfectos para ti.
          </p>
          <button className="btn-abrir-encuesta" onClick={() => setModalAbierto(true)}>
            Crear mi experiencia →
          </button>
        </div>

        <div className="cta-divider" />

        <div className="cta-registro">
          <p className="cta-label">Guarda tus favoritos</p>
          <h3>Crea tu cuenta de viajero</h3>
          <p className="cta-desc">
            Guarda lugares, planifica tu itinerario y recibe recomendaciones personalizadas.
          </p>
          <Link to="/registro" className="btn-registro">
            Registrarme gratis
          </Link>
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
                <p>¡Gracias! Disfruta de tu experiencia en Popayán.</p>
                <button className="btn-enviar" style={{ marginTop: 16 }} onClick={cerrarModal}>Cerrar</button>
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
                      type="text" placeholder="País de origen"
                      value={form.origen}
                      onChange={e => setForm(p => ({ ...p, origen: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>¿Qué edad tienes?</label>
                    <input
                      type="number" placeholder="Edad" min="1" max="120"
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
                          type="button" key={label}
                          className={`pref-chip${form.preferencias.includes(label) ? ' sel' : ''}`}
                          onClick={() => togglePref(label)}
                        >
                          <span className="pref-emoji">{emoji}</span>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="btn-enviar">Continuar →</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
