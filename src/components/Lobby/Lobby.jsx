import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import WordleConfigModal from './WordleConfigModal';
import LiveChat from '../Common/LiveChat';
import { Copy, Check, Share2, Play, Users, Crown, Settings2, CheckCircle2, Plus } from 'lucide-react';

export default function Lobby() {
  const { room, player, showToast, updateProfile, startWordle } = useGame();
  const [copied, setCopied] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);

  if (!room) return null;

  const isHost = player?.isHost;
  const wordleConfig = room.wordleConfig || {
    wordCount: 5,
    mode: 'speed',
    scoringType: 'speed',
    wordPool: 'common'
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    showToast(`Oda kodu (${room.code}) kopyalandı! 📋`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}?oda=${room.code}`;
    navigator.clipboard.writeText(url);
    showToast('Davet bağlantısı kopyalandı! 🔗');
  };

  const handleToggleReady = () => {
    if (isHost) return;
    updateProfile({ ready: !player.ready });
  };

  const handleStart = async () => {
    if (!isHost) return;
    try {
      await startWordle();
    } catch (e) {}
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-heading font-black text-lg shadow-xs shrink-0">
            GH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Oda</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-wider">
                {room.code}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 cursor-pointer"
                title="Kodu Kopyala"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500">{room.players.length} Oyuncu Lobide</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            Davet Linki
          </button>
        </div>
      </div>

      {/* Main Grid: Clean Game Grid on Left, Players & Chat on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Minimal Game Grid (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-heading font-black text-lg text-slate-900">
              Oyunlar
            </h2>
            <span className="text-xs text-slate-400">1 Oyun Aktif</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Wordle (Clean & Focused) */}
            <div className="bg-white rounded-2xl p-5 border-2 border-emerald-500/80 shadow-md shadow-emerald-500/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1 items-center font-heading font-black text-xs text-white">
                    <span className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center">W</span>
                    <span className="w-7 h-7 rounded-md bg-amber-400 flex items-center justify-center">O</span>
                    <span className="w-7 h-7 rounded-md bg-slate-700 flex items-center justify-center">R</span>
                    <span className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center">D</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Aktif
                  </span>
                </div>

                <h3 className="font-heading font-black text-base text-slate-900 mb-0.5">
                  Türkçe Wordle
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  5 Harf • 6 Deneme • 1-12 Kişi
                </p>

                {/* Settings Pill */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-semibold mb-4 flex items-center justify-between">
                  <span>{wordleConfig.wordCount} Kelime</span>
                  <span className="text-slate-300">•</span>
                  <span>{wordleConfig.mode === 'speed' ? '⚡ Hız Modu' : '🎯 Puan Modu'}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">{wordleConfig.wordPool === 'common' ? 'Yaygın' : 'Zor'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                {isHost ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfigModalOpen(true)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      title="Ayarları Düzenle"
                    >
                      <Settings2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleStart}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-heading font-bold text-xs tracking-wide shadow-xs active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Oyunu Başlat
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfigModalOpen(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    Kuralları Gör (Host Başlatacak)
                  </button>
                )}
              </div>
            </div>

            {/* Card 2: Minimal Placeholder slot */}
            <div className="bg-slate-50/60 rounded-2xl p-5 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center min-h-[180px]">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-xs text-slate-600">Yeni Oyun</span>
              <span className="text-[11px] text-slate-400 mt-0.5">Yakında Eklenecek</span>
            </div>
          </div>
        </div>

        {/* Right: Players & Chat */}
        <div className="space-y-4">
          {/* Players List */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                Oyuncular ({room.players.length})
              </h3>
              {!isHost && (
                <button
                  onClick={handleToggleReady}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    player?.ready
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {player?.ready ? 'Hazırım ✓' : 'Hazır Ol'}
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {room.players.map((p) => (
                <div
                  key={p.id}
                  className={`p-2 rounded-xl flex items-center justify-between text-xs border ${
                    p.id === player?.id
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-slate-50/70 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl select-none">{p.avatar}</span>
                    <span className="font-bold text-slate-800 truncate">{p.name}</span>
                    {p.id === player?.id && (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1 py-0.2 rounded-sm">
                        Sen
                      </span>
                    )}
                  </div>

                  <div>
                    {p.isHost ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
                        <Crown className="w-3 h-3 text-amber-600" />
                        Host
                      </span>
                    ) : p.ready ? (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" />
                        Hazır
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Bekliyor</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Chat */}
          <LiveChat title="Lobi Sohbeti" />
        </div>
      </div>

      {/* Wordle Config Modal */}
      <WordleConfigModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
      />
    </div>
  );
}
