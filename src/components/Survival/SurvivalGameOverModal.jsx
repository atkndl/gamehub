import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { Trophy, RotateCcw, Home, Skull, Target, Flame, ArrowLeft } from 'lucide-react';

export default function SurvivalGameOverModal({ data }) {
  const { player, survivalRematch, returnToLobby } = useGame();

  useEffect(() => {
    try {
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.55 } });
      const t = setTimeout(() => {
        confetti({ particleCount: 90, angle: 60, spread: 60, origin: { x: 0, y: 0.6 } });
        confetti({ particleCount: 90, angle: 120, spread: 60, origin: { x: 1, y: 0.6 } });
      }, 300);
      return () => clearTimeout(t);
    } catch (e) {}
  }, []);

  if (!data) return null;

  const isHost = player?.isHost;
  const leaderboard = Array.isArray(data.leaderboard) ? data.leaderboard : [];
  const winner = leaderboard[0];
  const isBattleRoyale = data.mode === 'battle_royale';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-5 sm:p-6 text-center animate-scale-up my-auto">
        {/* Top Celebration Icon & Title */}
        <div className="relative mb-3 flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 mb-2">
            <Trophy className="w-8 h-8 fill-current" />
          </div>
          <h2 className="font-heading font-black text-2xl text-slate-900">
            {isBattleRoyale ? 'Çorba Parası Çıktı! 🍗' : 'Maç Sona Erdi! ⚔️'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {isBattleRoyale
              ? 'Kızıl gaz alanından sağ çıkıp sona kalan şampiyon oldu!'
              : 'Süre bitti, arenada en çok av yapan şampiyon oldu!'}
          </p>
        </div>

        {/* Winner Highlight Card */}
        {winner && (
          <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 border-2 border-amber-400/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none">{winner.avatar}</span>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-black text-sm text-slate-900">
                    {winner.name}
                  </span>
                  {winner.playerId === player?.id && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-emerald-500 text-white">
                      Sen
                    </span>
                  )}
                </div>
                <span className="text-xs text-amber-700 font-bold flex items-center gap-1">
                  👑 Arena Şampiyonu
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-heading font-black text-lg text-amber-600 block leading-tight">
                {winner.kills} Av
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {winner.damageDealt || 0} Hasar
              </span>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="mb-4 bg-slate-50 rounded-2xl border border-slate-200/80 p-3 text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Sıralama & İstatistikler:
          </span>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {leaderboard.map((item, idx) => {
              const isSelf = item.playerId === player?.id;

              return (
                <div
                  key={item.playerId}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                    isSelf
                      ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg font-heading font-black text-xs flex items-center justify-center shrink-0 ${
                        item.rank === 1
                          ? 'bg-amber-400 text-white'
                          : item.rank === 2
                          ? 'bg-slate-300 text-slate-700'
                          : item.rank === 3
                          ? 'bg-amber-700/60 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.rank}
                    </span>

                    <span className="text-base select-none">{item.avatar}</span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="font-heading font-bold text-xs text-slate-900 truncate">
                          {item.name}
                        </span>
                        {isSelf && (
                          <span className="text-[9px] font-black uppercase tracking-wider px-1 rounded-sm bg-blue-500 text-white shrink-0">
                            Sen
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.damageDealt || 0} Hasar • Dürbün: {item.scope || '1x'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span className="font-heading font-black text-xs text-slate-900 block">
                      {item.kills} Av
                    </span>
                    <span className={`text-[10px] font-bold ${item.isAlive ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {item.isAlive ? 'Hayatta' : 'Elendi'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex gap-2">
          {isHost ? (
            <>
              <button
                type="button"
                onClick={returnToLobby}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs tracking-wide transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Lobiye Dön
              </button>
              <button
                type="button"
                onClick={survivalRematch}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs tracking-wide shadow-md shadow-blue-500/20 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Yeniden Oyna
              </button>
            </>
          ) : (
            <div className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Oda sahibinin yeni oyunu başlatması bekleniyor...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
