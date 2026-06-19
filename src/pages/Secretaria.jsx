import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AUTH_KEY } from '../data/lugares'

/* ─────────────────────────────────────────
   Datos de muestra históricos
───────────────────────────────────────── */
const DATOS_SEED = [
  // ── Hoy (18 jun) ──
  { origen: 'Colombia',       edad: '28', preferencias: ['Cultura', 'Historia', 'Arte'],          fecha: '2026-06-18T10:15:00Z' },
  { origen: 'Colombia',       edad: '34', preferencias: ['Gastronomía', 'Turismo'],               fecha: '2026-06-18T11:40:00Z' },
  { origen: 'Venezuela',      edad: '22', preferencias: ['Arte', 'Música'],                       fecha: '2026-06-18T14:05:00Z' },
  { origen: 'España',         edad: '45', preferencias: ['Historia', 'Gastronomía', 'Cultura'],   fecha: '2026-06-18T16:30:00Z' },
  // ── 17 jun ──
  { origen: 'Colombia',       edad: '29', preferencias: ['Música', 'Arte'],                       fecha: '2026-06-17T09:20:00Z' },
  { origen: 'Colombia',       edad: '41', preferencias: ['Historia', 'Cultura'],                  fecha: '2026-06-17T15:00:00Z' },
  // ── 16 jun ──
  { origen: 'Colombia',       edad: '19', preferencias: ['Música', 'Naturaleza'],                 fecha: '2026-06-16T10:00:00Z' },
  { origen: 'Ecuador',        edad: '33', preferencias: ['Turismo', 'Historia'],                  fecha: '2026-06-16T14:30:00Z' },
  // ── 15 jun ──
  { origen: 'Colombia',       edad: '26', preferencias: ['Arte', 'Gastronomía'],                  fecha: '2026-06-15T11:00:00Z' },
  { origen: 'Colombia',       edad: '38', preferencias: ['Cultura', 'Historia', 'Arte'],          fecha: '2026-06-15T16:00:00Z' },
  // ── 14 jun ──
  { origen: 'Colombia',       edad: '31', preferencias: ['Gastronomía', 'Música'],                fecha: '2026-06-14T10:30:00Z' },
  // ── 13 jun ──
  { origen: 'Colombia',       edad: '55', preferencias: ['Historia', 'Cultura'],                  fecha: '2026-06-13T09:00:00Z' },
  // ── 12 jun ──
  { origen: 'Colombia',       edad: '27', preferencias: ['Turismo', 'Naturaleza'],                fecha: '2026-06-12T13:00:00Z' },
  // ── 10 jun ──
  { origen: 'Estados Unidos', edad: '38', preferencias: ['Historia', 'Cultura', 'Gastronomía'],  fecha: '2026-06-10T15:00:00Z' },
  { origen: 'Colombia',       edad: '24', preferencias: ['Arte', 'Música', 'Gastronomía'],        fecha: '2026-06-10T11:00:00Z' },
  { origen: 'Colombia',       edad: '44', preferencias: ['Cultura', 'Historia'],                  fecha: '2026-06-10T09:30:00Z' },
  // ── 8 jun ──
  { origen: 'Argentina',      edad: '31', preferencias: ['Arte', 'Música', 'Gastronomía'],        fecha: '2026-06-08T10:00:00Z' },
  { origen: 'Colombia',       edad: '47', preferencias: ['Historia', 'Turismo'],                  fecha: '2026-06-08T14:00:00Z' },
  // ── 5 jun ──
  { origen: 'México',         edad: '27', preferencias: ['Historia', 'Cultura'],                  fecha: '2026-06-05T12:00:00Z' },
  { origen: 'Venezuela',      edad: '45', preferencias: ['Turismo', 'Gastronomía'],               fecha: '2026-06-05T10:00:00Z' },
  { origen: 'Colombia',       edad: '36', preferencias: ['Arte', 'Gastronomía'],                  fecha: '2026-06-05T16:00:00Z' },
  // ── 3 jun ──
  { origen: 'Colombia',       edad: '29', preferencias: ['Arte', 'Música'],                       fecha: '2026-06-03T09:00:00Z' },
  { origen: 'Colombia',       edad: '34', preferencias: ['Música', 'Cultura'],                    fecha: '2026-06-03T14:00:00Z' },
  // ── 28 may ──
  { origen: 'Colombia',       edad: '32', preferencias: ['Gastronomía', 'Arte', 'Música'],        fecha: '2026-05-28T10:00:00Z' },
  { origen: 'Colombia',       edad: '23', preferencias: ['Deportes', 'Música'],                   fecha: '2026-05-28T11:00:00Z' },
  { origen: 'Colombia',       edad: '52', preferencias: ['Historia', 'Cultura', 'Gastronomía'],   fecha: '2026-05-28T15:00:00Z' },
  // ── 25 may ──
  { origen: 'Ecuador',        edad: '28', preferencias: ['Turismo', 'Naturaleza', 'Arte'],        fecha: '2026-05-25T09:00:00Z' },
  { origen: 'Colombia',       edad: '61', preferencias: ['Historia', 'Gastronomía'],              fecha: '2026-05-25T14:00:00Z' },
  // ── 20 may ──
  { origen: 'España',         edad: '39', preferencias: ['Historia', 'Arte', 'Gastronomía'],      fecha: '2026-05-20T10:00:00Z' },
  { origen: 'Colombia',       edad: '25', preferencias: ['Turismo', 'Naturaleza'],                fecha: '2026-05-20T11:00:00Z' },
  { origen: 'Colombia',       edad: '42', preferencias: ['Cultura', 'Historia'],                  fecha: '2026-05-20T13:00:00Z' },
  { origen: 'Colombia',       edad: '30', preferencias: ['Arte', 'Música', 'Cultura'],            fecha: '2026-05-20T16:00:00Z' },
  // ── 10 may ──
  { origen: 'Chile',          edad: '36', preferencias: ['Historia', 'Gastronomía', 'Arte'],      fecha: '2026-05-10T10:00:00Z' },
  { origen: 'Colombia',       edad: '18', preferencias: ['Música', 'Arte', 'Deportes'],           fecha: '2026-05-10T11:00:00Z' },
  { origen: 'Colombia',       edad: '48', preferencias: ['Gastronomía', 'Naturaleza'],            fecha: '2026-05-10T14:00:00Z' },
  // ── 1 may ──
  { origen: 'Venezuela',      edad: '35', preferencias: ['Turismo', 'Cultura'],                   fecha: '2026-05-01T09:00:00Z' },
  { origen: 'Colombia',       edad: '26', preferencias: ['Arte', 'Música'],                       fecha: '2026-05-01T11:00:00Z' },
  { origen: 'Colombia',       edad: '53', preferencias: ['Historia', 'Cultura', 'Gastronomía'],   fecha: '2026-05-01T15:00:00Z' },
  // ── 20 abr ──
  { origen: 'Colombia',       edad: '37', preferencias: ['Arte', 'Gastronomía'],                  fecha: '2026-04-20T10:00:00Z' },
  { origen: 'Colombia',       edad: '20', preferencias: ['Música', 'Deportes'],                   fecha: '2026-04-20T12:00:00Z' },
  { origen: 'Colombia',       edad: '44', preferencias: ['Cultura', 'Historia', 'Turismo'],       fecha: '2026-04-20T15:00:00Z' },
  // ── 15 abr ──
  { origen: 'Colombia',       edad: '31', preferencias: ['Historia', 'Arte'],                     fecha: '2026-04-15T09:00:00Z' },
  { origen: 'España',         edad: '58', preferencias: ['Historia', 'Gastronomía'],              fecha: '2026-04-15T11:00:00Z' },
  { origen: 'Colombia',       edad: '29', preferencias: ['Arte', 'Música', 'Naturaleza'],         fecha: '2026-04-15T14:00:00Z' },
  { origen: 'Ecuador',        edad: '41', preferencias: ['Turismo', 'Historia', 'Gastronomía'],   fecha: '2026-04-15T16:00:00Z' },
  { origen: 'Colombia',       edad: '33', preferencias: ['Gastronomía', 'Cultura'],               fecha: '2026-04-15T17:00:00Z' },
]

