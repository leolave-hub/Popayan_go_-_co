import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { PUNTOS_INTERES } from '../data/lugares'
import { EVENTOS } from '../data/eventos'
import './SearchOverlay.css'

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!isOpen) return null

  const q = query.toLowerCase().trim()

  const lugares = q.length < 2 ? [] : PUNTOS_INTERES.filter(p =>
    p.nombre.toLowerCase().includes(q) ||
    p.categoria.toLowerCase().includes(q) ||
    p.descripcionCorta?.toLowerCase().includes(q) ||
    p.tagline?.toLowerCase().includes(q)
  )

  const eventos = q.length < 2 ? [] : EVENTOS.filter(e =>
    e.titulo.toLowerCase().includes(q) ||
    e.categoria.toLowerCase().includes(q) ||
    e.lugar.toLowerCase().includes(q)
  )

  const noResults = q.length >= 2 && lugares.length === 0 && eventos.length === 0

  const goToLugar = (id) => { navigate(`/lugar/${id}`); onClose() }
  const goToEventos = () => { navigate('/eventos'); onClose() }

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-input-wrap">
          <svg className="search-icon-input" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Buscar lugares, eventos, gastronomía..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="search-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="search-results">
          {q.length < 2 && (
            <div className="search-hint">
              <p>Escribe al menos 2 caracteres para buscar</p>
              <div className="search-sugerencias">
                <span className="search-sug-label">Sugerencias populares</span>
                <div className="search-sug-chips">
                  {['Parque Caldas', 'Gastronomía', 'Semana Santa', 'Arte', 'Teatro'].map(s => (
                    <button key={s} className="search-sug-chip" onClick={() => setQuery(s)}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {noResults && (
            <div className="search-no-results">
              <span>Sin resultados para "{query}"</span>
              <p>Intenta con otro término o explora el mapa interactivo</p>
            </div>
          )}

          {lugares.length > 0 && (
            <div className="search-group">
              <span className="search-group-label">Lugares turísticos</span>
              {lugares.map(p => (
                <button key={p.id} className="search-result-item" onClick={() => goToLugar(p.id)}>
                  {p.foto
                    ? <img src={p.foto} alt={p.nombre} className="search-result-img" />
                    : <div className="search-result-img search-result-img--grad" style={{ background: p.colorGradient }}><span>{p.icon}</span></div>
                  }
                  <div className="search-result-info">
                    <span className="search-result-nombre">{p.nombre}</span>
                    <span className="search-result-cat">{p.categoria} · {p.descripcionCorta}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              ))}
            </div>
          )}

          {eventos.length > 0 && (
            <div className="search-group">
              <span className="search-group-label">Eventos</span>
              {eventos.slice(0, 4).map(e => (
                <button key={e.id} className="search-result-item" onClick={goToEventos}>
                  <div className="search-result-img search-result-ev">
                    <span>📅</span>
                  </div>
                  <div className="search-result-info">
                    <span className="search-result-nombre">{e.titulo}</span>
                    <span className="search-result-cat">{e.categoria} · {e.lugar}</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
