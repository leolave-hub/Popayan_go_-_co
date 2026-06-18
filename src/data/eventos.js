export const CATEGORIAS_INFO = {
  Cultura:      { color: '#B5785A', icono: '⛪' },
  Música:       { color: '#7BAF8A', icono: '🎶' },
  Arte:         { color: '#6B8EAD', icono: '🎨' },
  Gastronomía:  { color: '#C4A35A', icono: '🍽' },
  Turismo:      { color: '#9B8EC4', icono: '🗺' },
  Deportes:     { color: '#D47B6A', icono: '⚽' },
}

export const EVENTOS = [
  {
    id: 1,
    titulo: 'Semana Santa de Popayán',
    categoria: 'Cultura',
    fechaInicio: '2026-03-29',
    fechaFin: '2026-04-05',
    hora: 'Todo el día',
    lugar: 'Centro histórico',
    descripcion:
      'Procesiones declaradas patrimonio cultural inmaterial de la humanidad por la UNESCO. Miles de nazarenos recorren el centro colonial bajo la luz de las antorchas.',
  },
  {
    id: 2,
    titulo: 'Festival Internacional de Música Religiosa',
    categoria: 'Música',
    fechaInicio: '2026-03-29',
    fechaFin: '2026-04-02',
    hora: '7:00 PM',
    lugar: 'Teatro Guillermo Valencia',
    descripcion:
      'El festival de música sacra y clásica más importante de Colombia, que acompaña las celebraciones de Semana Santa con coros y orquestas de talla mundial.',
  },
  {
    id: 3,
    titulo: 'Exposición: Arte Precolombino del Cauca',
    categoria: 'Arte',
    fechaInicio: '2026-06-01',
    fechaFin: '2026-08-31',
    hora: '10:00 AM – 6:00 PM',
    lugar: 'Museo Arqueológico de Popayán',
    descripcion:
      'Colección de más de 200 piezas arqueológicas de las culturas Tierradentro, San Agustín y Tumaco. Entrada libre los domingos.',
  },
  {
    id: 4,
    titulo: 'Recorridos por la Ciudad Blanca',
    categoria: 'Turismo',
    fechaInicio: '2026-06-18',
    fechaFin: '2026-12-31',
    hora: '9:00 AM (sáb y dom)',
    lugar: 'Parque Caldas – Punto de encuentro',
    descripcion:
      'Recorridos guiados por capillas, iglesias coloniales y miradores de Popayán con guías certificados. Cupos limitados, inscripción en el Punto de Información Turística.',
  },
  {
    id: 5,
    titulo: 'Tour Gastronómico del Centro Histórico',
    categoria: 'Gastronomía',
    fechaInicio: '2026-06-18',
    fechaFin: '2026-12-31',
    hora: '12:00 PM (vie, sáb y dom)',
    lugar: 'Centro histórico',
    descripcion:
      'Recorre los mejores restaurantes del centro y prueba empanadas de pipián, mote de queso, sopa de maní y postres tradicionales caucanos.',
  },
  {
    id: 6,
    titulo: 'Mercado Campesino del Cauca',
    categoria: 'Gastronomía',
    fechaInicio: '2026-06-20',
    fechaFin: '2026-06-22',
    hora: '8:00 AM – 4:00 PM',
    lugar: 'Parque Caldas',
    descripcion:
      'Productos frescos, artesanías y gastronomía típica traídos directamente por comunidades campesinas e indígenas de los municipios del Cauca.',
  },
  {
    id: 7,
    titulo: 'Festival de Cine de Popayán',
    categoria: 'Arte',
    fechaInicio: '2026-06-25',
    fechaFin: '2026-07-02',
    hora: '4:00 PM',
    lugar: 'Centro Cultural de Popayán',
    descripcion:
      'Festival internacional de cine con proyecciones de competencia, retrospectivas de cine latinoamericano, talleres y conversatorios con directores.',
  },
  {
    id: 8,
    titulo: 'Jazz en el Claustro',
    categoria: 'Música',
    fechaInicio: '2026-07-03',
    fechaFin: '2026-07-03',
    hora: '8:00 PM',
    lugar: 'Claustro de la Encarnación',
    descripcion:
      'Una noche de jazz en uno de los espacios coloniales más bellos de Popayán. Con artistas nacionales e invitados internacionales.',
  },
  {
    id: 9,
    titulo: 'Feria Gastronómica del Pacífico',
    categoria: 'Gastronomía',
    fechaInicio: '2026-07-15',
    fechaFin: '2026-07-20',
    hora: '11:00 AM – 9:00 PM',
    lugar: 'Plazoleta de San Francisco',
    descripcion:
      'Exposición de los sabores del litoral Pacífico: chontaduro, pusandao, arroz con leche y encocado de mariscos. Con demostraciones de cocina en vivo.',
  },
  {
    id: 10,
    titulo: 'Encuentro Nacional de Bandas',
    categoria: 'Música',
    fechaInicio: '2026-08-07',
    fechaFin: '2026-08-15',
    hora: '3:00 PM',
    lugar: 'Coliseo Los Andes y escenarios del centro',
    descripcion:
      'Una de las festividades musicales más importantes del sur de Colombia: bandas de música de todo el país compiten en desfile y concierto.',
  },
  {
    id: 11,
    titulo: 'Festival de Artes Plásticas del Cauca',
    categoria: 'Arte',
    fechaInicio: '2026-09-05',
    fechaFin: '2026-09-12',
    hora: '10:00 AM – 7:00 PM',
    lugar: 'Museo Guillermo Valencia',
    descripcion:
      'Muestra de pinturas, esculturas, fotografía y arte digital de artistas caucanos emergentes y consagrados. Con talleres abiertos al público.',
  },
  {
    id: 12,
    titulo: 'Festival de Danzas Folclóricas del Cauca',
    categoria: 'Cultura',
    fechaInicio: '2026-10-10',
    fechaFin: '2026-10-14',
    hora: '5:00 PM',
    lugar: 'Teatro Municipal',
    descripcion:
      'Celebración de los ritmos y tradiciones folclóricas de las comunidades indígenas, afrocolombianas y campesinas del departamento del Cauca.',
  },
  {
    id: 13,
    titulo: 'Carrera de Montaña Serranías del Cauca',
    categoria: 'Deportes',
    fechaInicio: '2026-11-08',
    fechaFin: '2026-11-08',
    hora: '6:00 AM',
    lugar: 'Salida: Parque Natural Munchique',
    descripcion:
      'Competencia de trail running por las montañas del Cauca. Distancias de 10 km, 21 km y 42 km. Inscripciones abiertas hasta octubre.',
  },
  {
    id: 14,
    titulo: 'Festival Navideño de la Ciudad Blanca',
    categoria: 'Cultura',
    fechaInicio: '2026-12-05',
    fechaFin: '2026-12-24',
    hora: '6:00 PM',
    lugar: 'Centro histórico y barrios tradicionales',
    descripcion:
      'Novenas, alumbrados, posadas y conciertos navideños en los barrios y plazas de Popayán. La mejor época para visitar la Ciudad Blanca.',
  },
]
