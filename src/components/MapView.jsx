import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const POPAYAN_CENTER = [-76.6147, 2.4448]
const INITIAL_ZOOM = 15
const INITIAL_PITCH = 60
const INITIAL_BEARING = -17

export default function MapView() {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: containerRef.current,
      // Mapbox Standard — most modern style available (GL JS v3)
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
      // Standard style exposes 3D buildings via config, not manual layers
      map.setConfigProperty('basemap', 'show3dObjects', true)
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