/* ─────────────────────────────────────────
   Constantes
───────────────────────────────────────── */
const PREFS_LISTA = ['Gastronomía','Turismo','Arte','Música','Cultura','Historia','Naturaleza','Deportes']

const GRUPOS_EDAD = [
  { etiqueta: 'Menos de 25', min: 0,  max: 24  },
  { etiqueta: '25 – 35',     min: 25, max: 35  },
  { etiqueta: '36 – 45',     min: 36, max: 45  },
  { etiqueta: '46 – 55',     min: 46, max: 55  },
  { etiqueta: 'Más de 55',   min: 56, max: 120 },
]

const PERIODOS = [
  { label: 'Hoy',         dias: 0  },
  { label: 'Esta semana', dias: 7  },
  { label: 'Este mes',    dias: 30 },
  { label: 'Todo',        dias: -1 },
]

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
function filtrarPeriodo(datos, dias) {
  if (dias === -1) return datos
  const ahora = new Date()
  if (dias === 0) {
    const inicio = new Date(ahora)
    inicio.setHours(0, 0, 0, 0)
    return datos.filter(d => new Date(d.fecha) >= inicio)
  }
  const desde = new Date(ahora)
  desde.setDate(desde.getDate() - dias)
  desde.setHours(0, 0, 0, 0)
  return datos.filter(d => new Date(d.fecha) >= desde)
}

