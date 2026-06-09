import React, { useState, useEffect, useCallback } from 'react';
import VideoCard from './components/VideoCard';
import Header from './components/Header';
import AdminPanel from './components/AdminPanel';
import LiveScores from './components/LiveScores';
import { fetchLiveMatches, startLiveUpdates } from './services/api';  // ← Esta línea es correcta



function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showLiveScores, setShowLiveScores] = useState(true); // Estado para mostrar/ocultar LiveScores
  
  // Estado para la combinación de teclas
  const [keySequence, setKeySequence] = useState([]);

  const ADMIN_PASSWORD = '25340162';
  
  // Combinación secreta: presiona 'A', 'D', 'M', 'I', 'N' en orden
  const SECRET_CODE = ['a', 'd', 'm', 'i', 'n'];

  // Detectar combinación de teclas para mostrar el login
  useEffect(() => {
    const handleKeyPress = (event) => {
      const newSequence = [...keySequence, event.key.toLowerCase()];
      
      // Mantener solo las últimas 5 teclas
      if (newSequence.length > SECRET_CODE.length) {
        newSequence.shift();
      }
      
      setKeySequence(newSequence);
      
      // Verificar si la secuencia coincide
      if (newSequence.join('') === SECRET_CODE.join('')) {
        setShowAdmin(true);
        setKeySequence([]);
        // Pequeña vibración para feedback (opcional)
        if (window.navigator.vibrate) {
          window.navigator.vibrate(200);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keySequence]);

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchLiveMatches();
      
      const availableMatches = data.filter(match => 
        match.liveUrl && match.status === 'En Vivo'
      );
      
      setMatches(availableMatches);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error("Error loading matches:", err);
      setError("Error al cargar los partidos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  useEffect(() => {
    let intervalId = null;
    
    if (isAutoRefresh) {
      intervalId = startLiveUpdates((newMatches) => {
        const availableMatches = newMatches.filter(match => 
          match.liveUrl && match.status === 'En Vivo'
        );
        setMatches(availableMatches);
        setLastUpdate(new Date());
      }, 30000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoRefresh]);

  const handleManualRefresh = () => {
    loadMatches();
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
  };

  const handleAdminAccess = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowAdmin(true);
      setPassword('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 3000);
    }
  };

  const closeAdminPanel = () => {
    setShowAdmin(false);
    setIsAuthenticated(false);
    setPassword('');
    setPasswordError(false);
  };

  // Detectar tecla ESC para cerrar
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && showAdmin) {
        closeAdminPanel();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showAdmin]);

  if (loading && matches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl animate-pulse mb-4">Cargando partidos...</div>
          <div className="text-gray-400 text-sm">Buscando transmisiones en vivo</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Botón para alternar entre LiveScores y VideoCards */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800 rounded-lg p-1 flex gap-2">
            <button
              onClick={() => setShowLiveScores(true)}
              className={`px-6 py-2 rounded-lg transition-colors ${
                showLiveScores 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              📊 Marcadores en Vivo
            </button>
            <button
              onClick={() => setShowLiveScores(false)}
              className={`px-6 py-2 rounded-lg transition-colors ${
                !showLiveScores 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              🎥 Transmisiones
            </button>
          </div>
        </div>

        {/* Mostrar LiveScores o VideoCards según el estado */}
        {showLiveScores ? (
          <>
            <LiveScores />
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 bg-gray-800 p-4 rounded-lg flex-wrap gap-3">
              <div className="text-gray-300 text-sm">
                📡 Última actualización: {lastUpdate.toLocaleTimeString()}
              </div>
              <div className="space-x-3">
                <button
                  onClick={toggleAutoRefresh}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isAutoRefresh 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {isAutoRefresh ? '⏸️ Auto-refresh ON' : '▶️ Auto-refresh OFF'}
                </button>
                <button
                  onClick={handleManualRefresh}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  🔄 Actualizar ahora
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
                ⚠️ {error}
              </div>
            )}

            {matches.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚽</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No hay partidos en vivo en este momento
                </h3>
                <p className="text-gray-400">
                  Vuelve más tarde para ver las transmisiones del campeonato 2026
                </p>
                <button
                  onClick={handleManualRefresh}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Buscar partidos
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {matches.map((match) => (
                <VideoCard key={match.id} match={match} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Modal de autenticación (sin botón visible) */}
      {showAdmin && !isAuthenticated && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 w-96 max-w-full shadow-2xl transform transition-all">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🔒</div>
              <h2 className="text-2xl font-bold text-white">Acceso Administrador</h2>
              <p className="text-gray-400 text-sm mt-2">Ingresa la contraseña para continuar</p>
            </div>
            
            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminAccess()}
                placeholder="Contraseña"
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                autoFocus
              />
              
              {passwordError && (
                <div className="text-red-500 text-sm text-center animate-pulse">
                  ❌ Contraseña incorrecta
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={closeAdminPanel}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdminAccess}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Entrar
                </button>
              </div>
            </div>
            
            <div className="text-center text-gray-500 text-xs mt-4">
              🔑 Combinación secreta: ADMIN | Presiona ESC para cerrar
            </div>
          </div>
        </div>
      )}

      {/* Panel de administración (solo visible después de autenticar) */}
      {showAdmin && isAuthenticated && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeAdminPanel}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <AdminPanel onClose={closeAdminPanel} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;