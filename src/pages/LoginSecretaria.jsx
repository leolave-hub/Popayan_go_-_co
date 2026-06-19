import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AUTH_KEY } from '../data/lugares'
import './LoginSecretaria.css'

const VALID_USER = 'secretaria'
const VALID_PASS = 'popayan2024'

export default function LoginSecretaria() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ usuario: '', contrasena: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      if (form.usuario === VALID_USER && form.contrasena === VALID_PASS) {
        sessionStorage.setItem(AUTH_KEY, 'true')
        navigate('/secretaria')
      } else {
        setError('Credenciales incorrectas. Verifica tu usuario y contraseña.')
        setLoading(false)
      }
    }, 900)
  }

  return (
    <div className="login-page">
      <div className="login-bg-orb login-bg-orb--1" />
      <div className="login-bg-orb login-bg-orb--2" />

      <div className="login-card">
        <Link to="/" className="login-brand">
          <span className="login-brand-dot" />
          Popayán Go
        </Link>

        <div className="login-header">
          <div className="login-badge">
            <span>🏛️</span>
            Acceso institucional
          </div>
          <h1>Secretaría de Cultura</h1>
          <p>Ingresa tus credenciales institucionales para acceder al panel de análisis</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="login-usuario">Usuario</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">👤</span>
              <input
                id="login-usuario"
                type="text"
                placeholder="secretaria"
                value={form.usuario}
                onChange={e => setForm(p => ({ ...p, usuario: e.target.value }))}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="login-pass">Contraseña</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">🔒</span>
              <input
                id="login-pass"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••••"
                value={form.contrasena}
                onChange={e => setForm(p => ({ ...p, contrasena: e.target.value }))}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-toggle-pass"
                onClick={() => setShowPass(v => !v)}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error" role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="login-btn-inner">
                <span className="login-spinner" />
                Verificando acceso...
              </span>
            ) : (
              <span className="login-btn-inner">
                Ingresar al panel
                <span className="login-btn-arrow">→</span>
              </span>
            )}
          </button>
        </form>

        <div className="login-divider" />

        <div className="login-hint">
          <span className="login-hint-icon">💡</span>
          <span>
            Credenciales de demostración: usuario <code>secretaria</code> · contraseña <code>popayan2024</code>
          </span>
        </div>

        <div className="login-footer">
          <span>Panel oficial · Municipio de Popayán</span>
          <span>·</span>
          <span>Cauca, Colombia</span>
        </div>
      </div>
    </div>
  )
}
