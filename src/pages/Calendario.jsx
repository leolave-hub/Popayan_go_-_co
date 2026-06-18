import { useState, useMemo } from 'react'
import { EVENTOS, CATEGORIAS_INFO } from '../data/eventos'

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]
const DIAS_CORTO = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']

const toISO = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const getEventosDia = (dateStr) =>
  EVENTOS.filter(ev => dateStr >= ev.fechaInicio && dateStr <= ev.fechaFin)

const getLunesDe = (ref) => {
  const d = new Date(ref)
  const day = d.getDay()
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
  d.setHours(0, 0, 0, 0)
  return d
}

export default function Calendario() {
  const hoy = new Date()
  const hoySt = toISO(hoy)

  const [anio, setAnio] = useState(hoy.getFullYear())
  const [mes, setMes] = useState(hoy.getMonth())
  const [vista, setVista] = useState('mes')
  const [diaActivo, setDiaActivo] = useState(hoySt)
  const [lunesRef, setLunesRef] = useState(() => getLunesDe(hoy))

  const celdasMes = useMemo(() => {
    const primer = new Date(anio, mes, 1)
    const ultimo = new Date(anio, mes + 1, 0)
    const pad = (primer.getDay() + 6) % 7
    const cells = []
    for (let i = 0; i < pad; i++) cells.push(null)
    for (let d = 1; d <= ultimo.getDate(); d++) cells.push(new Date(anio, mes, d))
    return cells
  }, [anio, mes])

  const diasSemana = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(lunesRef)
      d.setDate(lunesRef.getDate() + i)
      return d
    }),
  [lunesRef])

  const prevMes = () => { if (mes === 0) { setMes(11); setAnio(a => a - 1) } else setMes(m => m - 1) }
  const nextMes = () => { if (mes === 11) { setMes(0); setAnio(a => a + 1) } else setMes(m => m + 1) }
  const prevSem = () => { const d = new Date(lunesRef); d.setDate(d.getDate() - 7); setLunesRef(d) }
  const nextSem = () => { const d = new Date(lunesRef); d.setDate(d.getDate() + 7); setLunesRef(d) }
  const prevDia = () => {
    const d = new Date(diaActivo + 'T12:00:00')
    d.setDate(d.getDate() - 1)
    setDiaActivo(toISO(d))
  }
  const nextDia = () => {
    const d = new Date(diaActivo + 'T12:00:00')
    d.setDate(d.getDate() + 1)
    setDiaActivo(toISO(d))
  }

  const irHoy = () => {
    setAnio(hoy.getFullYear())
    setMes(hoy.getMonth())
    setDiaActivo(hoySt)
    setLunesRef(getLunesDe(hoy))
  }

  const semanaLabel = () => {
    const dom = new Date(lunesRef)
    dom.setDate(lunesRef.getDate() + 6)
    const ml = MESES[lunesRef.getMonth()].slice(0, 3)
    const md = MESES[dom.getMonth()].slice(0, 3)
    if (ml === md)
      return `${lunesRef.getDate()} – ${dom.getDate()} ${ml} ${lunesRef.getFullYear()}`
    return `${lunesRef.getDate()} ${ml} – ${dom.getDate()} ${md} ${lunesRef.getFullYear()}`
  }

  const diaLabel = () =>
    new Date(diaActivo + 'T12:00:00').toLocaleDateString('es-CO', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })

  const eventosActivos = getEventosDia(diaActivo)

  const prevAction = vista === 'mes' ? prevMes : vista === 'semana' ? prevSem : prevDia
  const nextAction = vista === 'mes' ? nextMes : vista === 'semana' ? nextSem : nextDia
  const periodoLabel = vista === 'mes'
    ? `${MESES[mes]} ${anio}`
    : vista === 'semana' ? semanaLabel() : diaLabel()

  return (
    <div className="cal-page">
      <div className="cal-hero-band">
        <h1>Calendario Cultural</h1>
        <p>Actividades, eventos y festividades de Popayán</p>
      </div>

      <div className={`cal-layout${vista === 'mes' ? ' cal-layout--split' : ''}`}>
        <div className="cal-main">
          <div className="cal-toolbar">
            <div className="cal-nav-group">
              <button className="cal-nav-btn" onClick={prevAction}>‹</button>
              <span className="cal-periodo">{periodoLabel}</span>
              <button className="cal-nav-btn" onClick={nextAction}>›</button>
            </div>
            <div className="cal-toolbar-right">
              <button className="cal-hoy-btn" onClick={irHoy}>Hoy</button>
              <div className="cal-vistas">
                {['mes', 'semana', 'dia'].map(v => (
                  <button
                    key={v}
                    className={`cal-vista-btn${vista === v ? ' activa' : ''}`}
                    onClick={() => setVista(v)}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vista mes */}
          {vista === 'mes' && (
            <div className="cal-mes">
              <div className="cal-dias-header">
                {DIAS_CORTO.map(d => <span key={d} className="cal-dia-hdr">{d}</span>)}
              </div>
              <div className="cal-grid">
                {celdasMes.map((fecha, idx) => {
                  if (!fecha) return <div key={`v${idx}`} className="cal-celda cal-celda--vacia" />
                  const st = toISO(fecha)
                  const evs = getEventosDia(st)
                  const esHoy = st === hoySt
                  const esSel = st === diaActivo
                  return (
                    <div
                      key={st}
                      className={`cal-celda${esHoy ? ' cal-celda--hoy' : ''}${esSel ? ' cal-celda--sel' : ''}`}
                      onClick={() => setDiaActivo(st)}
                    >
                      <span className="cal-celda-num">{fecha.getDate()}</span>
                      <div className="cal-celda-evs">
                        {evs.slice(0, 2).map(e => {
                          const info = CATEGORIAS_INFO[e.categoria]
                          return (
                            <span
                              key={e.id}
                              className="cal-ev-pill"
                              style={{
                                background: info?.color + '28',
                                color: info?.color,
                                borderLeft: `2px solid ${info?.color}`,
                              }}
                            >
                              {e.titulo.length > 15 ? e.titulo.slice(0, 15) + '…' : e.titulo}
                            </span>
                          )
                        })}
                        {evs.length > 2 && (
                          <span className="cal-ev-mas">+{evs.length - 2} más</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Vista semana */}
          {vista === 'semana' && (
            <div className="cal-semana">
              {diasSemana.map((fecha) => {
                const st = toISO(fecha)
                const evs = getEventosDia(st)
                const esHoy = st === hoySt
                return (
                  <div key={st} className={`cal-sem-col${esHoy ? ' cal-sem-col--hoy' : ''}`}>
                    <div
                      className="cal-sem-header"
                      onClick={() => { setDiaActivo(st); setVista('dia') }}
                    >
                      <span className="cal-sem-nombre">{DIAS_CORTO[(fecha.getDay() + 6) % 7]}</span>
                      <span className={`cal-sem-num${esHoy ? ' cal-sem-num--hoy' : ''}`}>
                        {fecha.getDate()}
                      </span>
                    </div>
                    <div className="cal-sem-body">
                      {evs.length === 0
                        ? <span className="cal-sem-vacio">—</span>
                        : evs.map(e => {
                            const info = CATEGORIAS_INFO[e.categoria]
                            return (
                              <div
                                key={e.id}
                                className="cal-sem-ev"
                                style={{ borderLeft: `3px solid ${info?.color}`, background: info?.color + '18' }}
                              >
                                <span className="cal-sem-ev-hora">{e.hora}</span>
                                <span className="cal-sem-ev-titulo">{e.titulo}</span>
                              </div>
                            )
                          })
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Vista día */}
          {vista === 'dia' && (
            <div className="cal-dia-vista">
              <h2 className="cal-dia-fecha">{diaLabel()}</h2>
              {eventosActivos.length === 0
                ? (
                  <div className="cal-dia-vacio">
                    <p className="cal-dia-vacio-texto">No hay eventos programados para este día</p>
                    <span className="cal-dia-vacio-hint">Navega a otra fecha con las flechas</span>
                  </div>
                )
                : (
                  <div className="cal-dia-lista">
                    {eventosActivos.map(e => {
                      const info = CATEGORIAS_INFO[e.categoria]
                      return (
                        <div
                          key={e.id}
                          className="cal-dia-ev"
                          style={{ borderLeft: `4px solid ${info?.color}` }}
                        >
                          <div className="cal-dia-ev-top">
                            <span className="cal-dia-ev-dot" style={{ background: info?.color }} />
                            <div>
                              <span className="cal-dia-ev-cat" style={{ color: info?.color }}>
                                {e.categoria}
                              </span>
                              <h3 className="cal-dia-ev-titulo">{e.titulo}</h3>
                            </div>
                          </div>
                          <div className="cal-dia-ev-meta">
                            <span><strong>Hora:</strong> {e.hora}</span>
                            <span><strong>Lugar:</strong> {e.lugar}</span>
                          </div>
                          <p className="cal-dia-ev-desc">{e.descripcion}</p>
                        </div>
                      )
                    })}
                  </div>
                )
              }
            </div>
          )}
        </div>

        {/* Sidebar (solo vista mes) */}
        {vista === 'mes' && (
          <aside className="cal-aside">
            <h3 className="cal-aside-titulo">
              {new Date(diaActivo + 'T12:00:00').toLocaleDateString('es-CO', {
                weekday: 'long', day: 'numeric', month: 'long',
              })}
            </h3>

            {eventosActivos.length === 0
              ? (
                <div className="cal-aside-vacio">
                  <p>Sin eventos este día</p>
                </div>
              )
              : (
                <div className="cal-aside-lista">
                  {eventosActivos.map(e => {
                    const info = CATEGORIAS_INFO[e.categoria]
                    return (
                      <div
                        key={e.id}
                        className="cal-aside-item"
                        style={{ borderLeft: `3px solid ${info?.color}` }}
                      >
                        <div className="cal-aside-cat" style={{ color: info?.color }}>
                          {e.categoria}
                        </div>
                        <div className="cal-aside-nombre">{e.titulo}</div>
                        <div className="cal-aside-meta">
                          <span>Hora: {e.hora}</span>
                          <span>Lugar: {e.lugar}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            }
          </aside>
        )}
      </div>
    </div>
  )
}