function contarOrigen(datos) {
  const c = {}
  datos.forEach(d => { c[d.origen] = (c[d.origen] || 0) + 1 })
  return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([etiqueta, valor]) => ({ etiqueta, valor }))
}

function contarEdad(datos) {
  return GRUPOS_EDAD.map(g => ({
    etiqueta: g.etiqueta,
    valor: datos.filter(d => {
      const e = parseInt(d.edad, 10)
      return !isNaN(e) && e >= g.min && e <= g.max
    }).length,
  }))
}

function contarPrefs(datos) {
  const c = {}
  PREFS_LISTA.forEach(p => { c[p] = 0 })
  datos.forEach(d => d.preferencias.forEach(p => { if (c[p] !== undefined) c[p]++ }))
  return PREFS_LISTA.map(p => ({ etiqueta: p, valor: c[p] })).sort((a, b) => b.valor - a.valor)
}

function promedioEdad(datos) {
  const validos = datos.map(d => parseInt(d.edad, 10)).filter(e => !isNaN(e))
  if (!validos.length) return 0
  return Math.round(validos.reduce((a, b) => a + b, 0) / validos.length)
}

/* ─────────────────────────────────────────
   Sub-componentes de gráfica
───────────────────────────────────────── */
function BarraH({ datos, color }) {
  const max = Math.max(...datos.map(d => d.valor), 1)
  return (
    <div className="barra-h">
      {datos.map(({ etiqueta, valor }) => (
        <div key={etiqueta} className="barra-h-fila">
          <span className="barra-h-label">{etiqueta}</span>
          <div className="barra-h-track">
            <div
              className="barra-h-fill"
              style={{ width: `${Math.round((valor / max) * 100)}%`, background: color }}
            />
          </div>
          <span className="barra-h-valor">{valor}</span>
        </div>
      ))}
    </div>
  )
}

