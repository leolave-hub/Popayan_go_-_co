import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const POPAYAN_CENTER = [-76.6069, 2.4427]
const INITIAL_ZOOM = 15
const INITIAL_PITCH = 60
const INITIAL_BEARING = -17

export default function MapView({
  puntos = [],
  activePunto = null,
  onPuntoClick = null,
  ruta = null,
  userLocation = null,
}) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const userMarkerRef = useRef(null)
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
      userMarkerRef.current?.remove()
      userMarkerRef.current = null
      map?.remove()
      mapRef.current = null
      setMapReady(false)
    }
  }, [])

  // Marcadores de puntos de interés
  useEffect(() => {
    if (!mapReady || !mapRef.current) return

    markersRef.current.forEach(({ marker }) => marker.remove())
    markersRef.current = []

    puntos.forEach(punto => {
      const el = document.createElement('div')
      el.className = 'map-marker'
      el.innerHTML = `<span>${punto.icon}</span>`

      const popup = new mapboxgl.Popup({ offset: 30, closeButton: false, maxWidth: '220px' })
        .setHTML(
          `<div class="mapbox-popup-inner">` +
          `<strong>${punto.nombre}</strong>` +
          `<p>${punto.descripcion}</p>` +
          `<a href="/lugar/${punto.id}" class="mapbox-popup-btn">Ver lugar →</a>` +
          `</div>`
        )

      const marker = new mapboxgl.Marker(el)
        .setLngLat(punto.coords)
        .setPopup(popup)
        .addTo(mapRef.current)

      if (onPuntoClick) {
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          onPuntoClick(punto)
        })
      }

      markersRef.current.push({ id: punto.id, marker, el })
    })
  }, [puntos, mapReady])

  // Marcador activo
  useEffect(() => {
    if (!mapReady || !mapRef.current) return

    markersRef.current.forEach(({ id, marker, el }) => {
      const isActive = activePunto?.id === id
      el.classList.toggle('map-marker--active', isActive)
      const popup = marker.getPopup()
      if (isActive && !popup.isOpen()) marker.togglePopup()
      if (!isActive && popup.isOpen()) marker.togglePopup()
    })

    if (!activePunto) return

    mapRef.current.flyTo({
      center: activePunto.coords,
      zoom: 17,
      duration: 1000,
    })
  }, [activePunto, mapReady])

  // Línea de ruta turística
  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const map = mapRef.current

    if (map.getLayer('ruta-line')) map.removeLayer('ruta-line')
    if (map.getLayer('ruta-casing')) map.removeLayer('ruta-casing')
    if (map.getSource('ruta')) map.removeSource('ruta')

    if (!ruta) return

    map.addSource('ruta', {
      type: 'geojson',
      data: { type: 'Feature', geometry: ruta },
    })
    map.addLayer({
      id: 'ruta-casing',
      type: 'line',
      source: 'ruta',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#ffffff', 'line-width': 8, 'line-opacity': 0.8 },
    })
    map.addLayer({
      id: 'ruta-line',
      type: 'line',
      source: 'ruta',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#3D88F5', 'line-width': 4 },
    })

    // Ajustar vista para mostrar toda la ruta
    const coords = ruta.coordinates
    if (coords?.length > 0) {
      const lngs = coords.map(c => c[0])
      const lats = coords.map(c => c[1])
      map.fitBounds(
        [
          [Math.min(...lngs) - 0.002, Math.min(...lats) - 0.002],
          [Math.max(...lngs) + 0.002, Math.max(...lats) + 0.002],
        ],
        { padding: 60, duration: 1400 }
      )
    }
  }, [ruta, mapReady])

  // Marcador de ubicación del usuario
  useEffect(() => {
    if (!mapReady || !mapRef.current) return

    userMarkerRef.current?.remove()
    userMarkerRef.current = null

    if (!userLocation) return

    const el = document.createElement('div')
    el.className = 'user-location-dot'

    userMarkerRef.current = new mapboxgl.Marker(el)
      .setLngLat(userLocation)
      .addTo(mapRef.current)

    if (!ruta) {
      mapRef.current.flyTo({ center: userLocation, zoom: 15, duration: 1200 })
    }
  }, [userLocation, mapReady])

  if (error) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e', color: '#fff', fontSize: 16, textAlign: 'center', padding: 24 }}>
        <p>{error}</p>
      </div>
    )
  }

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
