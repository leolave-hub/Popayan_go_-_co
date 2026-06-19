export const CATEGORIAS_INFO = {
  Cultura:     { color: '#B5785A' },
  Arte:        { color: '#6B8EAD' },
  Gastronomía: { color: '#C4A35A' },
  Turismo:     { color: '#9B8EC4' },
  Deportes:    { color: '#D47B6A' },
}

export const EVENTOS = [
  /* --- MARZO / ABRIL --- */
  {
    id: 1,
    titulo: 'Semana Santa de Popayán',
    categoria: 'Cultura',
    fechaInicio: '2026-03-29',
    fechaFin: '2026-04-05',
    hora: 'Todo el día',
    lugar: 'Centro histórico',
    descripcion: 'Procesiones declaradas Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO.',
  },

  /* --- JUNIO (Cluster de mitad de año) --- */
  {
    id: 2,
    titulo: 'Exposición Arte Precolombino',
    categoria: 'Arte',
    fechaInicio: '2026-06-08',
    fechaFin: '2026-06-12',
    hora: '10:00 AM – 6:00 PM',
    lugar: 'Museo Arqueológico de Popayán',
    descripcion: 'Muestra curada de piezas prehispánicas de las culturas Tierradentro y San Agustín.',
  },
  {
    id: 12,
    titulo: 'Conversatorio: Oro Prehispánico',
    categoria: 'Cultura',
    fechaInicio: '2026-06-10', // Coincide con la exposición el Miércoles 10
    fechaFin: '2026-06-10',
    hora: '4:00 PM',
    lugar: 'Auditorio Museo Arqueológico',
    descripcion: 'Charla académica sobre las técnicas de orfebrería de las culturas del sur occidente.',
  },
  {
    id: 3,
    titulo: 'Recorridos Ciudad Blanca',
    categoria: 'Turismo',
    fechaInicio: '2026-06-20',
    fechaFin: '2026-06-21',
    hora: '9:00 AM',
    lugar: 'Parque Caldas',
    descripcion: 'Ruta patrimonial guiada por expertos historiadores a través de casonas republicanas.',
  },
  {
    id: 4,
    titulo: 'Festival de Cine de Popayán',
    categoria: 'Arte',
    fechaInicio: '2026-06-25',
    fechaFin: '2026-06-28',
    hora: '4:00 PM',
    lugar: 'Teatro Guillermo Valencia',
    descripcion: 'Muestra oficial de cine independiente, cortometrajes y conversatorios.',
  },
  {
    id: 13,
    titulo: 'Encuentro de Realizadores',
    categoria: 'Cultura',
    fechaInicio: '2026-06-26', // Coincide con el Festival de Cine el Viernes 26 y Sábado 27
    fechaFin: '2026-06-27',
    hora: '10:00 AM',
    lugar: 'Centro Cultural del Cauca',
    descripcion: 'Foro abierto sobre los retos de la producción audiovisual en las regiones de Colombia.',
  },

  /* --- JULIO --- */
  {
    id: 5,
    titulo: 'Feria Gastronómica del Pacífico',
    categoria: 'Gastronomía',
    fechaInicio: '2026-07-15',
    fechaFin: '2026-07-19',
    hora: '11:00 AM – 9:00 PM',
    lugar: 'Plazoleta de San Francisco',
    descripcion: 'Muestra de cocinas tradicionales de la región del Pacífico y saberes ancestrales.',
  },

  /* --- AGOSTO --- */
  {
    id: 6,
    titulo: 'Festival de Jazz de Popayán',
    categoria: 'Arte',
    fechaInicio: '2026-08-13',
    fechaFin: '2026-08-16',
    hora: '7:00 PM',
    lugar: 'Auditorio Universidad del Cauca',
    descripcion: 'Encuentro internacional de música clásica y jazz con invitados de gala mundiales.',
  },
  {
    id: 14,
    titulo: 'Recital de Piano Afro-Colombiano',
    categoria: 'Cultura',
    fechaInicio: '2026-08-14', // Coincide con el Festival de Jazz el Viernes 14
    fechaFin: '2026-08-14',
    hora: '8:30 PM',
    lugar: 'Teatro Guillermo Valencia',
    descripcion: 'Fusión de música clásica de piano con ritmos tradicionales de las costas colombianas.',
  },

  /* --- SEPTIEMBRE (¡Gran Cluster de 3 eventos!) --- */
  {
    id: 7,
    titulo: 'Congreso Gastronómico',
    categoria: 'Gastronomía',
    fechaInicio: '2026-09-03',
    fechaFin: '2026-09-06',
    hora: 'Todo el día',
    lugar: 'Parque Caldas',
    descripcion: 'El evento culinario más grande del país. Popayán recibe a chefs y académicos mundiales.',
  },
  {
    id: 15,
    titulo: 'Salón de Catación de Cafés',
    categoria: 'Turismo',
    fechaInicio: '2026-09-04', // Coincide con el Congreso el Viernes 4 y Sábado 5
    fechaFin: '2026-09-05',
    hora: '9:00 AM - 4:00 PM',
    lugar: 'Sede Cámara de Comercio',
    descripcion: 'Experiencia de barismo y catación guiada con los mejores cafés especiales de altura del Cauca.',
  },
  {
    id: 16,
    titulo: 'Taller de Cocina Tradicional',
    categoria: 'Gastronomía',
    fechaInicio: '2026-09-05', // ¡EL SÁBADO 5 DE SEPTIEMBRE TENDRÁ 3 EVENTOS SIMULTÁNEOS!
    fechaFin: '2026-09-05',
    hora: '3:00 PM',
    lugar: 'Tarima Principal Parque Caldas',
    descripcion: 'Clase en vivo dictada por portadoras de la tradición culinaria del Patía.',
  },

  /* --- OCTUBRE --- */
  {
    id: 8,
    titulo: 'Simposio de Historia Colonial',
    categoria: 'Cultura',
    fechaInicio: '2026-10-15',
    fechaFin: '2026-10-17',
    hora: '8:00 AM - 1:00 PM',
    lugar: 'Casa Mosquera',
    descripcion: 'Ponencias magistrales sobre la arquitectura, conservación y archivos históricos.',
  },

  /* --- NOVIEMBRE --- */
  {
    id: 9,
    titulo: 'Clásica de Ciclismo Ciudad de Popayán',
    categoria: 'Deportes',
    fechaInicio: '2026-11-13',
    fechaFin: '2026-11-15',
    hora: '6:30 AM',
    lugar: 'Principales vías del Cauca',
    descripcion: 'Competición oficial del calendario nacional con llegada en el sector histórico.',
  },
  {
    id: 17,
    titulo: 'Expo Deporte y Salud',
    categoria: 'Turismo',
    fechaInicio: '2026-11-14', // Coincide con el ciclismo el Sábado 14 y Domingo 15
    fechaFin: '2026-11-15',
    hora: '10:00 AM - 7:00 PM',
    lugar: 'Complejo Deportivo',
    descripcion: 'Feria comercial y conferencias de nutrición y entrenamiento en el marco de la Clásica.',
  },

  /* --- DICIEMBRE --- */
  {
    id: 10,
    titulo: 'Ruta Navideña de Templos',
    categoria: 'Turismo',
    fechaInicio: '2026-12-16',
    fechaFin: '2026-12-23',
    hora: '6:00 PM - 9:00 PM',
    lugar: 'Circuito de Iglesias Centro',
    descripcion: 'Apertura nocturna coordinada de templos coloniales con iluminación artística.',
  },
  {
    id: 18,
    titulo: 'Recital de Coros Navideños',
    categoria: 'Cultura',
    fechaInicio: '2026-12-19', // Coincide con la Ruta Navideña el Sábado 19
    fechaFin: '2026-12-19',
    hora: '7:00 PM',
    lugar: 'Catedral Nuestra Señora de la Asunción',
    descripcion: 'Presentación especial de coros polifónicos infantiles interpretando villancicos clásicos.',
  },
  {
    id: 11,
    titulo: 'Concierto de Gala de Fin de Año',
    categoria: 'Cultura',
    fechaInicio: '2026-12-29',
    fechaFin: '2026-12-29',
    hora: '8:00 PM',
    lugar: 'Teatro Guillermo Valencia',
    descripcion: 'Cierre de la agenda cultural anual con la presentación de la Orquesta Sinfónica.',
  }
]