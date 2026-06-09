import React, { useState, useEffect } from 'react';
import { getLiveMatches, filterMatchesByCategory } from '../services/sportscoreApi';

function LiveScores() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSport, setSelectedSport] = useState('football');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const deportes = [
    { id: 'football', nombre: '⚽ Fútbol', icono: '⚽' },
    { id: 'basketball', nombre: '🏀 Baloncesto', icono: '🏀' },
    { id: 'baseball', nombre: '⚾ Béisbol', icono: '⚾' },
    { id: 'tennis', nombre: '🎾 Tenis', icono: '🎾' }
  ];

  const categorias = [
    { id: 'all', nombre: '📋 Todos', icono: '📋' },
    { id: 'Mundial', nombre: '🏆 Mundial', icono: '🏆' },
    { id: 'Liga Nacional', nombre: '🇪🇸 Liga', icono: '🇪🇸' },
    { id: 'Grand Slam', nombre: '🎾 Grand Slam', icono: '🎾' },
    { id: 'Amistoso', nombre: '🤝 Amistoso', icono: '🤝' },
    { id: 'live', nombre: '🔴 En Vivo', icono: '🔴' },
    { id: 'pending', nombre: '⏰ Próximos', icono: '⏰' }
  ];

  const loadMatches = async () => {
    try {
      setLoading(true);
      let data;
      
      if (selectedCategory === 'all' || selectedCategory === 'live' || selectedCategory === 'pending') {
        data = await getLiveMatches(selectedSport);
        let matchesData = data.matches;
        
        if (selectedCategory === 'live') {
          matchesData = matchesData.filter(m => m.status === 'live');
        } else if (selectedCategory === 'pending') {
          matchesData = matchesData.filter(m => m.status === 'pending');
        }
        
        setMatches(matchesData);
      } else {
        data = await filterMatchesByCategory(selectedSport, selectedCategory);
        setMatches(data.matches);
      }
      
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError('No se pudieron cargar los partidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [selectedSport, selectedCategory]);

  useEffect(() => {
    const interval = setInterval(loadMatches, 30000);
    return () => clearInterval(interval);
  }, [selectedSport, selectedCategory]);

  const getStatusBadge = (match) => {
    if (match.status === 'live') {
      return (
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          <span className="text-red-500 text-xs font-bold">EN VIVO</span>
          {match.minute && <span className="text-gray-400 text-xs">({match.minute})</span>}
        </div>
      );
    } else if (match.status === 'finished') {
      return <span className="text-gray-500 text-xs">FINALIZADO</span>;
    } else {
      return <span className="text-blue-400 text-xs">{match.time}</span>;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Mundial': 'bg-yellow-900 text-yellow-300',
      'Liga Nacional': 'bg-blue-900 text-blue-300',
      'Grand Slam': 'bg-purple-900 text-purple-300',
      'Amistoso': 'bg-green-900 text-green-300',
      'Continental': 'bg-indigo-900 text-indigo-300',
      'Eliminatorias': 'bg-orange-900 text-orange-300'
    };
    return colors[category] || 'bg-gray-700 text-gray-300';
  };

  if (loading && matches.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-white animate-pulse">Cargando marcadores en vivo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500">{error}</div>
        <button onClick={loadMatches} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {/* Selector de deportes */}
      <div className="mb-6">
        <div className="flex gap-2 flex-wrap border-b border-gray-700 pb-3">
          {deportes.map(sport => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedSport === sport.id 
                  ? 'bg-blue-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {sport.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de categorías */}
      <div className="mb-6">
        <div className="flex gap-2 flex-wrap">
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                selectedCategory === cat.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Última actualización */}
      <div className="text-right text-gray-500 text-xs mb-4">
        📡 Actualizado: {lastUpdate.toLocaleTimeString()}
      </div>

      {/* Lista de partidos */}
      {matches.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No hay partidos disponibles en esta categoría
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {matches.map((match) => (
            <div key={match.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all duration-200">
              {/* Categoría del torneo */}
              <div className="mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(match.league.category)}`}>
                  {match.league.logo} {match.league.name} - {match.league.round}
                </span>
              </div>

              {/* Equipos y marcador */}
              <div className="flex justify-between items-center">
                <div className="flex-1 text-right">
                  <span className="text-white font-semibold text-lg">
                    {match.home_team.flag} {match.home_team.name}
                  </span>
                  {match.home_team.ranking && (
                    <span className="text-gray-400 text-xs ml-1">(#{match.home_team.ranking})</span>
                  )}
                </div>
                
                <div className="mx-4 text-center min-w-[100px]">
                  <div className="text-2xl font-bold text-white">
                    {match.home_score !== null && match.home_score !== undefined ? match.home_score : '-'} - {match.away_score !== null && match.away_score !== undefined ? match.away_score : '-'}
                  </div>
                  <div className="mt-1">
                    {getStatusBadge(match)}
                  </div>
                </div>
                
                <div className="flex-1 text-left">
                  <span className="text-white font-semibold text-lg">
                    {match.away_team.name} {match.away_team.flag}
                  </span>
                  {match.away_team.ranking && (
                    <span className="text-gray-400 text-xs ml-1">(#{match.away_team.ranking})</span>
                  )}
                </div>
              </div>

              {/* Fecha y hora */}
              <div className="text-center text-gray-400 text-xs mt-3 pt-2 border-t border-gray-600">
                {match.date} • {match.time}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-gray-500 text-xs mt-4 pt-3 border-t border-gray-700">
        <span>📊 Datos en tiempo real - Copa Mundial 2026 y más competiciones</span>
      </div>
    </div>
  );
}

export default LiveScores;