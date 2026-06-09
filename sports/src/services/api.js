import axios from 'axios';

// Datos de ejemplo para pruebas
const MOCK_MATCHES = [
  {
    id: 1,
    homeTeam: "Argentina",
    awayTeam: "Brasil",
    date: "2026-06-11",
    time: "15:00",
    stadium: "Estadio Monumental",
    liveUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Partido inaugural del campeonato mundial 2026",
    status: "En Vivo",
    score: "2 - 1"
  },
  {
    id: 2,
    homeTeam: "España",
    awayTeam: "Alemania",
    date: "2026-06-11",
    time: "18:00",
    stadium: "Estadio Azteca",
    liveUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Enfrentamiento de alto nivel",
    status: "Programado",
    score: null
  },
  {
    id: 3,
    homeTeam: "Francia",
    awayTeam: "Inglaterra",
    date: "2026-06-12",
    time: "20:00",
    stadium: "Maracaná",
    liveUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Choque de titanes",
    status: "Programado",
    score: null
  },
  {
    id: 4,
    homeTeam: "México",
    awayTeam: "Estados Unidos",
    date: "2026-06-12",
    time: "22:00",
    stadium: "Estadio BBVA",
    liveUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Clásico de CONCACAF",
    status: "Programado",
    score: null
  }
];

// Función para obtener partidos
export const fetchLiveMatches = async () => {
  console.log('Obteniendo partidos...');
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_MATCHES;
};

// Función para actualizaciones en tiempo real
export const startLiveUpdates = (callback, interval = 30000) => {
  const intervalId = setInterval(async () => {
    const matches = await fetchLiveMatches();
    callback(matches);
  }, interval);
  return intervalId;
};

// Obtener un partido específico por ID
export const getMatchById = async (matchId) => {
  const match = MOCK_MATCHES.find(m => m.id === matchId);
  return match || null;
};

// Actualizar la URL del video
export const updateMatchVideoUrl = async (matchId, videoUrl) => {
  console.log(`Actualizando match ${matchId} con URL: ${videoUrl}`);
  // En una versión real, aquí se actualizaría JSONBin
  return true;
};