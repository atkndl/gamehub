import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Volume2, VolumeX, Copy, Check, LogOut, Users, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { room, player, leaveRoom, soundEnabled, toggleSound, showToast } = useGame();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    showToast(`Oda kodu (${room.code}) kopyalandı! 📋`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <span className="text-xl font-black">G</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-xl tracking-tight text-slate-900">
                Game<span className="text-emerald-500">Hub</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                Wordle
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Çok Oyunculu Parti Oyunları</p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {room && (
            <>
              {/* Room Code Badge */}
              <button
                onClick={handleCopyCode}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition border border-slate-200/60 font-mono text-sm font-bold shadow-xs active:scale-95"
                title="Oda kodunu kopyalamak için tıkla"
              >
                <span className="text-xs text-slate-400 font-sans font-medium uppercase tracking-wider">Oda:</span>
                <span className="text-emerald-600 font-black">{room.code}</span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                )}
              </button>

              {/* Player count pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-semibold border border-slate-200/60 hidden sm:flex">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{room.players.length} Oyuncu</span>
              </div>
            </>
          )}

          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition active:scale-95"
            title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
            aria-label="Ses Ayarı"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Leave room button */}
          {room && (
            <button
              onClick={leaveRoom}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition border border-rose-200/60 active:scale-95"
              title="Odadan Ayrıl"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ayrıl</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
