import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const POPAYAN_CENTER = [-76.6069, 2.4427]
const INITIAL_ZOOM = 15
const INITIAL_PITCH = 60
const INITIAL_BEARING = -17

export default function MapView({ puntos = [], activePunto = null }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const [error, setError] = useState(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN
    if (!token || token === 'your_mapbox_token_here') {
      setError('Falta el token de Mapbox. Agrega VITE_MAPBOX_TOKEN en tu archivo .env')
      return
    }

    mapboxgl.accessToken = token

    let map
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/standard',
        center: POPAYAN_CENTER,
        zoom: INITIAL_ZOOM,
        pitch: INITIAL_PITCH,
        bearing: INITIAL_BEARING,
        antialias: true,
      })

      mapRef.current = map
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.on('load', () => {
        map.setConfigProperty('basemap', 'show3dObjects', true)
        setMapReady(true)
      })
      map.on('error', (e) => setError(e.error?.message ?? 'Error al cargar el mapa'))
    } catch (e) {
      setError(e.message)
    }

    return () => {
      map?.remove()
      mapRef.current = null
      setMapReady(false)
    }
  }, [])

  useEffect(() => {
    if (!mapReady || !mapRef.current) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    puntos.forEach(punto => {
      const el = document.createElement('div')
      el.className = 'map-marker'
      el.innerHTML = `<span>${punto.icon}</span>`

      const popup = new mapboxgl.Popup({ offset: 30, closeButton: false, maxWidth: '200px' })
        .setHTML(`<strong>${punto.nombre}</strong><p>${punto.descripcion}</p>`)

      const marker = new mapboxgl.Marker(el)
        .setLngLat(punto.coords)
        .setPopup(popup)
        .addTo(mapRef.current)

      markersRef.current.push(marker)
    })
  }, [puntos, mapReady])

  useEffect(() => {
    if (!mapReady || !activePunto || !mapRef.current) return
    mapRef.current.flyTo({
      center: activePunto.coords,
      zoom: 17,
      duration: 1000,
    })
  }, [activePunto, mapReady])

  if (error) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e', color: '#fff', fontSize: 16, textAlign: 'center', padding: 24 }}>
        <p>{error}</p>
      </div>
    )
  }

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
