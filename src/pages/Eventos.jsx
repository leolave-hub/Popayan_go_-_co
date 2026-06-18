import { useState, useMemo } from 'react'
import { EVENTOS, CATEGORIAS_INFO } from '../data/eventos'
import './Eventos.css'

const FILTROS_CAT = ['Todo', 'Música', 'Arte', 'Gastronomía', 'Cultura', 'Turismo', 'Deportes']
const FILTROS_EST = ['Todo', 'En curso', 'Próximo', 'Finalizado']

const toISO = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const hoyStr = toISO(new Date())

const getEstado = (ev) => {
  if (ev.fechaFin < hoyStr) return 'Finalizado'
  if (ev.fechaInicio > hoyStr) return 'Próximo'
  return 'En curso'
}

const formatFecha = (str) =>
  new Date(str + 'T12:00:00').toLocaleDateString('es-CO', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

export default function Eventos() {
  const [cat, setCat] = useState('Todo')
  const [est, setEst] = useState('Todo')

  const filtrados = useMemo(() =>
    EVENTOS
      .filter(ev => {
        const catOk = cat === 'Todo' || ev.categoria === cat
        const estOk = est === 'Todo' || getEstado(ev) === est
        return catOk && estOk
      })
      .sort((a, b) => {
        const orden = { 'En curso': 0, 'Próximo': 1, 'Finalizado': 2 }
        const diff = orden[getEstado(a)] - orden[getEstado(b)]
        return diff !== 0 ? diff : a.fechaInicio.localeCompare(b.fechaInicio)
      }),
  [cat, est])

  return (
    <div className="ev-page">
      <div className="ev-hero-band">
        <h1>Eventos en Popayán</h1>
        <p>Descubre todo lo que está pasando en la Ciudad Blanca</p>
      </div>

      <div className="ev-container">
        {/* ── Filtros ── */}
        <div className="ev-filtros-bar">
          <div className="ev-filtro-grupo">
            <span className="ev-filtro-label">Categoría</span>
            <div className="ev-chips">
              {FILTROS_CAT.map(f => (
                <button
                  key={f}
                  className={`ev-chip${cat === f ? ' activo' : ''}`}
                  onClick={() => setCat(f)}
                >
                  {f !== 'Todo' && CATEGORIAS_INFO[f] && (
                    <span className="ev-chip-icono">{CATEGORIAS_INFO[f].icono}</span>
                  )}
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="ev-filtro-grupo">
            <span className="ev-filtro-label">Estado</span>
            <div className="ev-chips">
              {FILTROS_EST.map(e => (
                <button
                  key={e}
                  className={`ev-chip ev-chip--estado ev-chip--${e.toLowerCase().replace(' ', '-')}${est === e ? ' activo' : ''}`}
                  onClick={() => setEst(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Resultados ── */}
        {filtrados.length === 0
          ? (
            <div className="ev-vacio">
              <span>🔍</span>
              <h3>Sin resultados</h3>
              <p>No se encontraron eventos con los filtros seleccionados</p>
              <button className="ev-reset" onClick={() => { setCat('Todo'); setEst('Todo') }}>
                Limpiar filtros
              </button>
            </div>
          )
          : (
            <>
              <p className="ev-count">
                {filtrados.length} evento{filtrados.length !== 1 ? 's' : ''}
              </p>
              <div className="ev-grid">
                {filtrados.map(ev => {
                  const info = CATEGORIAS_INFO[ev.categoria]
                  const estado = getEstado(ev)
                  const mismaFecha = ev.fechaInicio === ev.fechaFin
                  return (
                    <div key={ev.id} className="ev-card">
                      <div
                        className="ev-card-banner"
                        style={{ background: `linear-gradient(135deg, ${info?.color}DD 0%, ${info?.color}88 100%)` }}
                      >
                        <span className="ev-banner-icono">{info?.icono}</span>
                        <span className={`ev-estado-badge ev-estado--${estado.toLowerCase().replace(' ', '-')}`}>
                          {estado}
                        </span>
                      </div>

                      <div className="ev-card-body">
                        <span
                          className="ev-cat-badge"
                          style={{ color: info?.color, background: info?.color + '22' }}
                        >
                          {ev.categoria}
                        </span>

                        <h3 className="ev-titulo">{ev.titulo}</h3>

                        <div className="ev-meta">
                          <div className="ev-meta-row">
                            <span className="ev-meta-icono">📅</span>
                            <span>
                              {mismaFecha
                                ? formatFecha(ev.fechaInicio)
                                : `${formatFecha(ev.fechaInicio)} – ${formatFecha(ev.fechaFin)}`}
                            </span>
                          </div>
                          <div className="ev-meta-row">
                            <span className="ev-meta-icono">🕐</span>
                            <span>{ev.hora}</span>
                          </div>
                          <div className="ev-meta-row">
                            <span className="ev-meta-icono">📍</span>
                            <span>{ev.lugar}</span>
                          </div>
                        </div>

                        <p className="ev-desc">{ev.descripcion}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}
