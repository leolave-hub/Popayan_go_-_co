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
  onVerMas = null,
  ruta = null,
  userLocation = null,
}) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const userMarkerRef = useRef(null)
  const [error, setError] = useState(null)
  const [mapReady, setMapReady] = useState(false)

  const onPuntoClickRef = useRef(onPuntoClick)
  const onVerMasRef = useRef(onVerMas)
  const closingProgrammaticallyRef = useRef(false)
  useEffect(() => { onPuntoClickRef.current = onPuntoClick }, [onPuntoClick])
  useEffect(() => { onVerMasRef.current = onVerMas }, [onVerMas])

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

    markersRef.current.forEach(({ marker, popup }) => { popup.remove(); marker.remove() })
    markersRef.current = []

    puntos.forEach(punto => {
      const el = document.createElement('div')
      el.className = 'map-marker'
      el.innerHTML = `
        <div class="map-marker-pin">${punto.icon}</div>
        <span class="map-marker-label">${punto.nombre}</span>
      `

      const popup = new mapboxgl.Popup({
        offset: [0, -10],
        closeButton: true,
        maxWidth: '300px',
        className: 'mpopup-wrap',
        anchor: 'bottom',
      })
        .setHTML(
          `<div class="mpopup">
            <div class="mpopup-header">
              <span class="mpopup-icon">${punto.icon}</span>
              <div class="mpopup-title-wrap">
                <strong class="mpopup-title">${punto.nombre}</strong>
                <span class="mpopup-cat">${punto.categoria}</span>
              </div>
            </div>
            <p class="mpopup-desc">${punto.descripcionCorta}</p>
            ${punto.audio
              ? `<div class="mpopup-audio-wrap">
                  <span class="mpopup-audio-lbl">🎧 Narración</span>
                  <audio controls src="${punto.audio}" class="mpopup-audio" preload="none"></audio>
                 </div>`
              : ''}
            <button class="mpopup-ver-btn">Ver más información →</button>
          </div>`
        )
        .setLngLat(punto.coords)

      popup.on('open', () => {
        const btn = popup.getElement()?.querySelector('.mpopup-ver-btn')
        if (btn) btn.onclick = () => onVerMasRef.current?.(punto)
      })

      popup.on('close', () => {
        popup.getElement()?.querySelector('audio')?.pause()
        if (!closingProgrammaticallyRef.current) {
          onPuntoClickRef.current?.(null)
        }
      })

      const marker = new mapboxgl.Marker(el)
        .setLngLat(punto.coords)
        .addTo(mapRef.current)

      el.addEventListener('click', (e) => {
        e.stopPropagation()
        onPuntoClickRef.current?.(punto)
      })

      markersRef.current.push({ id: punto.id, marker, el, popup })
    })
  }, [puntos, mapReady])

  // Marcador activo
  useEffect(() => {
    if (!mapReady || !mapRef.current) return

    markersRef.current.forEach(({ id, el, popup }) => {
      const isActive = activePunto?.id === id
      el.classList.toggle('map-marker--active', isActive)

      if (isActive && !popup.isOpen()) {
        popup.addTo(mapRef.current)
      }
      if (!isActive && popup.isOpen()) {
        closingProgrammaticallyRef.current = true
        popup.remove()
        closingProgrammaticallyRef.current = false
      }
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
