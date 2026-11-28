import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { Trophy, RotateCcw, Home, Flag, Timer, Zap, Gauge } from 'lucide-react';

export default function RacingGameOverModal({ data }) {
  const { player, racingRematch, returnToLobby } = useGame();

  useEffect(() => {
    try {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.55 } });
      const t = setTimeout(() => {
        confetti({ particleCount: 100, angle: 60, spread: 65, origin: { x: 0, y: 0.6 } });
        confetti({ particleCount: 100, angle: 120, spread: 65, origin: { x: 1, y: 0.6 } });
      }, 300);
      return () => clearTimeout(t);
    } catch (e) {}
  }, []);

  if (!data) return null;

  const isHost = player?.isHost;
  const standings = Array.isArray(data.standings) ? data.standings : [];
  const winner = standings[0];

  const formatLapTime = (sec) => {
    if (!sec || sec >= 9990) return '--:--.---';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 1000);
    return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const getCarColorBadge = (color) => {
    switch (color) {
      case 'red': return { bg: 'bg-red-500', text: 'Kırmızı' };
      case 'blue': return { bg: 'bg-blue-500', text: 'Mavi' };
      case 'green': return { bg: 'bg-emerald-500', text: 'Yeşil' };
      case 'yellow': return { bg: 'bg-amber-400', text: 'Sarı' };
      case 'black': return { bg: 'bg-slate-800', text: 'Siyah' };
      default: return { bg: 'bg-red-500', text: color };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-5 sm:p-6 text-center animate-scale-up my-auto">
        {/* Top Celebration Icon & Title */}
        <div className="relative mb-3 flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 mb-2">
            <Trophy className="w-8 h-8 fill-current" />
          </div>
          <h2 className="font-heading font-black text-2xl text-slate-900 flex items-center gap-2">
            🏁 Dama Bayrağı Düştü!
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Pistteki kıyasıya rekabet ve drift mücadelesi sona erdi!
          </p>
        </div>

        {/* Winner Highlight Card */}
        {winner && (
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 border-2 border-amber-400/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="text-3xl select-none">🏎️</span>
                <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${getCarColorBadge(winner.carColor).bg}`} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black text-sm text-slate-900">
                    {winner.name}
                  </span>
                  {winner.id === player?.id && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-emerald-500 text-white">
                      Sen
                    </span>
                  )}
                </div>
                <span className="text-xs text-amber-700 font-bold flex items-center gap-1">
                  👑 Grand Prix Şampiyonu
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-heading font-black text-base text-amber-600 block leading-tight">
                {formatLapTime(winner.totalTime)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 justify-end">
                <Zap className="w-3 h-3 text-amber-500" />
                En İyi: {formatLapTime(winner.bestLapTime)}
              </span>
            </div>
          </div>
        )}

        {/* Standings Table */}
        <div className="mb-4 bg-slate-50 rounded-2xl border border-slate-200/80 p-3 text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5 text-slate-400" />
            Yarış Sonuçları & Tur Süreleri:
          </span>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {standings.map((item, idx) => {
              const isSelf = item.id === player?.id;
              const badge = getCarColorBadge(item.carColor);

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                    isSelf
                      ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg font-heading font-black text-xs flex items-center justify-center shrink-0 ${
                        idx === 0
                          ? 'bg-amber-400 text-white shadow-xs'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-700'
                          : idx === 2
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </span>

                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${badge.bg}`} />
                      <span className="font-semibold text-xs text-slate-800 truncate">
                        {item.name}
                      </span>
                      {isSelf && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1 rounded bg-blue-100 text-blue-700">
                          Sen
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <div>
                      <div className="text-[11px] font-mono font-bold text-slate-700">
                        {formatLapTime(item.totalTime)}
                      </div>
                      <div className="text-[9px] font-mono text-slate-400">
                        ⚡ {formatLapTime(item.bestLapTime)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          {isHost ? (
            <button
              onClick={racingRematch}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-heading font-bold text-sm shadow-md shadow-red-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Tekrar Yarış
            </button>
          ) : (
            <div className="flex-1 py-3 px-3 rounded-2xl bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Oda sahibinin yarışı başlatması bekleniyor...
            </div>
          )}

          <button
            onClick={returnToLobby}
            className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Lobiye Dön
          </button>
        </div>
      </div>
    </div>
  );
}
