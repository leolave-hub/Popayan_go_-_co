import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../components/MapView'
import heroImg from '../assets/hero.jpg'
import { PUNTOS_INTERES } from '../data/lugares'

const PREFERENCIAS = [
  { label: 'Gastronomía', emoji: '🍽' },
  { label: 'Turismo', emoji: '🗺' },
  { label: 'Arte', emoji: '🎨' },
  { label: 'Cultura', emoji: '🏛' },
  { label: 'Historia', emoji: '📜' },
  { label: 'Naturaleza', emoji: '🌿' },
  { label: 'Deportes', emoji: '⚽' },
]

const CATEGORIAS = ['Todo', 'Gastronomía', 'Arte', 'Cultura', 'Turismo', 'Vida Nocturna']

// ── Algoritmo vecino más cercano para ordenar paradas ──
function ordenarPorCercania(inicio, lugares) {
  const pendientes = [...lugares]
  const ordenados = []
  let actual = inicio
  while (pendientes.length > 0) {
    let minIdx = 0
    let minDist = Infinity
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

// ── Obtiene la ruta caminando desde Mapbox Directions API ──
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

export default function Home() {
  const navigate = useNavigate()
  const [categoriaActiva, setCategoriaActiva] = useState('Todo')
  const [puntoActivo, setPuntoActivo] = useState(null)
  const [form, setForm] = useState({ origen: '', edad: '', preferencias: [] })
  const [enviado, setEnviado] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)

  // ── Estado de ruta turística ──
  const [modoRuta, setModoRuta] = useState(false)
  const [geoStatus, setGeoStatus] = useState('idle') // 'idle' | 'pidiendo' | 'ok' | 'error'
  const [userLocation, setUserLocation] = useState(null)
  const [lugaresRuta, setLugaresRuta] = useState(new Set())
  const [rutaGeojson, setRutaGeojson] = useState(null)
  const [rutaOrdenada, setRutaOrdenada] = useState([])
  const [calculando, setCalculando] = useState(false)
  const [rutaError, setRutaError] = useState(null)

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

  // ── Funciones de ruta turística ──
  const pedirUbicacion = () => {
    if (!navigator.geolocation) {
      setGeoStatus('error')
      return
    }
    setGeoStatus('pidiendo')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.longitude, pos.coords.latitude])
        setGeoStatus('ok')
      },
      () => setGeoStatus('error'),
      { timeout: 12000 }
    )
  }

  const activarModoRuta = () => {
    setModoRuta(true)
    pedirUbicacion()
  }

  const toggleLugarRuta = (id) => {
    setLugaresRuta(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const calcularRuta = async () => {
    if (!userLocation || lugaresRuta.size === 0) return
    setCalculando(true)
    setRutaError(null)
    try {
      const seleccionados = PUNTOS_INTERES.filter(p => lugaresRuta.has(p.id))
      const ordenados = ordenarPorCercania(userLocation, seleccionados)
      setRutaOrdenada(ordenados)
      const coordenadas = [userLocation, ...ordenados.map(p => p.coords)]
      const geometry = await fetchRutaMapbox(coordenadas)
      setRutaGeojson(geometry)
    } catch {
      setRutaError('No se pudo calcular la ruta. Intenta de nuevo.')
    } finally {
      setCalculando(false)
    }
  }

  const nuevaSeleccion = () => {
    setRutaOrdenada([])
    setRutaGeojson(null)
    setLugaresRuta(new Set())
    setRutaError(null)
  }

  const limpiarRuta = () => {
    setModoRuta(false)
    setGeoStatus('idle')
    setUserLocation(null)
    setLugaresRuta(new Set())
    setRutaGeojson(null)
    setRutaOrdenada([])
    setRutaError(null)
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
              onPuntoClick={modoRuta ? null : (punto) => navigate(`/lugar/${punto.id}`)}
              ruta={rutaGeojson}
              userLocation={userLocation}
            />
          </div>

          {/* ── Panel derecho: lista normal o planificador de ruta ── */}
          <div className="mapa-lista-panel">
            {modoRuta ? (
              <>
                {/* Encabezado del planificador */}
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

                {/* Contenido: selección o resultado */}
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
                        <button className="btn-reintentar-geo" onClick={pedirUbicacion}>
                          Reintentar
                        </button>
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
                          <div className="ruta-check-box">
                            {lugaresRuta.has(punto.id) && '✓'}
                          </div>
                          <span className="poi-icon" style={{ fontSize: 13, width: 26, height: 26 }}>
                            {punto.icon}
                          </span>
                          <div className="ruta-paso-info">
                            <span className="ruta-paso-nombre">{punto.nombre}</span>
                            <span className="ruta-paso-cat">{punto.categoria}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer con acciones */}
                <div className="ruta-footer">
                  {rutaError && (
                    <p style={{ fontSize: 11.5, color: '#c62828', margin: 0, textAlign: 'center' }}>
                      {rutaError}
                    </p>
                  )}
                  {rutaOrdenada.length > 0 ? (
                    <button className="btn-limpiar-ruta" onClick={nuevaSeleccion}>
                      Cambiar selección
                    </button>
                  ) : (
                    <button
                      className="btn-calcular-ruta"
                      onClick={calcularRuta}
                      disabled={calculando || lugaresRuta.size === 0 || geoStatus !== 'ok'}
                    >
                      {calculando
                        ? 'Calculando...'
                        : lugaresRuta.size === 0
                          ? 'Selecciona al menos un lugar'
                          : geoStatus !== 'ok'
                            ? 'Esperando ubicación...'
                            : `Trazar ruta · ${lugaresRuta.size} parada${lugaresRuta.size !== 1 ? 's' : ''}`
                      }
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
              </>
            )}
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
