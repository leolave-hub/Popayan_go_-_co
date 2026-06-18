import { useState } from 'react'
import { Link } from 'react-router-dom'
import './RegistroTurista.css'

const INITIAL = {
  nombre: '',
  apellido: '',
  tipoDocumento: 'CC',
  numeroDocumento: '',
  email: '',
  telefono: '',
  procedencia: '',
  fechaLlegada: '',
  fechaSalida: '',
}

export default function RegistroTurista() {
  const [form, setForm] = useState(INITIAL)
  const [enviado, setEnviado] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="registro-page">
        <div className="registro-card success-card">
          <div className="success-icon">✓</div>
          <h2>¡Registro exitoso!</h2>
          <p>Bienvenido a Popayán, {form.nombre}. Tu información fue guardada correctamente.</p>
          <Link to="/" className="btn-volver">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="registro-page">
      <div className="registro-card">
        <Link to="/" className="back-link">← Volver</Link>
        <div className="registro-header">
          <h1>Registro de Turista</h1>
          <p>Completa tus datos para disfrutar de la experiencia en Popayán</p>
        </div>

        <form onSubmit={handleSubmit} className="registro-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellido">Apellido *</label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Tu apellido"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipoDocumento">Tipo de documento</label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={form.tipoDocumento}
                onChange={handleChange}
              >
                <option value="CC">Cédula de ciudadanía</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="PA">Pasaporte</option>
                <option value="TI">Tarjeta de identidad</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="numeroDocumento">Número de documento *</label>
              <input
                id="numeroDocumento"
                name="numeroDocumento"
                type="text"
                value={form.numeroDocumento}
                onChange={handleChange}
                placeholder="Ej: 1234567890"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Ej: 3001234567"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="procedencia">Ciudad / País de procedencia *</label>
            <input
              id="procedencia"
              name="procedencia"
              type="text"
              value={form.procedencia}
              onChange={handleChange}
              placeholder="Ej: Bogotá, Colombia"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fechaLlegada">Fecha de llegada *</label>
              <input
                id="fechaLlegada"
                name="fechaLlegada"
                type="date"
                value={form.fechaLlegada}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="fechaSalida">Fecha de salida</label>
              <input
                id="fechaSalida"
                name="fechaSalida"
                type="date"
                value={form.fechaSalida}
                onChange={handleChange}
                min={form.fechaLlegada}
              />
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Registrarme
          </button>
        </form>
      </div>
    </div>
  )
}
