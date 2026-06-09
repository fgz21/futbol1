import React from 'react';

function Header() {
  return (
    <header className="bg-gradient-to-r from-red-600 to-blue-600 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
          🌍 Campeonato Mundial 2026
        </h1>
        <p className="text-white text-center mt-2 text-lg">
          Partidos en vivo desde el 11 de junio
        </p>
        <div className="text-center mt-3">
          <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-semibold animate-pulse">
            🎯 Comienza el 11 de Junio, 2026
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;