import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { Trophy, RotateCcw, Home, Skull, Award, Zap, Shield, Flame, Snowflake, LogOut } from 'lucide-react';
import { SNAKE_CLASSES } from './SnakeClassModal';

export default function SnakeGameOverModal({ data }) {
  const { player, snakeRematch, returnToLobby, leaveRoom } = useGame();

  useEffect(() => {
    try {
      confetti({ particleCount: 130, spread: 80, origin: { y: 0.55 } });
      const t1 = setTimeout(() => {
        confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0, y: 0.6 } });
        confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1, y: 0.6 } });
      }, 350);
      return () => clearTimeout(t1);
    } catch (e) {}
  }, []);

  if (!data) return null;

  const isHost = player?.isHost;
  const leaderboard = Array.isArray(data.leaderboard) ? data.leaderboard : [];
  const winner = leaderboard[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-5 sm:p-6 text-center animate-scale-up my-auto">
        {/* Top Trophy & Celebration */}
        <div className="relative mb-3 flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 mb-2">
            <Trophy className="w-8 h-8 fill-current" />
          </div>
          <h2 className="font-heading font-black text-2xl text-slate-900">
            Yılan Arenası Sona Erdi!
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Sona kalan hayatta kalır ve zaferi kazanır!
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
                {winner.score} P
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {winner.kills} Rakip Avlandı
              </span>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="mb-4 bg-slate-50 rounded-2xl border border-slate-200/80 p-3 text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Sıralama & Skor Tablosu:
          </span>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {leaderboard.map((item, idx) => {
              const isSelf = item.playerId === player?.id;
              const classInfo = SNAKE_CLASSES[item.snakeClass] || SNAKE_CLASSES.speed;

              return (
                <div
                  key={item.playerId}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition ${
                    isSelf
                      ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg font-heading font-black text-xs flex items-center justify-center shrink-0 ${
                        item.rank === 1
                          ? 'bg-amber-400 text-white'
                          : item.rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : item.rank === 3
                          ? 'bg-amber-700/60 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <span className="text-xl select-none shrink-0">{item.avatar}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.name}
                        </span>
                        {isSelf && (
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-emerald-500 text-white">
                            Sen
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        {classInfo.icon} {classInfo.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Skull className="w-3.5 h-3.5 text-red-500" />
                      {item.kills}
                    </span>
                    <span className="font-heading font-black text-xs sm:text-sm text-slate-800">
                      {item.score} P
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5 justify-center items-center">
          {isHost ? (
            <>
              <button
                onClick={snakeRematch}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-black text-sm tracking-wide shadow-md shadow-emerald-500/25 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Yeniden Oyna
              </button>

              <button
                onClick={returnToLobby}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Lobiye Dön
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                👑 Oda sahibi yeni maç başlatabilir veya odayı lobiye döndürebilir...
              </span>
              <button
                onClick={leaveRoom}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Ayrıl
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
