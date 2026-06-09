import React, { useState, useEffect } from 'react';
import { getMatchById, updateMatchVideoUrl, fetchLiveMatches } from '../services/api';

function AdminPanel({ onClose }) {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadMatches = async () => {
      const data = await fetchLiveMatches();
      setMatches(data);
    };
    loadMatches();
  }, []);

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setVideoUrl(match.liveUrl || '');
  };

  const saveVideoUrl = async () => {
    if (!selectedMatch) return;
    
    const success = await updateMatchVideoUrl(selectedMatch.id, videoUrl);
    setMessage(success ? '✅ Video asignado correctamente' : '❌ Error al guardar');
    setTimeout(() => setMessage(''), 3000);
    
    if (success) {
      const data = await fetchLiveMatches();
      setMatches(data);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl w-96 max-w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">🔒 Panel Administrador</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white text-2xl transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Seleccionar Partido:</label>
          <select 
            onChange={(e) => {
              const match = matches.find(m => m.id === parseInt(e.target.value));
              handleSelectMatch(match);
            }}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled>Selecciona un partido</option>
            {matches.map(match => (
              <option key={match.id} value={match.id}>
                {match.homeTeam} vs {match.awayTeam} - {match.status}
              </option>
            ))}
          </select>
        </div>

        {selectedMatch && (
          <>
            <div className="bg-gray-700 p-3 rounded">
              <p className="text-white font-bold">{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</p>
              <p className="text-gray-300 text-sm">{selectedMatch.date} - {selectedMatch.stadium}</p>
              <p className="text-gray-400 text-xs mt-1">Estado: {selectedMatch.status}</p>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">URL del Video (YouTube Embed):</label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
              />
              <p className="text-gray-400 text-xs mt-1">
                💡 Ejemplo: https://www.youtube.com/embed/dQw4w9WgXcQ
              </p>
            </div>

            <button 
              onClick={saveVideoUrl} 
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors font-semibold"
            >
              Guardar Video
            </button>
          </>
        )}

        {message && (
          <div className="text-center text-green-400 font-semibold animate-pulse">
            {message}
          </div>
        )}

        <div className="text-center text-gray-500 text-xs border-t border-gray-700 pt-3">
          🔒 Panel seguro | Presiona ESC para cerrar
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;