function BarraV({ datos, color }) {
  const max = Math.max(...datos.map(d => d.valor), 1)
  return (
    <div className="barra-v">
      {datos.map(({ etiqueta, valor }) => (
        <div key={etiqueta} className="barra-v-item">
          <span className="barra-v-num">{valor}</span>
          <div className="barra-v-track">
            <div
              className="barra-v-fill"
              style={{ height: `${Math.round((valor / max) * 100)}%`, background: color }}
            />
          </div>
          <span className="barra-v-label">{etiqueta}</span>
        </div>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   Componente principal
───────────────────────────────────────── */
export default function Secretaria() {
  const navigate = useNavigate()
  const [periodoIdx, setPeriodoIdx] = useState(3)
  const [locales, setLocales]       = useState([])

  useEffect(() => {
    if (!sessionStorage.getItem(AUTH_KEY)) {
      navigate('/secretaria/login', { replace: true })
      return
    }
    const saved = JSON.parse(localStorage.getItem('popayan_encuestas') || '[]')
    setLocales(saved)
  }, [navigate])

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    navigate('/secretaria/login')
  }

  const todos  = useMemo(() => [...DATOS_SEED, ...locales], [locales])
  const datos  = useMemo(() => filtrarPeriodo(todos, PERIODOS[periodoIdx].dias), [todos, periodoIdx])

  const origenes    = useMemo(() => contarOrigen(datos),  [datos])
  const edades      = useMemo(() => contarEdad(datos),    [datos])
  const preferencias = useMemo(() => contarPrefs(datos),  [datos])
  const edadProm    = useMemo(() => promedioEdad(datos),  [datos])

  const topOrigen = origenes[0]?.etiqueta || '—'
  const topPref   = preferencias[0]?.etiqueta || '—'

  const maxPref = preferencias[0]?.valor || 1

  return (
    <div className="sec-page">
      {/* ── Cabecera ── */}
      <div className="sec-hero-band">
        <div className="sec-hero-text">
          <p className="sec-hero-sub">Secretaría de Cultura — Popayán · Cauca</p>
          <h1>Panel de visitantes</h1>
          <p className="sec-hero-desc">Análisis de respuestas a la encuesta de experiencia turística</p>
        </div>
        <div className="sec-hero-right">
          <div className="sec-tabs">
            {PERIODOS.map((p, i) => (
              <button
                key={p.label}
                className={`sec-tab${periodoIdx === i ? ' activo' : ''}`}
                onClick={() => setPeriodoIdx(i)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button className="sec-logout-btn" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="sec-container">
        {/* ── Tarjetas de resumen ── */}
        <div className="sec-cards">
          <div className="sec-card">
            <span className="sec-card-label">Total encuestados</span>
            <span className="sec-card-valor">{datos.length}</span>
            <span className="sec-card-sub">en el período seleccionado</span>
          </div>

          <div className="sec-card">
            <span className="sec-card-label">Edad promedio</span>
            <span className="sec-card-valor">{edadProm || '—'}<span className="sec-card-unit"> años</span></span>
            <span className="sec-card-sub">de los visitantes</span>
          </div>

          <div className="sec-card">
            <span className="sec-card-label">Interés principal</span>
            <span className="sec-card-valor sec-card-valor--md">{topPref}</span>
            <span className="sec-card-sub">{preferencias[0]?.valor || 0} menciones</span>
          </div>

          <div className="sec-card">
            <span className="sec-card-label">País de origen top</span>
            <span className="sec-card-valor sec-card-valor--md">{topOrigen}</span>
            <span className="sec-card-sub">{origenes[0]?.valor || 0} visitantes</span>
          </div>
        </div>

        {/* ── Fila: Procedencia + Grupos de edad ── */}
        <div className="sec-grid-2">
          <div className="sec-panel">
            <h2 className="sec-panel-titulo">País de origen</h2>
            <p className="sec-panel-desc">Países de procedencia de los visitantes</p>
            {datos.length === 0
              ? <p className="sec-sin-datos">Sin datos para este período</p>
              : <BarraH datos={origenes} color="var(--sage)" />
            }
          </div>
          <div className="sec-panel">
            <h2 className="sec-panel-titulo">Grupos de edad</h2>
            <p className="sec-panel-desc">Distribución por rangos etarios</p>
            {datos.length === 0
              ? <p className="sec-sin-datos">Sin datos para este período</p>
              : <BarraV datos={edades} color="var(--terra)" />
            }
          </div>
        </div>

        {/* ── Intereses ── */}
        <div className="sec-panel">
          <h2 className="sec-panel-titulo">Intereses de los visitantes</h2>
          <p className="sec-panel-desc">Número de menciones por categoría</p>
          {datos.length === 0
            ? <p className="sec-sin-datos">Sin datos para este período</p>
            : (
              <div className="sec-prefs-grid">
                {preferencias.map(({ etiqueta, valor }) => (
                  <div key={etiqueta} className="pref-item">
                    <div className="pref-item-header">
                      <span className="pref-item-nombre">{etiqueta}</span>
                      <span className="pref-item-valor">{valor}</span>
                    </div>
                    <div className="pref-item-track">
                      <div
                        className="pref-item-fill"
                        style={{ width: `${Math.round((valor / maxPref) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* ── Respuestas recientes ── */}
        <div className="sec-panel">
          <h2 className="sec-panel-titulo">Respuestas recientes</h2>
          <p className="sec-panel-desc">Últimas 10 encuestas registradas</p>
          {datos.length === 0
            ? <p className="sec-sin-datos">Sin datos para este período</p>
            : (
              <div className="sec-tabla-wrap">
                <table className="sec-tabla">
                  <thead>
                    <tr>
                      <th>Origen</th>
                      <th>Edad</th>
                      <th>Intereses</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...datos].reverse().slice(0, 10).map((r, i) => (
                      <tr key={i}>
                        <td>{r.origen}</td>
                        <td>{r.edad} años</td>
                        <td>
                          <div className="sec-tags">
                            {r.preferencias.map(p => (
                              <span key={p} className="sec-tag">{p}</span>
                            ))}
                          </div>
                        </td>
                        <td className="sec-tabla-fecha">
                          {new Date(r.fecha).toLocaleDateString('es-CO', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
