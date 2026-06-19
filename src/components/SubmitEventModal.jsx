import { useState } from 'react'
import './SubmitEventModal.css'

export default function SubmitEventModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipoPostulante: 'voluntario',
    empresa: '',
    titulo: '',
    categoria: 'Cultura',
    fechaInicio: '',
    fechaFin: '',
    hora: '',
    lugar: '',
    descripcion: '',
    presupuesto: '',
    contactoEmergencia: '',
  })

  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  const categorias = ['Arte', 'Gastronomía', 'Cultura', 'Turismo', 'Deportes']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validaciones básicas
    if (!formData.nombre || !formData.email || !formData.titulo || !formData.fechaInicio) {
      setError('Por favor completa todos los campos obligatorios')
      return
    }

    if (formData.tipoPostulante === 'empresario' && !formData.empresa) {
      setError('Debe especificar el nombre de la empresa')
      return
    }

    // Guardar en localStorage
    const eventosPostulados = JSON.parse(localStorage.getItem('eventosPostulados') || '[]')
    eventosPostulados.push({
      ...formData,
      id: Date.now(),
      fechaPostulacion: new Date().toLocaleDateString('es-CO'),
    })
    localStorage.setItem('eventosPostulados', JSON.stringify(eventosPostulados))

    setEnviado(true)
    setTimeout(() => {
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        tipoPostulante: 'voluntario',
        empresa: '',
        titulo: '',
        categoria: 'Cultura',
        fechaInicio: '',
        fechaFin: '',
        hora: '',
        lugar: '',
        descripcion: '',
        presupuesto: '',
        contactoEmergencia: '',
      })
      setEnviado(false)
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="submit-modal-overlay" onClick={onClose}>
      <div className="submit-modal" onClick={e => e.stopPropagation()}>
        <button className="submit-modal-close" onClick={onClose}>✕</button>

        <div className="submit-modal-header">
          <h2>Postula un evento</h2>
          <p>Comparte tu evento con la comunidad de Popayán</p>
        </div>

        {enviado ? (
          <div className="submit-success">
            <div className="success-icon">✓</div>
            <h3>¡Evento postulado con éxito!</h3>
            <p>Gracias por compartir tu evento. Será revisado por nuestro equipo.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="submit-form">
            {error && <div className="submit-error">{error}</div>}

            {/* TIPO DE POSTULANTE */}
            <div className="form-section">
              <h4>Tipo de postulante *</h4>
              <div className="postulante-options">
                {[
                  { value: 'empresario', label: 'Empresario', icon: '' },
                  { value: 'colaborador', label: 'Colaborador', icon: '' },
                  { value: 'voluntario', label: 'Voluntario', icon: '' },
                ].map(opt => (
                  <label key={opt.value} className="postulante-option">
                    <input
                      type="radio"
                      name="tipoPostulante"
                      value={opt.value}
                      checked={formData.tipoPostulante === opt.value}
                      onChange={handleChange}
                    />
                    <span className="option-icon">{opt.icon}</span>
                    <span className="option-label">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* DATOS PERSONALES */}
            <div className="form-section">
              <h4>Tu información</h4>
              <div className="form-row">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo *"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Correo electrónico *"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
                {formData.tipoPostulante === 'empresario' && (
                  <input
                    type="text"
                    name="empresa"
                    placeholder="Nombre de la empresa *"
                    value={formData.empresa}
                    onChange={handleChange}
                    required={formData.tipoPostulante === 'empresario'}
                  />
                )}
              </div>
            </div>

            {/* DATOS DEL EVENTO */}
            <div className="form-section">
              <h4>Información del evento</h4>
              <input
                type="text"
                name="titulo"
                placeholder="Título del evento *"
                value={formData.titulo}
                onChange={handleChange}
                required
              />

              <div className="form-row">
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="lugar"
                  placeholder="Lugar del evento"
                  value={formData.lugar}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-input-group">
                  <label>Fecha inicio *</label>
                  <input
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-input-group">
                  <label>Fecha fin</label>
                  <input
                    type="date"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <input
                type="time"
                name="hora"
                placeholder="Hora"
                value={formData.hora}
                onChange={handleChange}
              />

              <textarea
                name="descripcion"
                placeholder="Descripción del evento"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
              ></textarea>
            </div>

            {/* DATOS ADICIONALES */}
            <div className="form-section">
              <h4>Información adicional</h4>
              {formData.tipoPostulante === 'empresario' && (
                <input
                  type="number"
                  name="presupuesto"
                  placeholder="Presupuesto aproximado (opcional)"
                  value={formData.presupuesto}
                  onChange={handleChange}
                />
              )}
              <input
                type="tel"
                name="contactoEmergencia"
                placeholder="Contacto de emergencia"
                value={formData.contactoEmergencia}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn-cancelar">
                Cancelar
              </button>
              <button type="submit" className="btn-postular">
                Postular evento
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
