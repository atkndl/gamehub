import React, { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Navbar from './components/Navbar';
import Home from './components/Home/Home';
import Lobby from './components/Lobby/Lobby';
import WordleGame from './components/Wordle/WordleGame';
import SnakeGame from './components/Snake/SnakeGame';

function GameHubApp() {
  const { room, toastMessage } = useGame();

  // Check URL query parameters for ?oda=CODE on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomFromUrl = params.get('oda') || params.get('room');
    if (roomFromUrl && !room) {
      // You can store this or pass down to Home if needed
      window.__initialRoomCode = roomFromUrl.toUpperCase();
    }
  }, [room]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-slate-900/90 text-white text-xs sm:text-sm font-bold shadow-xl backdrop-blur-xs flex items-center gap-2 animate-bounce-subtle">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Router */}
      <main className="flex-1 flex flex-col">
        {!room ? (
          <Home />
        ) : room.gameState === 'lobby' ? (
          <Lobby />
        ) : room.selectedGame === 'snake' ? (
          <SnakeGame />
        ) : (
          <WordleGame />
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200/60 bg-white/50 text-center text-xs text-slate-400">
        <p>GameHub • Çok Oyunculu Türkçe Wordle & Parti Oyunları</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameHubApp />
    </GameProvider>
  );
}
