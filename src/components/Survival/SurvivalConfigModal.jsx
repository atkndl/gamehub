import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { X, Flame, Swords, Clock, Check, Shield, Crosshair } from 'lucide-react';

export default function SurvivalConfigModal({ isOpen, onClose }) {
  const { room, player, updateSurvivalConfig } = useGame();
  const isHost = player?.isHost;

  const currentConfig = room?.survivalConfig || {
    mode: 'battle_royale',
    matchDuration: 180
  };

  const [mode, setMode] = useState(currentConfig.mode || 'battle_royale');
  const [matchDuration, setMatchDuration] = useState(currentConfig.matchDuration || 180);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!isHost) {
      onClose();
      return;
    }
    updateSurvivalConfig({ mode, matchDuration });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 text-slate-800 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎖️</span>
            <div>
              <h2 className="font-heading font-black text-xl text-slate-900 leading-tight">
                Survival Ayarları
              </h2>
              <p className="text-xs text-slate-500">2D Hayatta Kalma & Savaş Modu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Oyun Modu:
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Alan Modu (Battle Royale) */}
            <button
              type="button"
              disabled={!isHost}
              onClick={() => setMode('battle_royale')}
              className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                mode === 'battle_royale'
                  ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Flame className="w-5 h-5 text-emerald-600" />
                {mode === 'battle_royale' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </div>
              <div>
                <span className="font-heading font-black text-sm text-slate-900 block">
                  Alan Modu
                </span>
                <span className="text-[11px] text-slate-500 font-medium leading-tight block mt-0.5">
                  Kızıl gaz daralır, sona kalan kazanır!
                </span>
              </div>
            </button>

            {/* Maç Modu (Deathmatch) */}
            <button
              type="button"
              disabled={!isHost}
              onClick={() => setMode('deathmatch')}
              className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                mode === 'deathmatch'
                  ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Swords className="w-5 h-5 text-amber-600" />
                {mode === 'deathmatch' && (
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                )}
              </div>
              <div>
                <span className="font-heading font-black text-sm text-slate-900 block">
                  Maç Modu
                </span>
                <span className="text-[11px] text-slate-500 font-medium leading-tight block mt-0.5">
                  Süre boyunca en çok leş alan kazanır!
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Match Duration (Only if Deathmatch) */}
        {mode === 'deathmatch' && (
          <div className="mb-5 animate-fade-in">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Maç Süresi:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '2 Dakika', val: 120 },
                { label: '3 Dakika', val: 180 },
                { label: '5 Dakika', val: 300 }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  disabled={!isHost}
                  onClick={() => setMatchDuration(opt.val)}
                  className={`py-2 px-3 rounded-xl border-2 text-center text-xs font-bold transition cursor-pointer ${
                    matchDuration === opt.val
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>🔭</span>
            <span><strong>2x, 4x, 8x Dürbünler:</strong> Görüş alanınızı genişletip uzak menzilli atışlar yapın.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌿</span>
            <span><strong>Çalılar & Siperler:</strong> Çalılara gizlenerek pusu kurun veya taş binalarda siper alın.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📦</span>
            <span><strong>Kutuları Kır:</strong> Yumruk veya kurşunla sandıkları kırıp silah ve zırh lootlayın!</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs transition cursor-pointer"
          >
            Vazgeç
          </button>
          {isHost && (
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Kaydet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
