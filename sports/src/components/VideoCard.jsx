import React, { useState } from 'react';

function VideoCard({ match }) {
  const [showVideo, setShowVideo] = useState(false);
  
  const formatDateTime = (date, time) => {
    if (!date) return 'Fecha por confirmar';
    
    const matchDate = new Date(`${date}T${time || '12:00'}`);
    return matchDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isLive = () => {
    return match.status === 'En Vivo';
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        {isLive() && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
              EN VIVO
            </div>
            {match.score && (
              <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-xs font-bold mt-2">
                {match.score}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative">
        {showVideo ? (
          <div className="relative pb-[56.25%] h-0">
            <iframe
              src={match.liveUrl}
              title={`${match.homeTeam} vs ${match.awayTeam}`}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div 
            className={`h-48 flex items-center justify-center cursor-pointer group transition-opacity ${
              isLive() 
                ? 'bg-gradient-to-br from-red-600 to-red-800 animate-pulse' 
                : 'bg-gradient-to-br from-gray-700 to-gray-900'
            }`}
            onClick={() => setShowVideo(true)}
          >
            <div className="text-center text-white">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                {isLive() ? '🔴' : '⚽'}
              </div>
              <div className="text-xl font-bold mb-2">
                {match.homeTeam} vs {match.awayTeam}
              </div>
              <button className="mt-3 bg-white text-gray-900 px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                {isLive() ? '▶ Ver En Vivo' : '▶ Ver Repetición'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">
          {match.homeTeam} 🆚 {match.awayTeam}
        </h3>
        
        <p className="text-gray-300 text-sm mb-4">
          {match.description}
        </p>
        
        <div className="space-y-2 text-sm border-t border-gray-700 pt-3">
          <div className="flex items-center text-gray-400">
            <span className="mr-2">📅</span>
            <span>{formatDateTime(match.date, match.time)}</span>
          </div>
          
          {match.stadium && (
            <div className="flex items-center text-gray-400">
              <span className="mr-2">🏟️</span>
              <span>{match.stadium}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoCard;